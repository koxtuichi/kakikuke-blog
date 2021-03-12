import React from 'react'
import { TweenMax } from 'gsap'
import sharedStyles from '../../styles/shared.module.css'

export default class MouseCorsor extends React.Component {
  componentDidMount() {
    let cursorR = 4 //カーソルの半径
    const cursor = document.getElementById('cursor') //カーソル用のdivを取得

    //上記のdivタグをマウスに追従させる処理
    document.addEventListener('mousemove', function(e) {
      cursor.style.transform =
        'translate(' + e.clientX + 'px, ' + e.clientY + 'px)'
    })

    //リンクにホバー時はクラスをつける
    const linkElem = document.querySelectorAll('a')
    const imgElem = document.querySelectorAll('.hov_img')
    const imgNoLinkElem = document.querySelectorAll('.hov_img_noLink')

    imgElem.forEach(elem => {
      elem.addEventListener('mouseover', function(e) {
        cursor.classList.add('hov_')
      })
      elem.addEventListener('mouseout', function(e) {
        cursor.classList.remove('hov_')
      })
    })
    linkElem.forEach(elem => {
      elem.addEventListener('mouseover', function(e) {
        cursor.classList.add('hov_')
      })
      elem.addEventListener('mouseout', function(e) {
        cursor.classList.remove('hov_')
      })
    })
    imgNoLinkElem.forEach(elem => {
      elem.addEventListener('mouseover', function(e) {
        cursor.classList.add('hov_noLink')
      })
      elem.addEventListener('mouseout', function(e) {
        cursor.classList.remove('hov_noLink')
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
