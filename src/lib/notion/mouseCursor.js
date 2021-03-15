import React from 'react'
import { TweenMax } from 'gsap'
import sharedStyles from '../../styles/shared.module.css'
import { sleep } from './utils'

export default class MouseCorsor extends React.Component {
  async componentDidMount() {
    const cursor = document.getElementById('cursor') //カーソル用のdivを取得

    //上記のdivタグをマウスに追従させる処理
    document.addEventListener('mousemove', function(e) {
      cursor.style.transform =
        'translate(' + e.clientX + 'px, ' + e.clientY + 'px)'
    })
    const imgNoLinkElem = document.querySelectorAll('.hov_img_noLink')
    imgNoLinkElem.forEach(elem => {
      elem.addEventListener('mouseover', function(e) {
        cursor.classList.add('hov_noLink')
      })
      elem.addEventListener('mouseout', function(e) {
        cursor.classList.remove('hov_noLink')
      })
    })

    const linkElem = document.querySelectorAll('a')
    linkElem.forEach(elem => {
      elem.addEventListener('mouseover', function(e) {
        cursor.classList.add('hov_')
      })
      elem.addEventListener('mouseout', function(e) {
        cursor.classList.remove('hov_')
      })
    })
    await sleep(5000)
    const imgElem = document.querySelectorAll('.hov_img')
    imgElem.forEach(elem => {
      elem.addEventListener('mouseover', function(e) {
        cursor.classList.add('hov_')
      })
      elem.addEventListener('mouseout', function(e) {
        cursor.classList.remove('hov_')
      })
    })
  }

  render() {
    return (
      <React.Fragment>
        <div id="cursor"></div>
      </React.Fragment>
    )
  }
}
