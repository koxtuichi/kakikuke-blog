import React from 'react'
import axios from 'axios'
import useSWR, { SWRConfig } from 'swr'
import {sleep} from '../lib/notion/utils'
import { API_ENDPOINT, NOTION_TOKEN, BLOG_INDEX_ID, REACT_APP_API_ENDPOINT_URL } from '../lib/notion/server-constants'
import rpc, { values } from '../lib/notion/rpc'
import MainTable from './mainTable'
import { StringDecoder } from 'string_decoder'
import fetch, { Response } from 'node-fetch'

const PostsTableGet = ({url}:any):any => {
  console.log(url)
  const { data, error } = useSWR([url], postsTableFetcher)
  console.log(`posts:data ${data}`)
  console.log(`posts:error ${error}`)
  if(error) return (<div className="font-bold mb-2 mt-16" style={{ textAlign: 'center' }}>画像取れなかったｸｿｩ</div>)
  if(typeof data === 'object'){
    if(!!data) {
      return (<div>取得完了</div>)
    }
  }
  return (<div>取得中</div>)
}

async function postsTableFetcher(url:string) {
  const body = JSON.stringify({
    pageId: BLOG_INDEX_ID,
    limit: 100,
    cursor: { stack: [] },
    chunkNumber: 0,
    verticalColumns: false,
  })
  const header = {
    'content-type': 'application/json',
    cookie: `token_v2=${NOTION_TOKEN}`,
  }
  return new Promise((resolve, reject) => {
    fetch(url, { 
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        cookie: `token_v2=${NOTION_TOKEN}`,
      },
      body: body,
    }).then(res => resolve(res.json()))
    // axios
    //   .get(url, {headers: header, data: body})
    //   .then(res => {
    //     resolve(res.data)
    //   })
    //   .catch(err => {
    //     reject(err)
    //   })
    })
}

type typeImageTableState = {
  message: string
}

export default class PostsTable extends React.Component<{}, typeImageTableState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      message: null,
    }
  }

  async componentDidMount() {
    await sleep(3000)
    this.setState({ message: '- FINISHED -' })
  }

  render() {
    const endpoint = `${REACT_APP_API_ENDPOINT_URL}?maxid=&gettweetnum=`
    return (
      <div>
        <SWRConfig value={{dedupingInterval:10000*6*15}}>
          <PostsTableGet url={`${API_ENDPOINT}/loadPageChunk`} />
        </SWRConfig>
      </div>
    )
  }
}
