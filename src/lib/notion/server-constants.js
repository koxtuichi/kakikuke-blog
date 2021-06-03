// use commonjs so it can be required without transpiling
const path = require('path')

const normalizeId = id => {
  if (!id) return id
  if (id.length === 36) return id
  if (id.length !== 32) {
    throw new Error(
      `Invalid blog-index-id: ${id} should be 32 characters long. Info here https://github.com/ijjk/notion-blog#getting-blog-index-and-token`
    )
  }
  return `${id.substr(0, 8)}-${id.substr(8, 4)}-${id.substr(12, 4)}-${id.substr(
    16,
    4
  )}-${id.substr(20)}`
}

const NOTION_TOKEN =
  process.env.NOTION_TOKEN ||
  '3bdf8406b2e10322826b75d7bfe90bf9b205eb7e09aaf58b537885a290ff5d9e9afe5a6e96e6f596da1639cca643b45c62043eac8f75af762ecb28e9ab9ad151ac77d6e70f4e042a8c6c8e6a5958'
const BLOG_INDEX_ID = normalizeId(
  process.env.BLOG_INDEX_ID || 'bf915e99310d4fb39ea34797631a5ca3'
)
const API_ENDPOINT = 'https://www.notion.so/api/v3'
const BLOG_INDEX_CACHE = path.resolve('.blog_index_data')
const REACT_APP_API_ENDPOINT_URL =
  'https://nbw1ayq2ml.execute-api.us-east-2.amazonaws.com/production/fav'

module.exports = {
  NOTION_TOKEN,
  BLOG_INDEX_ID,
  API_ENDPOINT,
  BLOG_INDEX_CACHE,
  REACT_APP_API_ENDPOINT_URL,
}
