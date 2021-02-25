import Link from 'next/link'
import Head from 'next/head'
import ExtLink from './ext-link'
import { useRouter } from 'next/router'
import styles from '../styles/header.module.css'

const navItems: { label: string; page?: string; link?: string }[] = [
  { label: 'Profile', page: '/' },
  { label: 'Blog', page: '/blog' },
  { label: 'Favorite', page: '/favorite' },
]

//TODO:画像は差し替える
const ogImageUrl = 'https://notion-blog.now.sh/og-image.png'

export default ({ titlePre = '', className = '' }) => {
  const { pathname } = useRouter()

  return (
    <header className={`${styles.header} ${className}`}>
      <Head>
        <title>{titlePre ? `${titlePre} |` : ''}</title>
        <meta
          name="description"
          content="An example Next.js site using Notion for the blog"
        />
        <meta name="og:title" content="novel warehouse" />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:site" content="@_ijjk" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Head>
      <ul>
        {navItems.map(({ label, page, link }) => (
          <li key={label}>
            {page ? (
              <Link href={page}>
                <a className={pathname === page ? 'active' : undefined}>
                  {label}
                </a>
              </Link>
            ) : (
              <ExtLink href={link}>{label}</ExtLink>
            )}
          </li>
        ))}
      </ul>
    </header>
  )
}
