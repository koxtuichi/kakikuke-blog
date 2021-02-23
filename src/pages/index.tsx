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
      <Header titlePre="Home" />
      <div className={sharedStyles.layout}>
        <h1 style={{ fontSize: '3vw' }}>みかんはあまりすきじゃない</h1>

        <h2 style={{ marginTop: '65px' }}>コンセプト</h2>
        <div style={{ textAlign: 'center' }}>
          <p>
            「ノウハウだけでなく何度も見返すことができるエンタメを発信していく」
          </p>
          <p>ゲーム日記やショートショート小説とか</p>
          <p>ゲーム制作の過程とか</p>
          <p>プログラミングでつまづいた所の原因と解説とか</p>
          <p>いろんなことがやりたいなーと思った結果</p>
          <p>自分専用のプラットフォームを作った</p>
          <p>ここでは文章も画像も動画も全部を詰め込みたい</p>
        </div>

        <h2 style={{ marginTop: '65px' }}>仕事</h2>
        <div style={{ textAlign: 'center' }}>
          <p>プログラマーというかエンジニアというか</p>
          <p>主にC#とjavascriptを使ってて</p>
          <p>今はReact,Reduxの環境で発狂してる</p>
          <p>苦手なのはどっちかっていうとサーバー周り</p>
          <p>結果、僕はフロントエンドのプログラマーです</p>
        </div>

        <div style={{ marginLeft: '10px' }}>
          <h2 className={sharedStyles.subTitle}>-Blog Tag-</h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {tags.map(tag =>
            tag.split(',').map(tagName => (
              <div style={{ marginLeft: '10px', fontSize: '16px' }}>
                <Link href={'/tag/[tag]'} as={getTagLink(tagName)}>
                  <a>#{tagName}</a>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

export default RenderTagList
