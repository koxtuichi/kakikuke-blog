import '../styles/global.css'
import '../styles/index.scss'
import 'katex/dist/katex.css'
import Footer from '../components/footer'

const App =  ({ Component, pageProps }) => (
  <>
    <Component {...pageProps} />
    <Footer />
  </>
)
export default App