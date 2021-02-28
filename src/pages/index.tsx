import React from 'react'
import Header from '../components/header'
import sharedStyles from '../styles/shared.module.css'
import getBlogIndex from '../lib/notion/getBlogIndex'
import { getTagLink, postIsPublished } from '../lib/blog-helpers'
import Link from 'next/link'

export async function getStaticProps() {
  const postsTable = await getBlogIndex()
  const posts = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug]
      if (!postIsPublished(post)) {
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

  let tagList = []
  posts.map(post => post.Tag.split(',').map(tagName => tagList.push(tagName)))
  const tags = tagList.filter((tag, index, self) => self.indexOf(tag) === index)

  return {
    props: {
      tags,
    },
  }
}

const RenderTagList = ({ tags }) => {
  return (
    <React.Fragment>
      <Header titlePre="Home" className="mt-6" />
      <div className={sharedStyles.layout}>
        <div className="mt-10 text-2xl" style={{ textAlign: 'center' }}>
          みかんがすき
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="font-bold mb-2 mt-16">コンセプト</div>
          <p className="mb-1">「何度も楽しめるエンタメを発信したい（趣味）」</p>
          <p className="mb-1">中学生の頃、モンハンポータブルにハマってた</p>
          <p className="mb-1">友達と一緒に遊ぶのも楽しかったけど</p>
          <p className="mb-1">それと同じくらいブログをみるのにもハマってた</p>
          <p className="mb-1">たしか夫婦で運営してたモンハンブログだったか</p>
          <p className="mb-1">僕もおんなじことをやりたいと思って15年</p>
          <p className="mb-1">趣味全開のブログをはじめてみましたので</p>
          <p className="mb-1">どうぞよろしくお願いしますｍｍ</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="font-bold mb-2 mt-16">仕事</div>
          <p className="mb-1">フロントエンドをよくいじってるプログラマー</p>
          <p className="mb-1">C#／javascriptが好き</p>
          <p className="mb-1">今はReact,Reduxの環境で発狂してる</p>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div className="font-bold mb-2 mt-16">ブログについて</div>
          <p className="mb-1">Notionで記事管理▷vercelに自動デプロイ</p>
          <p className="mb-1">環境はReact.js + Next.js</p>
          <p className="mb-1">
            favoriteの画像はTwitterAPI + REST API + Lamdaを使用
          </p>
        </div>

        <div className="font-bold mb-2 mt-16" style={{ textAlign: 'center' }}>
          -Blog Tag-
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ minWidth: '15%' }}></div>
          <div style={{ width: 'auto', textAlign: 'center', margin: '0 auto' }}>
            {tags.map(tag =>
              tag.split(',').map((tagName, i) => (
                <React.Fragment key={i}>
                  <div
                    style={{
                      marginRight: '10px',
                      fontSize: '16px',
                      display: 'inline-block',
                    }}
                  >
                    <Link href={'/blog/tag/[tag]'} as={getTagLink(tagName)}>
                      <a>#{tagName}</a>
                    </Link>
                  </div>
                </React.Fragment>
              ))
            )}
          </div>
          <div style={{ minWidth: '15%' }}></div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default RenderTagList
