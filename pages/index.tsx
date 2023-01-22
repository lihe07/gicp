import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <Head>
        <title>GICP</title>
        <meta name="description" content="Desc" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Link href="/list">LIST</Link>

        <br></br>

        %KEY%
      </main>
    </>
  )
}
