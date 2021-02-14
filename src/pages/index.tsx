import Link from 'next/link'
import Header from '../components/header'
import ExtLink from '../components/ext-link'
import Features from '../components/features'
import GitHub from '../components/svgs/github'
import sharedStyles from '../styles/shared.module.css'

export default () => (
  <>
    <Header titlePre="Home" />
    <div className={sharedStyles.layout}>
      <h1>シナリオも絵も音楽もプログラムも</h1>
      <h2 className={sharedStyles.subTitle}>-Blog Tag-</h2>
      <div style={{ textAlign: 'center' }}>
        <Link href={'/blog'}>
          <a>#blog</a>
        </Link>
      </div>
    </div>
  </>
)
