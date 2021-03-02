import React, { useState } from 'react'
import Header from '../components/header'
import sharedStyles from '../styles/shared.module.css'
import getBlogIndex from '../lib/notion/getBlogIndex'
import { postIsPublished } from '../lib/blog-helpers'
import TagList from '../components/getTags'
import { postList } from './blog/index'

export async function getStaticProps() {
  let posts: any[] = []
  let tagList = []
  if (postList.length === 0) {
    const postsTable = await getBlogIndex(true)
    posts = Object.keys(postsTable)
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

    posts.map(post => post.Tag.split(',').map(tagName => tagList.push(tagName)))
  } else {
    postList.map(post =>
      post.Tag.split(',').map(tagName => tagList.push(tagName))
    )
  }

  // console.log(postList)

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
        <img
          style={{
            margin: '10px auto',
            borderRadius: '12px',
            width: '40vw',
            maxWidth: '650px',
            minWidth: '300px',
            marginTop: '20px',
          }}
          src="https://lh3.googleusercontent.com/0uSBYTmV76sUiKLr0Pkd6Qx6THzSCsfzKirZekxrb6R-LwWg6zGWsc3XK8ay_qFX6_K3rw6NYCLMnPnLVLT08udZVwt1kER5dZYzxJzh3w_no4v4MIWoZ7GJHPv4prGEu9NDqgpiOw=w2400"
        />
        <div style={{ textAlign: 'center' }}>
          <div className="font-bold mb-2 mt-16">コンセプト</div>
          <p className="mb-1">「何度も楽しめるエンタメを発信したい」</p>
          <p className="mb-1">中学生の頃、モンハンポータブルにハマってた</p>
          <p className="mb-1">友達と一緒に遊ぶのも楽しかったけど</p>
          <p className="mb-1">それと同じくらいブログをみるのにもハマってた</p>
          <p className="mb-1">たしか夫婦で運営してたモンハンブログだったか</p>
          <p className="mb-1">僕もおんなじことをやりたいと思って15年</p>
          <p className="mb-1">完全趣味のブログ、はじめてみたので</p>
          <p className="mb-1">どうぞよろしくですｍｍ</p>
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
            {tags.map((tagName, i) => (
              <React.Fragment key={i}>
                <TagList tag={tagName}></TagList>
              </React.Fragment>
            ))}
          </div>
          <div style={{ minWidth: '15%' }}></div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default RenderTagList
