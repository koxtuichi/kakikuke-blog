import Header from '../../components/header'
import blogStyles from '../../styles/blog.module.css'
import React from 'react'
import MouseCursor from '../../lib/notion/mouseCursor'
import { getAllImages } from '../../lib/notion/client'
import Image from 'next/image'
import getNotionAssetUrls from '../../lib/notion/getNotionAssetUrls'
import { NextApiResponse } from 'next'
import { BLOG_INDEX_CACHE } from '../../lib/notion/server-constants'
import { readFile, writeFile } from '../../lib/fs-helpers'

export async function getStaticProps() {
  // console.log(`Building page: ${slug}`)

  const images = await getAllImages();

  const cacheFile = `${BLOG_INDEX_CACHE}_previews_client_imageUrls`
  let urls = [];
  try {
    urls = JSON.parse(await readFile(cacheFile, 'utf8'))
  }catch(e){
    console.log(e)
  }

  if(urls.length < images.length) {
    urls = await getUrls(images);
    try {
      await writeFile(cacheFile, JSON.stringify(urls), 'utf8').catch(() => {})
    }catch(e){
      console.log(e)
    }
  }

  urls = urls.sort((a, b) => {
    // createdTimeは分単位
    return (a.createdTime > b.createdTime ? -1 : 1);
  })

  return {
    props: {
      urls
    },
    revalidate: 60,
  }
}

const getUrls = async (images) => {
  let urls = [];
  const res: NextApiResponse = null;
  await Promise.all(images.map(async img => {
    const { id, properties, created_time, format = {} } = img;
    const { display_source, block_width, block_aspect_ratio } = format;
    const caption = properties.caption && {...properties.caption}['0'][0];
    const { signedUrls = [], ...urlsResponse } = await getNotionAssetUrls(res, display_source, id);
    if(signedUrls.length === 0) return null;
    const obj = { id: id, url: decodeURIComponent(signedUrls[0]), caption: (caption || null), width: block_width, ratio: block_aspect_ratio, createdTime: created_time };
    urls.push(obj)
  }))
  return urls;
}

function Photo({ urls }) {
  console.log('photo')
  return (
    <React.Fragment>
      <Header titlePre='photo' className="mt-6" />
      <MouseCursor />
      <div className={blogStyles.post}>
        {urls.map((url, i) => {
          const height = url.width*url.ratio;
          return (
            <React.Fragment key={i}>
              <Image
                className={`hov_img_noLink`}
                src={url.url}
                alt={url.caption}
                width={url.width}
                height={height}
                quality={100}
                priority={true}
              />
              <div style={{ color: '#3D3D3D', padding: 10, }}>{url.caption}</div>
              <hr />
              <div style={{ height: 20 }} />
            </React.Fragment>
          )
        })}
      </div>
    </React.Fragment>
  )
}

export default Photo
