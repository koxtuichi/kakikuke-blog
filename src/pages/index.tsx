import React from 'react'
import Header from '../components/header'
import sharedStyles from '../styles/shared.module.css'
import getBlogIndex from '../lib/notion/getBlogIndex'
import { getTagLink } from '../lib/blog-helpers'
import Link from 'next/link'

export async function getStaticProps() {
  const postsTable = await getBlogIndex()
  let tagList = []
  Object.keys(postsTable)
    .filter(post => postsTable[post].Published === 'Yes')
    .map(post =>
      postsTable[post].Tag.split(',').map(tagName => tagList.push(tagName))
    )
  const tags = tagList.filter((tag, index, self) => self.indexOf(tag) === index)

  return {
    props: { tags },
  }
}

const RenderTagList = ({ tags }) => {
  return (
    <React.Fragment>
      <Header titlePre="Home" className="mt-6" />
      <div className={sharedStyles.layout}>
        <h1 className="mt-10 text-2xl">みかんがすき</h1>

        <h2 className="font-extrabold mb-2 mt-16">コンセプト</h2>
        <div style={{ textAlign: 'center' }}>
          <p className="mb-1">「何度も楽しめるエンタメを発信したい（趣味）」</p>
          <p className="mb-1">中学生の頃、モンハンポータブルにハマってた</p>
          <p className="mb-1">友達と一緒に遊ぶのも楽しかったけど</p>
          <p className="mb-1">それと同じくらいブログをみるのにもハマってた</p>
          <p className="mb-1">たしか夫婦で運営してたモンハンブログだったか</p>
          <p className="mb-1">僕もおんなじことをやりたいと思って15年</p>
          <p className="mb-1">趣味全開のブログをはじめてみましたので</p>
          <p className="mb-1">どうぞよろしくお願いしますｍｍ</p>
        </div>

        <h2 className="font-extrabold mb-2 mt-16">仕事</h2>
        <div style={{ textAlign: 'center' }}>
          <p className="mb-1">フロントエンドをよくいじってるプログラマー</p>
          <p className="mb-1">C#／javascriptが好き</p>
          <p className="mb-1">今はReact,Reduxの環境で発狂してる</p>
        </div>

        <h2 className="font-extrabold mb-2 mt-16">ブログについて</h2>
        <div style={{ textAlign: 'center' }}>
          <p className="mb-1">Notionで記事管理▷vercelに自動デプロイ</p>
          <p className="mb-1">環境はReact.js + Next.js</p>
          <p className="mb-1">
            favoriteの画像はTwitterAPI + REST API + Lamdaを使用
          </p>
        </div>

        <h2 className="font-extrabold mb-2 mt-16">-Blog Tag-</h2>
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
                    <Link href={'/tag/[tag]'} as={getTagLink(tagName)}>
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
