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
  'd9c2caf9f81238e69ad4f77cb39b32e4f1a5a05d57b03d9f4274969dda3da15f62cde306e69314b0cab8ede87be3a7edbc131c6af7d5070a2e326ddbebab21943fde92f4cc2d0054ea4a3ea7672c'
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
