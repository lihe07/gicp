import type { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import theme from '@/theme'

export default function App({ Component, pageProps }: AppProps) {
  return <ChakraProvider theme={theme}>
    <Header></Header>
    <Component {...pageProps} />
    <Footer></Footer>
    <style jsx global>{`
      .max-width {
        padding: 0 20px;
        max-width: 75rem;
        margin: auto;
        box-sizing: content-box;
      }
    `}</style>
  </ChakraProvider>
}
