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
} from '../../lib/blog-helpers'
import MouseCursor from '../../lib/notion/mouseCursor'
import { getAllPosts } from '../../lib/notion/client'

export async function getStaticProps({ preview }) {
  const posts = await getAllPosts();
  return {
    props: {
      preview: preview || false,
      posts,
    },
    revalidate: 60,
  }
}
const Blog = ({ posts = [] }) => {
  return (
    <React.Fragment>
      <Header titlePre="Blog" className="mt-6" />
      <MouseCursor />

      <div style={{ height: '31px' }}></div>
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
                      post.Tag.map((tag, i) => (
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
    </React.Fragment>
  )
}
export default Blog
