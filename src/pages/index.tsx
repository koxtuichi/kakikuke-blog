import React from 'react'
import Header from '../components/header'
import sharedStyles from '../styles/shared.module.css'
import getBlogIndex from '../lib/notion/getBlogIndex'
import { getTagLink } from '../lib/blog-helpers'
import Link from 'next/link'

export async function getStaticProps() {
  const postsTable = await getBlogIndex()
  const tags = Object.keys(postsTable)
    .filter(post => postsTable[post].Published === 'Yes')
    .map(post => postsTable[post].Tag)
    .filter((tag, index, self) => self.indexOf(tag) === index)
  return {
    props: { tags },
  }
}

const RenderTagList = ({ tags }) => {
  return (
    <React.Fragment>
      <Header titlePre="Home" />
      <div className={sharedStyles.layout}>
        <h1>シナリオと絵と音楽とプログラムと</h1>
        <div style={{ marginLeft: '10px' }}>
          <h2 className={sharedStyles.subTitle}>-Blog Tag-</h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {tags.map(tag => (
            <div style={{ marginLeft: '10px', fontSize: '16px' }}>
              <Link href={'/tag/[tag]'} as={getTagLink(tag)}>
                <a>{tag}</a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  )
}

export default RenderTagList
