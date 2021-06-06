import { BLOG_INDEX_ID, BLOG_INDEX_CACHE } from './server-constants'
import { readFile, writeFile } from '../fs-helpers'
import getPageData from './getPageData'

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

const params = {
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

const imageParams = {
  database_id: '9a5e21d8b62c4c3f949094b3e63ef99f',
  filter: {
    and: [
      {
        property: 'Published',
        checkbox: {
          equals: true,
        },
      },
    ],
  },
  page_size: 100,
}

export async function getAllPosts() {
  let allPosts: Post[] = []

  const cacheFile = `${BLOG_INDEX_CACHE}_previews_client`
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

    allPosts = [...allPosts, ...posts]

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

export async function getPostBySlug(slug: string) {
  try{
    let allPosts: Post[] = [];
    let data = null;
    const cacheFile = `${BLOG_INDEX_CACHE}_previews_client`;
    try {
      allPosts = JSON.parse(await readFile(cacheFile, 'utf8'));
    }catch(e){
      console.log(e);
    }
    if(allPosts.length === 0) {
      while (true) {
        data = await client.databases.query(params);
    
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
    
          return post;
        })
    
        allPosts = [...allPosts, ...posts];
    
        if (!data.has_more) {
          break
        }
    
        params['start_cursor'] = data.next_cursor
      }
    };

    try {
      await writeFile(cacheFile, JSON.stringify(allPosts), 'utf8').catch(() => {})
    }catch(e){
      console.log(e)
    }

    return allPosts.find(post => post.Slug === slug);
  }catch(e){
    console.log(e.mesasge);
  }
}

export async function getAllImages() {
  let imagesInfo = [];

  const cacheFile = `${BLOG_INDEX_CACHE}_previews_client_images`
  try {
    imagesInfo = JSON.parse(await readFile(cacheFile, 'utf8'))
  }catch(e){
    console.log(e)
  }
  if(0 < imagesInfo.length) return imagesInfo;

  while (true) {
    const data = await client.databases.query(imageParams)

    // id取得（１つ固定）
    const photoId = data.results.filter(item => {
      const prop = item.properties
      if(prop.Name.title[0].plain_text !== 'photo') return;
      return true;
    })
    .map(item => {
      return item.id;
    })

    // 画像情報を取得
    // console.log(photoId[0]) //固定
    const photoPage = await getPageData(photoId[0]);
    imagesInfo = photoPage.blocks.filter(block => {
      if(block.value.type !== 'image') return false;
      return true;
    })
    .map(block => {
      return block.value;
    })
    break;
  }

  try {
    await writeFile(cacheFile, JSON.stringify(imagesInfo), 'utf8').catch(() => {})
  }catch(e){
    console.log(e)
  }

  return imagesInfo;
}
