import React from 'react'
import axios from 'axios'
import useSWR, { SWRConfig } from 'swr'
import {sleep} from '../lib/notion/utils'
import { API_ENDPOINT, NOTION_TOKEN, BLOG_INDEX_ID, REACT_APP_API_ENDPOINT_URL } from '../lib/notion/server-constants'
import rpc, { values } from '../lib/notion/rpc'
import MainTable from './mainTable'
import { StringDecoder } from 'string_decoder'
import fetch, { Response } from 'node-fetch'
import sharedStyles from '../styles/shared.module.css'
import blogStyles from '../styles/blog.module.css'
import Link from 'next/link'
import { getBlogLink, getTagLink, getDate, postIsPublished } from '../lib/blog-helpers'
import Moment from 'react-moment'

// const PostsTableGet = ({url}:any):any => {
//   console.log(url)
//   const { data, error } = useSWR([url], postsTableFetcher)
//   console.log(`posts:data ${data}`)
//   console.log(`posts:error ${error}`)
//   if(error) return (<div className="font-bold mb-2 mt-16" style={{ textAlign: 'center' }}>画像取れなかったｸｿｩ</div>)
//   if(typeof data === 'object'){
//     if(!!data) {
//       return (<div>取得完了</div>)
//     }
//   }
//   return (<div>取得中</div>)
// }



function PostsTable() {
  const endpoint = `${REACT_APP_API_ENDPOINT_URL}?maxid=&gettweetnum=`
  const { data: twData, error: twError } = useSWR(endpoint, tweetImageFetcher)
  if(typeof twData === 'object')(
    console.log(twData)
  )
  
  const posts = []
  return (
    <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
      {posts.length === 0 && (
        <p className={blogStyles.noPosts}>助けて～記事が取得できないよぉお</p>
      )}
      {posts.map((post, i) => {
        return (
          <React.Fragment key={i}>
            <div key={post.Slug} className={blogStyles.postPreview}>
              <div style={{ display: 'block' }}>
                <div style={{ display: 'block' }}>
                  {post.Tag.length > 0 &&
                    post.Tag.split(',').map((tag, i) => (
                      <Link
                        key={i}
                        href="/blog/tag/[tag]"
                        as={getTagLink(tag)}
                      >
                        <div key={i} style={{ display: 'inline-flex' }}>
                          <a key={i} className={blogStyles.tag}>
                            {tag}
                          </a>
                        </div>
                      </Link>
                    ))}
                </div>
                <div></div>
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
                <div
                  style={{
                    marginTop: '4px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    {post.Date && (
                      <Moment format="//YYYY-MM-DD">
                        {getDate(post.Date)}
                      </Moment>
                    )}
                    {post && post.NumOfWords && (
                      <div
                        className={'text-xs ml-2'}
                        style={{ marginTop: '0.17rem' }}
                      >
                        {post.NumOfWords + '文字'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )
      })}
    </div>
    // <div>
    //   <SWRConfig value={{dedupingInterval:10000*6*15}}>
    //     <PostsTableGet url={`${API_ENDPOINT}/loadPageChunk`} />
    //   </SWRConfig>
    // </div>
  )
}
export default PostsTable

export const postsTableFetcher = (url:string) => {
  const body = {
    pageId: BLOG_INDEX_ID,
    limit: 100,
    cursor: { stack: [] },
    chunkNumber: 0,
    verticalColumns: false,
  }
  return fetch(url, { 
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: `token_v2=${NOTION_TOKEN}`,
    },
    body: JSON.stringify(body),
  })
}

export function tweetImageFetcher(url:string) {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}


