import Header from '../../components/header'
import blogStyles from '../../styles/blog.module.css'
import React from 'react'
import MouseCursor from '../../lib/notion/mouseCursor'
import { getAllImages } from '../../lib/notion/client'
import Image from 'next/image'
import getNotionAssetUrls from '../../lib/notion/getNotionAssetUrls'
import { NextApiResponse } from 'next'
// import { BLOG_INDEX_CACHE } from '../../lib/notion/server-constants'
// import { readFile, writeFile } from '../../lib/fs-helpers'

export async function getStaticProps() {
  // console.log(`Building page: ${slug}`)

  const images = await getAllImages();

  // const cacheFile = `${BLOG_INDEX_CACHE}_previews_client_imageUrls`
  let urls = [];
  // try {
  //   urls = JSON.parse(await readFile(cacheFile, 'utf8'))
  // }catch(e){
  //   console.log(e)
  // }

  urls = await getUrls(images);

  // if(urls.length === 0) {
  //   urls = await getUrls(images);
  //   try {
  //     await writeFile(cacheFile, JSON.stringify(urls), 'utf8').catch(() => {})
  //   }catch(e){
  //     console.log(e)
  //   }
  // }

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
    const obj = { id: id, url: signedUrls[0], caption: (caption || null), width: (block_width || null), ratio: block_aspect_ratio, createdTime: created_time };
    urls.push(obj)
  }))
  return urls;
}

function Photo({ urls }) {
  return (
    <React.Fragment>
      <Header titlePre='photo' className="mt-6" />
      <MouseCursor />
      <div className={blogStyles.post}>
        {urls.map((url, i) => {
          return (
            <React.Fragment key={i}>
            <Image
              key={i}
              className={`hov_img_noLink`}
              src={url.url}
              alt={url.caption}
              width={url.width}
              height={url.width*url.ratio}
              quality={100}
              loading='lazy'
            />
            <div key={i} style={{ color: '#3D3D3D', padding: 10, }}>{url.caption}</div>
            <hr />
            <div key={i} style={{ height: 20 }} />
            </React.Fragment>
          )
        })}
      </div>
    </React.Fragment>
  )
}

export default Photo
