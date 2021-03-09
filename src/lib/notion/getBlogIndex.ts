import { Sema } from 'async-sema'
import rpc, { values } from './rpc'
import createTable from './createTable'
import getTableData from './getTableData'
import { getPostPreview } from './getPostPreview'
import { readFile, writeFile } from '../fs-helpers'
import { BLOG_INDEX_ID, BLOG_INDEX_CACHE } from './server-constants'
import { sleep } from '../notion/utils'

export default async function getBlogIndex(limit = 100, previews = false) {
  await sleep(5000)
  let postsTable: any = null
  const useCache = process.env.USE_CACHE === 'true'
  const cacheFile = `${BLOG_INDEX_CACHE}${previews ? '_previews' : ''}`

  if (useCache) {
    try {
      postsTable = JSON.parse(await readFile(cacheFile, 'utf8'))
    } catch (_) {
      /* not fatal */
    }
  }

  if (!postsTable) {
    try {
      const data = await rpc('loadPageChunk', {
        pageId: BLOG_INDEX_ID,
        limit: 99,
        cursor: { stack: [] },
        chunkNumber: 0,
        verticalColumns: false,
      })

      // Parse table with posts
      const tableBlock = values(data.recordMap.block).find(
        (block: any) => block.value.type === 'collection_view'
      )

      postsTable = await getTableData(tableBlock, true)
    } catch (err) {
      console.warn(
        `Failed to load Notion posts, attempting to auto create table`
      )
      //TODO:テーブル作成の必要はない
      // try {
      //   await sleep(1000)
      //   await createTable()
      //   console.log(`Successfully created table in Notion`)
      // } catch (err) {
      //   console.error(
      //     `Auto creating table failed, make sure you created a blank page and site the id with BLOG_INDEX_ID in your environment`,
      //     err
      //   )
      // }
      return {}
    }

    // only get 10 most recent post's previews

    // オブジェクトの中身
    // toatemwohakaishitaiyatu: {
    //   id: '6d212294-acfe-4852-9f6c-aed50c6bf3ad',
    //   Slug: 'toatemwohakaishitaiyatu',
    //   Date: 1612796400768,
    //   Published: 'Yes',
    //   Tag: '小説',
    //   Authors: [ '0b4c1439-c38b-41b3-9eb5-f4c51811245f' ],
    //   Page: 'トーテムを破壊したい奴'
    // },
    const postsKeys = Object.keys(postsTable).splice(0, 10)
    const sema = new Sema(3, { capacity: postsKeys.length })

    if (previews) {
      await Promise.all(
        postsKeys
          .sort((a, b) => {
            const postA = postsTable[a]
            const postB = postsTable[b]
            const timeA = postA.Date
            const timeB = postB.Date
            return Math.sign(timeB - timeA)
          })
          .map(async postKey => {
            await sema.acquire()
            const post = postsTable[postKey]
            post.preview = post.id
              ? await getPostPreview(postsTable[postKey].id)
              : []
            sema.release()
          })
      )
    }

    if (useCache) {
      writeFile(cacheFile, JSON.stringify(postsTable), 'utf8').catch(() => {})
    }
  }

  return postsTable
}
