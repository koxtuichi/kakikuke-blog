export const getBlogLink = (slug: string) => {
  return encodeURI(`/blog/${slug}`)
}

export const getTagLink = (tag: string) => {
  return encodeURI(`/blog/tag/${tag}`)
}

export const getDate = date => {
  return new Date(date)
}

export const postIsPublished = (post: any) => {
  return post.Published === 'Yes'
}

export const normalizeSlug = slug => {
  if (typeof slug !== 'string') return slug

  let startingSlash = slug.startsWith('/')
  let endingSlash = slug.endsWith('/')

  if (startingSlash) {
    slug = slug.substr(1)
  }
  if (endingSlash) {
    slug = slug.substr(0, slug.length - 1)
  }
  return startingSlash || endingSlash ? normalizeSlug(slug) : slug
}
