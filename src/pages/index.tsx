import React from 'react'
import Header from '../components/header'
import sharedStyles from '../styles/shared.module.css'
import getBlogIndex from '../lib/notion/getBlogIndex'
import MouseCursor from '../lib/notion/mouseCursor'
import { postIsPublished } from '../lib/blog-helpers'
import TagList from '../components/getTags'

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
      tags
    },
  }
}

const RenderTagList = ({ tags }) => {
  return (
    <React.Fragment>
      <Header titlePre="Home" className="mt-6" />
      <MouseCursor />
      <div className={`${sharedStyles.layout}`}>
        <img
          className="hov_img_noLink"
          style={{
            margin: '10px auto',
            borderRadius: '12px',
            width: '40vw',
            maxWidth: '650px',
            minWidth: '300px',
            marginTop: '20px',
          }}
          src="https://lh3.googleusercontent.com/76V76X2N2K04JeBeKv12oEmyy2GB7P_7w6tkRORDYEk5NHtpUHeZvwllohbmeItpjNDJn7xASpIbLLrd7j1PHEALbzFaB5x2ZuDJWrQcRy3T99crTC9Yhk4q3P2wW4mf3xEEW22V9Q=w2400"
        />
        <div style={{ textAlign: 'center' }}>
          <div className="font-bold mb-2 mt-16">コンセプト</div>
          <p className="mb-1">「ゲーム欲が掻き立てられるブログを発信したい」</p>
          <p className="mb-1">高校生の頃、モンハンポータブル3rdにハマってた</p>
          <p className="mb-1">友達の家に泊まって一緒に遊ぶのも楽しかったけど</p>
          <p className="mb-1">それと同じくらいブログをみるのにもハマってた</p>
          <p className="mb-1">
            「
            <a
              href="http://blog.livedoor.jp/keicha18-heppokomh/archives/cat_954118.html?p=16"
              style={{ color: '#f5b622' }}
            >
              けいちゃ
            </a>
            」って人のブログ、日記が中心で
          </p>
          <p className="mb-1">攻略情報とかはなかったけどそれでも面白かった</p>
          <p className="mb-1">見ればみるほど自分もゲームを進めたいなと思えた</p>
          <p className="mb-1">そして僕もおんなじことをやりたいと思って15年</p>
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
