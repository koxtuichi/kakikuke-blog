import Header from '../../components/header'
import blogStyles from '../../styles/blog.module.css'
import React, { CSSProperties } from 'react'
import MouseCursor from '../../lib/notion/mouseCursor'
import { getAllImages } from '../../lib/notion/client'

export async function getStaticProps() {
  // console.log(`Building page: ${slug}`)

  const images = await getAllImages();
  console.log(images);
  
  return {
    props: {
      images,
    },
    revalidate: 60,
  }
}

const listTypes = new Set(['bulleted_list', 'numbered_list'])

const RenderPost = ({ images, redirect }) => {
  return (
    <React.Fragment>
      <Header titlePre={''} className="mt-6" />
      <MouseCursor />
      <div className={blogStyles.post}>
        {images.map(img => {
          const { id, type, file_ids, format = {} } = img;
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

          if (!isImage && !file_ids) {
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

          let toRender = []
          toRender.push(
            useWrapper ? (
              <div
                style={{
                  paddingTop: `${Math.round(block_aspect_ratio * 100)}%`,
                  position: 'relative',
                  marginBottom: 30,
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
          return toRender
        })}
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
