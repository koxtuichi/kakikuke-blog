import React from 'react'
import Header from '../components/header'
import sharedStyles from '../styles/shared.module.css'
import MouseCursor from '../lib/notion/mouseCursor'

export async function getStaticProps() {
  return {
    props: {
    },
    revalidate: 60,
  }
}

const RenderTagList = () => {
  return (
    <React.Fragment>
      <Header titlePre="Home" className="mt-6" />
      <MouseCursor />
      <div className={`${sharedStyles.layout}`}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ writingMode: 'vertical-rl', display: 'inline-block' }}>
            <p style={{ fontSize: 40, height: '100%', textAlign: 'start' }}>
              <div>好きなこと、</div>
              <div style={{ marginTop: 40 }}>好きなだけ。</div>
              <div style={{ marginTop: 80 }}>そんな雑録。</div>
            </p>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div style={{ width: '40vw' }} />
          <a href="https://twitter.com/kakikukekoichi">
            <img
              className="hov_img_noLink"
              style={{
                margin: '10px auto',
                borderRadius: '100%',
                width: '20vw',
                maxWidth: '650px',
                minWidth: '300px',
                marginTop: '20px',
              }}
              src="https://lh3.googleusercontent.com/rhioMCwTB2hY4PzVrscGgkihbBO_dTAret6cEOozfALC8rF3Vwp6E-lp57YmeZe9rD4FqyYtamOVvkOsUJIojbeeQPSDxDnhPT-NvtniXSDLNLifEz8xOnxqrhM1rDwqUVy8H1ky5A=w2400"
            />
          </a>
          <div style={{ width: '40vw' }} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default RenderTagList
