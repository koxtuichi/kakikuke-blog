import { GetServerSidePropsContext } from 'next'
import RSS from 'rss'
import getBlogIndex from '../../lib/notion/getBlogIndex'
import { postIsPublished } from '../../lib/blog-helpers'

async function generateFeedXml() {
  const feed = new RSS({
    title: 'タイトル',
    description: '説明',
    site_url: 'サイトのURL',
    feed_url: 'フィードページのURL',
    language: 'ja',
  })

  let postsTable: any[] = []
  let localPosts
  postsTable = await getBlogIndex()
  localPosts = Object.keys(postsTable)
    .map(slug => {
      const post = postsTable[slug]
      if (!postIsPublished(post)) {
        return null
      }
      return post
    })
    .filter(Boolean)

  localPosts.sort((a, b) => {
    if (a.Date > b.Date) return -1
    if (a.Date < b.Date) return 1
    return 0
  })
  localPosts?.forEach(post => {
    const url = encodeURIComponent(post.Slug)
    feed.item({
      title: post.Page,
      description: '', //なにもない
      date: new Date(post.Date),
      url: `https://xn--n8jdoikmo8i.com/blog/${url}`,
    })
  })

  return feed.xml()
}

export const getServerSideProps = async ({
  res,
}: GetServerSidePropsContext) => {
  const xml = await generateFeedXml() // フィードのXMLを生成する（後述）

  res.statusCode = 200
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate') // 24時間キャッシュする
  res.setHeader('Content-Type', 'text/xml')
  res.end(xml)

  return {
    props:{

    }
  }
}

const Page = () => null
export default Page
