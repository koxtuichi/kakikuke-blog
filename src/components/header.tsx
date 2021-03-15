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

const ogImageUrl = 'https://xn--n8jdoikmo8i.com/twitterCardImage.png'

const Header = ({ titlePre = '', className = '' }) => {
  const { pathname } = useRouter()

  return (
    <header className={`${styles.header} ${className}`}>
      <Head>
        <title>{titlePre ? `${titlePre}` : ''}</title>
        <script async src="https://cdn.splitbee.io/sb.js"></script>
        <meta
          name="description"
          content="An example Next.js site using Notion for the blog"
        />
        <meta name="og:title" content={titlePre || 'かきくけこういち.COM'} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:site" content="@kakikukekoichi" />
        <meta name="twitter:card" content="summary" />
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
export default Header