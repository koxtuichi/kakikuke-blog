import React from 'react'
import axios from 'axios'
import ImageTable from './imageTable'
import { REACT_APP_API_ENDPOINT_URL } from '../lib/notion/server-constants'

type typeImageTableState = {
  images: typeImages
  message: string
  screen_name: string
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
      screen_name: '',
    }
  }

  componentDidMount() {
    twitterAPI()
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
    this.setState({ images: results, message: 'done' })
    // console.log(this.state.images)
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

function twitterAPI() {
  const endpoint = REACT_APP_API_ENDPOINT_URL
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
