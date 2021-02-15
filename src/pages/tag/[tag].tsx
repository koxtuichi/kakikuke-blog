import getBlogIndex from '../../lib/notion/getBlogIndex'
import { getTagLink, getDate, getBlogLink } from '../../lib/blog-helpers'
import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import blogStyles from '../../styles/blog.module.css'
import Header from '../../components/header'
import Moment from 'react-moment';

export async function getStaticProps({ params: { tag } }) {
  const postsTable = await getBlogIndex()
  const posts = Object.keys(postsTable)
                      .filter(post => postsTable[post].Published === 'Yes' 
                                    && postsTable[post].Tag.split(',').find(tagName => tag === tagName))
  // if we can't find the post or if it is unpublished and
  // viewed without preview mode then we just redirect to /blog
  if (!posts) {
    console.log(`Failed to find post for slug: ${tag}`)
    return {
      props: {
        redirect: '/blog',
      },
      unstable_revalidate: 5,
    }
  }
  return {
    props: {
      posts,
      tag,
      postsTable,
    },
    unstable_revalidate: 10,
  }
}

export async function getStaticPaths() {
  const postsTable = await getBlogIndex()

  let tagList = [];
  Object.keys(postsTable)
        .filter(post => postsTable[post].Published === 'Yes')
        .map(post => postsTable[post] && postsTable[post].Tag.split(',').map(tag => tagList.push(tag)));

  return {
    paths: tagList.map(tag => getTagLink(tag)),
    fallback: true,
  }
}

const RenderTag = ({ posts, tag, postsTable, redirect }) => {
  const router = useRouter()

  useEffect(() => {
    if (redirect && !posts) {
      router.replace(redirect)
    }
  }, [redirect, posts])

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <React.Fragment>
      <Header titlePre={'Tag'} />
      <div className={blogStyles.tagHeader} style={{ margin: '-25px 0 19px 0', fontSize: '16px', textAlign: 'center' }}>
        <div>{tag}の記事一覧</div>
      </div>
      <div className={blogStyles.blogIndex}>
        {!tag && (
          <p className={blogStyles.noPosts}>There are no posts yet</p>
        )}
        {posts.map(post => 
        <div className={blogStyles.postPreview} key={postsTable[post].Slug}>
          <div style={{ display: 'block' }}>
            <div style={{ display: 'flex' }}>
              {postsTable[post].Tag.length > 0 && (
                postsTable[post].Tag.split(',').map((tag, i) =>
                    <div key={i} className={blogStyles.tag}>{tag}</div>
                )
              )}
            </div>
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
              <div style={{ marginTop: '4px', fontSize: '12px' }}>
                <Moment format="//YYYY-MM-DD">{getDate(postsTable[post].Date)}</Moment>
              </div>
            )}
          </div>
        </div>)}
      </div>
    </React.Fragment>
  )
}

export default RenderTag