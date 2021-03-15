import getBlogIndex from '../../../lib/notion/getBlogIndex'
import { getTagLink, getDate, getBlogLink, postIsPublished } from '../../../lib/blog-helpers'
import React, { useEffect } from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import blogStyles from '../../../styles/blog.module.css'
import Header from '../../../components/header'
import Moment from 'react-moment';
import MouseCursor from '../../../lib/notion/mouseCursor'
import { sleep } from '../../../lib/notion/utils'

export async function getStaticProps({ params: { tag } }) {
  const postsTable = await getBlogIndex()
  const posts = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug]

      if (!postIsPublished(post)) {
        return null
      }

      if(!post.Tag.match(tag)) {
        return null
      }

      return post
    })
    .filter(Boolean)

  posts.sort((a, b) => {
    if (a.Date > b.Date) return -1
    if (a.Date < b.Date) return 1
    return 0
  })
  
  if (posts.length === 0) {
    console.log(`Failed to find post for slug: ${tag}`)
    return {
      props: {
        redirect: '/blog',
      revalidate: 10,
    },
    }
  }
  return {
    props: {
      posts,
      tag,
    revalidate: 10,
  },
  }
}

export async function getStaticPaths() {
  let tagList = [];
  const postsTable = await getBlogIndex()

  Object.keys(postsTable)
    .filter(post => postsTable[post].Published === 'Yes')
    .map(post => postsTable[post] && postsTable[post].Tag.split(',').map(tag => tagList.push(tag)));

  return {
    paths: tagList.map(tag => getTagLink(tag)),
    fallback: true,
  }
}

const RenderTag = ({ posts, tag, redirect }) => {
  const router = useRouter()

  useEffect(() => {
    if (redirect && posts.length === 0) {
      router.replace(redirect)
    }
  }, [redirect, posts])

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <React.Fragment>
      <Header titlePre={'Tag'} className="mt-6" />
      <MouseCursor />
      <div className={blogStyles.tagHeader} style={{ height: '40px', fontSize: '16px', textAlign: 'center' }}>
        <div>{tag}の記事一覧</div>
      </div>
      <div className={blogStyles.blogIndex}>
        {!tag && (
          <p className={blogStyles.noPosts}>助けて～記事が取得できないよぉお</p>
        )}
        {posts.map(post => 
        <div className={blogStyles.postPreview} key={post.Slug}>
          <div style={{ display: 'block' }}>
            <div style={{ display: 'inline-flex' }}>
              {post.Tag.length > 0 && (
                post.Tag.split(',').map((tag, i) =>
                  <Link key={i} href="/blog/tag/[tag]" as={getTagLink(tag)}>
                    <div>
                      <a className={blogStyles.tag}>{tag}</a>
                    </div>
                  </Link>
                )
              )}
            </div>
            <div />
            <div className={blogStyles.titleContainer}>
              <Link href="/blog/[slug]" as={getBlogLink(post.Slug)}>
                <div>
                  {!post.Published && (
                    <span className={blogStyles.draftBadge}>Draft</span>
                  )}
                  <a>{post.Page}</a>
                </div>
              </Link>
            </div>
              <div style={{ marginTop: '4px', fontSize: '12px' }}>
                <div style={{ display: 'flex' }}>
                  {post.Date && (
                    <Moment format="//YYYY-MM-DD">{getDate(post.Date)}</Moment>
                  )}
                  {(post.NumOfWords) &&
                    <div className={'text-xs ml-2'} style={{ marginTop: '0.17rem' }}>
                      {post.NumOfWords + '文字'}
                    </div>
                  }
                </div>
              </div>
          </div>
        </div>)}
      </div>
    </React.Fragment>
  )
}

export default RenderTag