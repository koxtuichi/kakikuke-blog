import Link from 'next/link'
import {useRouter} from 'next/router'
import Header from '../../components/header'
import Heading from '../../components/heading'
import components from '../../components/dynamic'
import ReactJSXParser from '@zeit/react-jsx-parser'
import blogStyles from '../../styles/blog.module.css'
import { textBlock } from '../../lib/notion/renderers'
import getPageData from '../../lib/notion/getPageData'
import React, { CSSProperties, useEffect } from 'react'
import { getTagLink, getBlogLink, getDate } from '../../lib/blog-helpers'
import Moment from 'react-moment';
import MouseCursor from '../../lib/notion/mouseCursor'
import { getAllPosts, getPostBySlug } from '../../lib/notion/client'

export async function getStaticProps({ params: { slug }, preview }) {
  // console.log(`Building page: ${slug}`)

  const post = await getPostBySlug(slug);
  const postData = await getPageData(post.PageId)
  const content = postData.blocks
  
  return {
    props: {
      post,
      preview: preview || false,
      content,
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  return {
    paths: posts.map(post => getBlogLink(post.Slug)),
    fallback: true,
  }
}

const listTypes = new Set(['bulleted_list', 'numbered_list'])

const RenderPost = ({ post, redirect, preview, content }) => {
  const router = useRouter()

  let listTagName: string | null = null
  let listLastId: string | null = null
  let listMap: {
    [id: string]: {
      key: string
      isNested?: boolean
      nested: string[]
      children: React.ReactFragment
    }
  } = {}

  useEffect(() => {
    if (redirect && !post) {
      router.replace(redirect)
    }
  }, [redirect, post])

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const url = `https%3A%2F%2Fxn--n8jdoikmo8i.com%2Fblog%2F${encodeURIComponent(encodeURIComponent(post.Slug))}`

  return (
    <React.Fragment>
      <Header titlePre={post.Page} className="mt-6" />
      <MouseCursor />
      {preview && (
        <div className={blogStyles.previewAlertContainer}>
          <div className={blogStyles.previewAlert}>
            <b>Note:</b>
            {` `}Viewing in preview mode{' '}
            <Link href={`/api/clear-preview?slug=${post.Slug}`}>
              <button className={blogStyles.escapePreview}>Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      <div className={blogStyles.post}>
        <h2>{post.Page || ''}</h2>

        <div style={{ display: 'block' }}>
          {post.Date && (
            <Moment format="//YYYY-MM-DD">{getDate(post.Date)}</Moment>
          )}

          {post.Tag.map((tag, i) =>
            <div key={i} style={{ marginLeft: '10px', fontSize: '14px', display: 'inline-flex' }}>
              <Link key={i} href="/tag/[tag]" as={getTagLink(tag)}>
                <a key={i}>#{tag}</a>
              </Link>
            </div>
          )}
        </div>

        <hr />

        {(!content || content.length === 0) && (
          <p>助けて～記事が取得できないよぉお</p>
        )}

        {(content || []).map((block, blockIdx) => {
          const { value } = block
          const { type, properties, id, parent_id, format } = value
          const isLast = blockIdx === content.length - 1
          const isList = listTypes.has(type)
          let toRender = []

          if (isList) {
            listTagName = components[type === 'bulleted_list' ? 'ul' : 'ol']
            listLastId = `list${id}`

            listMap[id] = {
              key: id,
              nested: [],
              children: textBlock(properties.title, true, id),
            }

            if (listMap[parent_id]) {
              listMap[id].isNested = true
              listMap[parent_id].nested.push(id)
            }
          }

          if (listTagName && (isLast || !isList)) {
            toRender.push(
              React.createElement(
                listTagName,
                { key: listLastId! },
                Object.keys(listMap).map(itemId => {
                  if (listMap[itemId].isNested) return null

                  const createEl = item =>
                    React.createElement(
                      components.li || 'ul',
                      { key: item.key },
                      item.children,
                      item.nested.length > 0
                        ? React.createElement(
                            components.ul || 'ul',
                            { key: item + 'sub-list' },
                            item.nested.map(nestedId =>
                              createEl(listMap[nestedId])
                            )
                          )
                        : null
                    )
                  return createEl(listMap[itemId])
                })
              )
            )
            listMap = {}
            listLastId = null
            listTagName = null
          }

          const renderHeading = (Type: string | React.ComponentType) => {
            toRender.push(
              <Heading key={id}>
                <Type key={id}>{textBlock(properties.title, true, id)}</Type>
              </Heading>
            )
          }

          switch (type) {
            case 'page':
            case 'divider':
              break
            case 'text':
              if (properties) {
                properties && properties.title[0][0] === ' ' ?
                toRender.push(
                  <React.Fragment key={id}>
                    <div style={{ 
                      color: COLOR_MAP[format && format.block_color] || 'inherit',
                      backgroundColor: BK_COLOR_MAP[format && format.block_color] || 'inherit',
                      borderRadius: '5px' }}
                      > 
                      <br />
                    </div>
                  </React.Fragment>
                  )
                :
                toRender.push(
                <div key={id} style={{ display: 'flex' }}>
                  <p style={{
                    color: COLOR_MAP[format && format.block_color] || 'inherit',
                    backgroundColor: BK_COLOR_MAP[format && format.block_color] || 'inherit',
                    padding: '0 5px',
                    borderRadius: '5px'
                  }}>{properties.title}</p>
                  <div />
                </div>)
              }
              break
            case 'image':
            case 'video':
            case 'embed': {
              const { format = {} } = value
              const {
                block_width,
                block_height,
                display_source,
                block_aspect_ratio,
              } = format
              const baseBlockWidth = 768
              const roundFactor = Math.pow(10, 2)
              // calculate percentages
              const width = block_width
                ? `${Math.round(
                    (block_width / baseBlockWidth) * 100 * roundFactor
                  ) / roundFactor}%`
                : block_height || '100%'

              const isImage = type === 'image'
              const Comp = isImage ? 'img' : 'video'
              const useWrapper = block_aspect_ratio && !block_height
              const childStyle: CSSProperties = useWrapper
                ? {
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    position: 'absolute',
                    top: 0,
                  }
                : {
                    width: '100%',
                    border: 'none',
                    display: 'block',
                  }

              let child = null

              if (!isImage && !value.file_ids) {
                // external resource use iframe
                child = (
                  <iframe
                    style={childStyle}
                    src={display_source}
                    key={!useWrapper ? id : undefined}
                    className='asset-wrapper hov_img_noLink'
                  />
                )
              } else {
                // notion resource
                child = (
                  <Comp
                    key={!useWrapper ? id : undefined}
                    src={`/api/asset?assetUrl=${encodeURIComponent(
                      display_source as any
                    )}&blockId=${id}`}
                    controls={!isImage}
                    alt={`An ${isImage ? 'image' : 'video'} from Notion`}
                    loop={!isImage}
                    muted={!isImage}
                    autoPlay={!isImage}
                    style={childStyle}
                  />
                )
              }

              toRender.push(
                useWrapper ? (
                  <div
                    style={{
                      paddingTop: `${Math.round(block_aspect_ratio * 100)}%`,
                      position: 'relative',
                    }}
                    className="asset-wrapper hov_img_noLink"
                    key={id}
                  >
                    {child}
                  </div>
                ) : (
                  child
                )
              )
              break
            }
            case 'header':
              renderHeading('h1')
              break
            case 'sub_header':
              renderHeading('h2')
              break
            case 'sub_sub_header':
              renderHeading('h3')
              break
            case 'code': {
              if (properties.title) {
                const content = properties.title[0][0]
                const language = properties.language[0][0]

                if (language === 'LiveScript') {
                  // this requires the DOM for now
                  toRender.push(
                    <ReactJSXParser
                      key={id}
                      jsx={content}
                      components={components}
                      componentsOnly={false}
                      renderInpost={false}
                      allowUnknownElements={true}
                      blacklistedTags={['script', 'style']}
                    />
                  )
                } else {
                  toRender.push(
                    <components.Code key={id} language={language || ''}>
                      {content}
                    </components.Code>
                  )
                }
              }
              break
            }
            case 'quote': {
              if (properties.title) {
                toRender.push(
                  React.createElement(
                    components.blockquote,
                    { key: id },
                    properties.title
                  )
                )
              }
              break
            }
            case 'callout': {
              toRender.push(
                <div className="callout" key={id}>
                  {value.format?.page_icon && (
                    <div>{value.format?.page_icon}</div>
                  )}
                  <div className="text">
                    {textBlock(properties.title, true, id)}
                  </div>
                </div>
              )
              break
            }
            case 'tweet': {
              if (properties.html) {
                toRender.push(
                  <div
                    dangerouslySetInnerHTML={{ __html: properties.html }}
                    key={id}
                  />
                )
              }
              break
            }
            case 'equation': {
              if (properties && properties.title) {
                const content = properties.title[0][0]
                toRender.push(
                  <components.Equation key={id} displayMode={true}>
                    {content}
                  </components.Equation>
                )
              }
              break
            }
            default:
              if (
                process.env.NODE_ENV !== 'production' &&
                !listTypes.has(type)
              ) {
                console.log('unknown type', type)
              }
              break
          }
          return toRender
        })}
      <br />
      <hr />
      </div>
      <div className='hov_' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
        <div style={{ backgroundColor: '#bded87', borderRadius: '24px', padding: '5px 10px', color: 'white', minWidth: 84, textAlign: 'center' }}>
          <a href={`http://twitter.com/share?text=かきくけこういち.COM%0a- ${post.Slug} -%0a&hashtags=ブログ更新,${post.Tag}&url=${url}%0a`}
            rel="nofollow noopener noreferrer" target="_blank">シェア</a>
        </div>
        <div className='hov_' style={{ backgroundColor: '#ed8787', borderRadius: '24px', padding: '5px 10px', color: 'white', marginLeft: '10px', minWidth: 124, textAlign: 'center' }}>
          <a href={`http://b.hatena.ne.jp/entry/${url}/`} target="_blank" >ブックマークで応援</a>
        </div>
        <div className='hov_' style={{ backgroundColor: '#bded87', borderRadius: '24px', padding: '5px 10px', color: 'white', marginLeft: '10px', minWidth: 84, textAlign: 'center' }}>
          <a href="https://game.blogmura.com/game_today/ranking/in?p_cid=10978808" target="_blank" >ブログランク</a>
        </div>
        
      </div>
    </React.Fragment>
  )
}

const COLOR_MAP = {
  ['gray']: '#5e5e5e',
  ['brown']: '#e3be78',
  ['orange']: '#f5b622',
  ['yellow']: '#c4c934',
  ['teal']: '#79bf71',
  ['blue']: '#24dced',
  ['purple']: '#d3adff',
  ['pink']: '#ff7878',
  ['red']: '#ff5252',
}

const BK_COLOR_MAP = {
  ['gray_background']: '#f5f5f5',
  ['brown_background']: '#fcf0e8',
  ['orange_background']: '#fcf6e8',
  ['yellow_background']: '#f9fce8',
  ['teal_background']: '#e8fcef',
  ['blue_background']: '#e8f0ff',
  ['purple_background']: '#f2e8fc',
  ['pink_background']: '#fbe8fc',
  ['red_background']: '#fce8e8',
}

export default RenderPost
