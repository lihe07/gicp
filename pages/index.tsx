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
        <Heading textAlign="center" size="2xl" fontWeight="light">GICP</Heading>
        <Heading textAlign="center" size="lg">Welcome to GICP</Heading>

        <Alert status='warning' mt="10">
          <AlertIcon></AlertIcon>
          <AlertDescription color="orange.500">
            提示:
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis id vitae unde
          </AlertDescription>
        </Alert>

        <Heading mt="10" size="lg">介绍</Heading>
        <Text mt="3">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident vitae pariatur explicabo, ex tempora laborum harum, impedit non quos commodi veniam dolore sapiente. Harum impedit dolorem facere temporibus quo nobis?
        </Text>
        <style jsx>{`
          main {
            padding-top: 60px;
          }
          `}</style>
      </main>
    </>
  )
}
