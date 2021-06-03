import { BLOG_INDEX_ID, BLOG_INDEX_CACHE } from './server-constants'
import { readFile, writeFile } from '../fs-helpers'
const { Client } = require('@notionhq/client')

const client = new Client({
  auth: 'secret_8poT1VLqlmcF48T3XWRa2A2yygx1WTl76E1E4wprmee',
})

interface Post {
  PageId: string
  NumOfWords: string
  Slug: string
  Date: string
  Published: boolean
  Tag: string[]
  Authors: string
  Page: string
}

interface Block {
  Id: string
  Type: string
  HasChildren: boolean
}

interface ParagraphBlock extends Block {
  RichTexts: RichText[]
}

interface HeadingBlock extends Block {
  RichTexts: RichText[]
}

interface ListBlock extends Block {
  RichTexts: RichText[]
}

interface RichText {
  Text: Text
  Annotation: Annotation
  PlainText: string
  Href?: string
}

interface Text {
  Content: string
  Link?: Link
}

interface Annotation {
  Bold: boolean
  Italic: boolean
  Strikethrough: boolean
  Underline: boolean
  Code: boolean
  Color: string
}

interface Link {
  Url: string
}

export async function getAllPosts() {
  let allPosts: Post[] = []

  let params = {
    database_id: BLOG_INDEX_ID,
    filter: {
      and: [
        {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
        {
          property: 'Date',
          date: {
            on_or_before: new Date().toISOString(),
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Date',
        timestamp: 'created_time',
        direction: 'descending',
      },
    ],
    page_size: 100,
  }

  const cacheFile = `${BLOG_INDEX_CACHE}_previews`
  try {
    allPosts = JSON.parse(await readFile(cacheFile, 'utf8'))
  }catch(e){
    console.log(e)
  }
  if(0 < allPosts.length) return allPosts;

  while (true) {
    const data = await client.databases.query(params)

    const posts = data.results.map(item => {
      const prop = item.properties

      if(!prop.Published.checkbox) return;

      const post: Post = {
        PageId: item.id,
        NumOfWords: prop.NumOfWords.number,
        Slug: prop.Slug.multi_select[0].name,
        Date: prop.Date.date.start,
        Published: prop.Published.checkbox,
        Tag: prop.Tag.multi_select.map(opt => opt.name),
        Authors: prop.Authors.people[0].name,
        Page: prop.Page.title[0].plain_text,
      }

      return post
    })

    allPosts = allPosts.concat(posts)

    if (!data.has_more) {
      break
    }

    params['start_cursor'] = data.next_cursor
  }

  try {
    await writeFile(cacheFile, JSON.stringify(allPosts), 'utf8').catch(() => {})
  }catch(e){
    console.log(e)
  }

  return allPosts
}
<<<<<<< HEAD

export async function getPostBySlug(slug: string) {
  const data = await client.databases.query({
    database_id: BLOG_INDEX_ID,
    filter: {
      and: [
        {
          property: 'Published',
          checkbox: {
            equals: true,
          },
        },
        {
          property: 'Date',
          date: {
            on_or_before: new Date().toISOString(),
          },
        },
        {
          property: 'Slug',
          text: {
            equals: slug,
          },
        },
      ],
    },
    sorts: [
      {
        property: 'Date',
        timestamp: 'created_time',
        direction: 'ascending',
      },
    ],
  })

  const result = data.results[0]
  const prop = result.properties

  const post: Post = {
    PageId: result.id,
    NumOfWords: prop.NumOfWords.number,
    Slug: prop.Slug.multi_select[0].name,
    Date: prop.Date.date.start,
    Published: prop.Published.checkbox,
    Tag: prop.Tag.multi_select.map(opt => opt.name),
    Authors: prop.Authors.people[0].name,
    Page: prop.Page.title[0].plain_text,
  }

  return post
}
=======
>>>>>>> 252172e787078539f07447f04c4cf18776de63b2
