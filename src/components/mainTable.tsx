import React from 'react'
import axios from 'axios'
import ImageTable from './imageTable'
import { REACT_APP_API_ENDPOINT_URL } from '../lib/notion/server-constants'

type typeImageTableState = {
  images: typeImages
  message: string
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
    }
  }

  componentDidMount() {
    this.setState({ message: 'loading...' })
    setTimeout(() => {
      this.getiine()
    }, 500)

    let queue: NodeJS.Timeout
    window.addEventListener('scroll', () => {
      clearTimeout(queue)
      queue = setTimeout(() => {
        const scroll_Y = document.documentElement.scrollTop + window.innerHeight
        const offsetHeight = document.documentElement.offsetHeight
        if (
          offsetHeight - scroll_Y <= 1000 &&
          this.state.message !== 'loading...' &&
          offsetHeight > 1500
        ) {
          this.setState({ message: 'loading...' })
          this.getiine()
        }
      }, 500)
    })
  }

  getiine = () => {
    twitterAPI(this.state.images.max_id)
      .then(res => {
        this.setIineImages(res)
      })
      .catch(() => {
        this.setState({
          message:
            '取得に失敗しました。データが空か、スクリーンネームが間違っているかもしれません。',
        })
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
      this.setState({ message: 'いいねした画像がありませんでした' })
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
        <div>{this.state.message}</div>
      </div>
    )
  }
}
export default like

function twitterAPI(max_id: string) {
  console.log(max_id)
  const endpoint = `${REACT_APP_API_ENDPOINT_URL}?maxid=${max_id}`
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
