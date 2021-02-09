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
  'd0bab8627e88a19670e14bb5052ee0df226b3bd66aec4a1f764a4db2ba074b645458544dc07e7532d2a0efe8381c7187b83b3e6945038abfbdb7a69637f08bada256dae85d77eadc0915a8295c54'
const BLOG_INDEX_ID = normalizeId('bf915e99310d4fb39ea34797631a5ca3')
const API_ENDPOINT = 'https://www.notion.so/api/v3'
const BLOG_INDEX_CACHE = path.resolve('.blog_index_data')

module.exports = {
  NOTION_TOKEN,
  BLOG_INDEX_ID,
  API_ENDPOINT,
  BLOG_INDEX_CACHE,
}
