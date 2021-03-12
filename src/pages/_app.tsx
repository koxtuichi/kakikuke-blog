import '../styles/global.css'
import '../styles/index.scss'
import 'katex/dist/katex.css'
import Footer from '../components/footer'

export default ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <Footer />
  </>
)
