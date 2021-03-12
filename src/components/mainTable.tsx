import React from 'react'
import axios from 'axios'
import ImageTable from './imageTable'
import { REACT_APP_API_ENDPOINT_URL } from '../lib/notion/server-constants'
import { sleep } from '../lib/notion/utils'

const getFirstTweetNum = 30

type typeImageTableState = {
  images: typeImages
  message: string
  getTweetNum: Number
  isLoading: Boolean
  limit: Boolean
  limitMassage: string
}

type typeImages = {
  url: string[]
  height: number[]
  source: string[]
  max_id: string
}

class like extends React.Component<{}, typeImageTableState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      images: {
        url: [],
        height: [],
        source: [],
        max_id: '',
      },
      message: '',
      getTweetNum: getFirstTweetNum,
      isLoading: false,
      limit: false,
      limitMassage: '',
    }
  }

  componentDidMount() {
    this.setState({ message: '画像を取得中だよ...' })
    if (this.state.getTweetNum === getFirstTweetNum) {
      this.getiine()
      this.setState({
        getTweetNum: 50,
      })
    }

    window.addEventListener('scroll', () => {
      const scroll_Y = document.documentElement.scrollTop + window.innerHeight
      const offsetHeight = document.documentElement.offsetHeight
      if (
        offsetHeight - scroll_Y <= 4000 &&
        !this.state.isLoading &&
        !this.state.limit &&
        offsetHeight > 1500
      ) {
        this.getiine()
      }
    })
  }

  getiine = async () => {
    if (this.state.limit) return
    this.setState({
      message: 'loading...',
      isLoading: true,
      limit: true,
      limitMassage: '- FINISHED -',
    })
    await sleep(1000)
    twitterAPI(this.state.images.max_id, this.state.getTweetNum)
      .then(res => {
        this.setIineImages(res)
        this.setState({ isLoading: false })
      })
      .catch(() => {
        this.setState({
          message: '',
          isLoading: false,
          limit: true,
        })
        console.log('取得に失敗しました。')
      })
  }

  setIineImages = (results: any) => {
    this.setState({
      images: {
        url: this.state.images.url.concat(results.url),
        height: this.state.images.height.concat(results.height),
        source: this.state.images.source.concat(results.source),
        max_id: String(results.max_id),
      },
    })
    if (results.url.length === 0) {
      this.setState({
        message: '',
      })
      console.log('いいねした画像が見つかりませんでした。')
      return
    }
    this.setState({
      message: '',
    })
  }

  render() {
    return (
      <div>
        <ImageTable images={this.state.images} />
        {this.state.images.url.length === 0 && <div>{this.state.message}</div>}
        <div
          className="font-bold mb-2 mt-16"
          style={{
            textAlign: 'center',
            display: !this.state.limit ? 'none' : null,
          }}
        >
          {this.state.limitMassage}
        </div>
      </div>
    )
  }
}
export default like

function twitterAPI(max_id: string, gettweetnum: Number) {
  const endpoint = `${REACT_APP_API_ENDPOINT_URL}?maxid=${max_id}&gettweetnum=${gettweetnum}`
  return new Promise((resolve, reject) => {
    axios
      .get(endpoint)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}
