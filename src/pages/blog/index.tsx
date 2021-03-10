import React from 'react'
import Link from 'next/link'
import Header from '../../components/header'
import Moment from 'react-moment'
import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'
import {
  getBlogLink,
  getTagLink,
  getDate,
  postIsPublished,
} from '../../lib/blog-helpers'
import getBlogIndex from '../../lib/notion/getBlogIndex'
import { sleep } from '../../lib/notion/utils'

export let gettingCommonPosts = []
export let posts: any[]

export async function getStaticProps({ preview }) {
  gettingCommonPosts = await getBlogIndex()
  posts = Object.keys(gettingCommonPosts)
    .map(slug => {
      const post = gettingCommonPosts[slug]
      if (!preview && !postIsPublished(post)) {
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

  return {
    props: {
      preview: preview || false,
      posts,
    },
    unstable_revalidate: 10,
  }
}
export default ({ posts = [], preview }) => {
  return (
    <React.Fragment>
      <Header titlePre="Blog" className="mt-6" />
      <div style={{ height: '31px' }}></div>
      {preview && (
        <div className={blogStyles.previewAlertContainer}>
          <div className={blogStyles.previewAlert}>
            <b>Note:</b>
            {` `}Viewing in preview mode{' '}
            <Link href={`/api/clear-preview`}>
              <button className={blogStyles.escapePreview}>Exit Preview</button>
            </Link>
          </div>
        </div>
      )}
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        {posts.length === 0 && (
          <p className={blogStyles.noPosts}>There are no posts yet</p>
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
                          <div style={{ display: 'inline-flex' }}>
                            <a className={blogStyles.tag}>{tag}</a>
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
    </React.Fragment>
  )
}
