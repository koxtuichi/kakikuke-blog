import { Sema } from 'async-sema'
import rpc, { values } from './rpc'
import createTable from './createTable'
import getTableData from './getTableData'
import { getPostPreview } from './getPostPreview'
import { readFile, writeFile } from '../fs-helpers'
import { BLOG_INDEX_ID, BLOG_INDEX_CACHE } from './server-constants'

export default async function getBlogIndex(limit = 100, previews = true) {
  let postsTable: any = null
  const useCache = true
  const cacheFile = `${BLOG_INDEX_CACHE}${previews ? '_previews' : ''}`

  if (useCache) {
    try {
      postsTable = JSON.parse(await readFile(cacheFile, 'utf8'))
      // console.log(postsTable)
    } catch (_) {
      /* not fatal */
    }
  }

  if (!postsTable) {
    try {
      console.log('!postsTable')
      const data = await rpc('loadPageChunk', {
        pageId: BLOG_INDEX_ID,
        limit: limit,
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
  }

  if (useCache) {
    writeFile(cacheFile, JSON.stringify(postsTable), 'utf8').catch(() => {})
    // console.log(cacheFile)
  }

  return postsTable
}
