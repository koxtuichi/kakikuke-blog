import { getTagLink, getDate, getBlogLink } from '../../lib/blog-helpers'
import React, { useEffect } from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import blogStyles from '../../styles/blog.module.css'
import sharedStyles from '../../styles/shared.module.css'
import Header from '../../components/header'
import Moment from 'react-moment';
import MouseCursor from '../../lib/notion/mouseCursor'
import { getAllPosts } from '../../lib/notion/client'

export async function getStaticProps({ params: { tag } }) {
  // console.log(`Building tag: ${tag}`)
  const postList = await getAllPosts(true);
  const posts = postList.filter(post => {
    if(!post.Tag.some(tagName => tagName === tag)) {
      return null;
    }
    return post;
  });

  return {
    props: {
      posts,
      tag,
    },
    revalidate: 60,
  }
}

export async function getStaticPaths() {
  let tagList = [];
  const posts = await getAllPosts();
  posts.map(post => post.Tag.map(tag => {
    if(!tagList.some(t => t === tag)) {
      tagList.push(tag)
    }
  }));
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
      <div className={`${sharedStyles.layout} ${blogStyles.blogIndex}`}>
        {!tag && (
          <p className={blogStyles.noPosts}>助けて～記事が取得できないよぉお</p>
        )}
        {posts.map(post => 
        <div className={blogStyles.postPreview} key={post.Slug}>
          <div style={{ display: 'block' }}>
            <div style={{ display: 'block' }}>
              {post.Tag.length > 0 && (
                post.Tag.map((tag, i) =>
                  <Link key={i} href="/tag/[tag]" as={getTagLink(tag)}>
                    <div style={{ display: 'inline-flex' }}>
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