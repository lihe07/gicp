import { Alert, Text, AlertIcon, Heading, AlertDescription } from '@chakra-ui/react'
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
      <main className="max-width">
        <Heading textAlign="center" size="2xl" fontWeight="black">GICP</Heading>
        <Heading textAlign="center" size="lg">Welcome to GICP</Heading>

        <Alert status='warning' mt="10">
          <AlertIcon></AlertIcon>
          <AlertDescription color="orange.500">
            提示:
            Because it is the initial stage of the project, there are many areas that need to be improved. If you have any comments or suggestions, please contact QQ: 1733856867, or email tkong@tkong.net          </AlertDescription>
        </Alert>

        <Heading mt="10" size="lg">介绍</Heading>
        <Text mt="3">
          Gay iCP is a way to help 🏳️‍🌈 LGBTQ+ groups to express their identity and be proud of it. We refer to the operation mode and design of China iCP registration and Meo iCP, and made such a project. You are welcome to use it. Sorry for possibly embedding ads in pages as we dont make any money!        </Text>
        <style jsx>{`
          main {
            padding-top: 60px;
          }
          `}</style>
      </main>
    </>
  )
}
