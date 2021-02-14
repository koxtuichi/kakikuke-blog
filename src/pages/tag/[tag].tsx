import getBlogIndex from '../../lib/notion/getBlogIndex'
import { getTagLink, getDateStr, getBlogLink } from '../../lib/blog-helpers'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import blogStyles from '../../styles/blog.module.css'

// Get the data for each blog post
export async function getStaticProps({ params: { tag }, preview }) {
    // load the postsTable so that we can get the page's ID
    const postsTable = await getBlogIndex()
    const posts = Object.keys(postsTable)
                      .filter(post => postsTable[post].Published === 'Yes' 
                                    && postsTable[post].Tag === tag)
    // if we can't find the post or if it is unpublished and
    // viewed without preview mode then we just redirect to /blog
    if (!posts) {
      console.log(`Failed to find post for slug: ${tag}`)
      return {
        props: {
          redirect: '/blog',
          preview: false,
        },
        unstable_revalidate: 5,
      }
    }
    return {
      props: {
        posts,
        preview: preview || false,
        postsTable,
      },
      unstable_revalidate: 10,
    }
  }

export async function getStaticPaths() {
  const postsTable = await getBlogIndex()
  // we fallback for any unpublished posts to save build time
  // for actually published ones
  return {
    paths: Object.keys(postsTable)
      .filter(post => postsTable[post].Published === 'Yes')
      .map(post => getTagLink(postsTable[post].Tag)),
    fallback: true,
  }
}

const RenderPost = ({ posts, redirect, preview, postsTable }) => {
  const router = useRouter()
  console.log(router)

  useEffect(() => {
    if (redirect && !posts) {
      router.replace(redirect)
    }
  }, [redirect, posts])

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <>
      <React.Fragment>
        <div className={blogStyles.tagHeader} style={{ margin: '50px 0 26px 0', fontSize: '16px', textAlign: 'center', fontWeight: '600' }}>
          <div>{postsTable[posts.find(post => post)].Tag}の記事一覧</div>
        </div>
        <div className={blogStyles.blogIndex} style={{ marginLeft: '17px' }}>
          {posts.length === 0 && (
            <p className={blogStyles.noPosts}>There are no posts yet</p>
          )}
          {posts.map(post => 
          <div className={blogStyles.postPreview} key={postsTable[post].Slug}>
            <div style={{ display: 'flex' }}>
            {postsTable[post].Tag.length > 0 && (
              <div className={blogStyles.tag}>{postsTable[post].Tag}</div>
            )}
            <div className={blogStyles.titleContainer}>
              <Link href="/blog/[slug]" as={getBlogLink(postsTable[post].Slug)}>
                <div>
                  {!postsTable[post].Published && (
                    <span className={blogStyles.draftBadge}>Draft</span>
                  )}
                  <a>{postsTable[post].Page}</a>
                </div>
              </Link>
            </div>
            {postsTable[post].Date && (
              <div style={{ marginTop: '4px', fontSize: '18px' }}>
                {getDateStr(postsTable[post].Date)}
              </div>
            )}
            </div>
          </div>)}
        </div>
        <div className={blogStyles.tagHeader} style={{ margin: '50px 0 26px 0', fontSize: '16px', textAlign: 'center', fontWeight: '600' }}>
          <Link href="/blog">
              <a className={blogStyles.tagHeader}>Back</a>
          </Link>
        </div>
      </React.Fragment>
    </>
  )
}

export default RenderPost