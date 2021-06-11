import Header from '../../components/header'
import blogStyles from '../../styles/blog.module.css'
import React, { CSSProperties } from 'react'
import MouseCursor from '../../lib/notion/mouseCursor'
import { getAllImages } from '../../lib/notion/client'
import Image from 'next/image'

export async function getStaticProps() {
  // console.log(`Building page: ${slug}`)

  const images = await getAllImages();
  // console.log(images)
  
  return {
    props: {
      images,
    },
    revalidate: 60,
  }
}

function Photo({ images, redirect }) {
  return (
    <React.Fragment>
      <Header titlePre='photo' className="mt-6" />
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

          const Comp = 'img';
          const useWrapper = block_aspect_ratio && !block_height
          const childStyle: CSSProperties = {
            width: '100%',
            height: '100%',
            border: 'none',
            position: 'absolute',
            top: 0,
          }

          let child = null

          child = (
            <Comp
              key={!useWrapper ? id : undefined}
              src={`/api/asset?assetUrl=${encodeURIComponent(display_source as any)}&blockId=${id}`}
              alt={`An image from Notion`}
              style={childStyle}
            />
          )

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

export default Photo
