import React from 'react'
import axios from 'axios'
import ImageTable from './imageTable'
import { REACT_APP_API_ENDPOINT_URL } from '../lib/notion/server-constants'
import useSWR, { SWRConfig } from 'swr'

type typeImageTableState = {
  message: string
}

class MainTable extends React.Component<{}, typeImageTableState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      message: null,
    }
  }

  async componentDidMount() {
    window.setTimeout(() => this.setState({ message: '- FINISHED -' }), 4000);
  }

  render() {
    const endpoint = `${REACT_APP_API_ENDPOINT_URL}?maxid=&gettweetnum=`

    return (
      <div>
        <SWRConfig value={{dedupingInterval:10000*6*15}}>
          <ImageTable images={imagesList} />
          <TweetGet url={endpoint} />
        </SWRConfig>
      </div>
    )
  }
}
export default MainTable

interface ImagesI {
  url: string[]
  height: number[]
  source: string[]
  max_id: string
}
export let imagesList:ImagesI
const TweetGet = ({url}:any):any => {
  const { data, error } = useSWR([url], tweetImageFetcher)
  if(error) return (<div className="font-bold mb-2 mt-16" style={{ textAlign: 'center' }}>画像取れなかったｸｿｩ</div>)
  if(typeof data === 'object'){
    imagesList = ({
      url:(data as ImagesI).url,
      height:(data as ImagesI).height,
      source:(data as ImagesI).source,
      max_id:(data as ImagesI).max_id,
    })
    if(!!data) {
      return (<hr />)
    }
  }
  return (<div className="font-bold mb-2 mt-16" style={{ textAlign: 'center' }}>画像取得中・・・</div>)
}

const tweetImageFetcher = (url:string) => {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
