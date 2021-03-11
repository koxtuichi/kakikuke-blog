import React from 'react'
import { TweenMax } from 'gsap'

export default class MouseCorsor extends React.Component {
  componentDidMount() {
    this.func()
  }

  func() {
    var cursor = document.getElementsByClassName('shared_cursor__1IaO0'),
      follower = document.getElementsByClassName('shared_follower__Gb56c'),
      cWidth = 8, //カーソルの大きさ
      fWidth = 40, //フォロワーの大きさ
      delay = 10, //数字を大きくするとフォロワーがより遅れて来る
      mouseX = 0, //マウスのX座標
      mouseY = 0, //マウスのY座標
      posX = 0, //フォロワーのX座標
      posY = 0 //フォロワーのX座標

    TweenMax.to({}, 0.001, {
      repeat: -1,
      onRepeat: function() {
        posX += (mouseX - posX) / delay
        posY += (mouseY - posY) / delay

        TweenMax.set(follower, {
          css: {
            left: posX - fWidth / 2,
            top: posY - fWidth / 2,
          },
        })

        TweenMax.set(cursor, {
          css: {
            left: mouseX - cWidth / 2,
            top: mouseY - cWidth / 2,
          },
        })
      },
    })

    document.addEventListener(
      'mousemove',
      function(e) {
        mouseX = e.pageX
        mouseY = e.pageY
        // click event
      },
      false
    )
    // $("a").on({
    //   "mouseenter": function() {
    //     cursor.addClass("is-active");
    //     follower.addClass("is-active");
    //   },
    //   "mouseleave": function() {
    //     cursor.removeClass("is-active");
    //     follower.removeClass("is-active");
    //   }
    // });
  }

  render() {
    return null // 何も描画しない
  }
}
