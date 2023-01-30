import Head from "next/head";
import DataTable from "@/components/DataTable";
import { Heading, Text } from "@chakra-ui/react";

export default function List() {


    return <>
        <Head>
            <title>GICP - 列表</title>
        </Head>
        <main className="max-width">
            <Heading mt="10">列表</Heading>
            <Text mt="3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dolorem ratione cumque totam tempora, molestiae obcaecati natus nisi delectus, dolores quidem reiciendis? Reiciendis neque dignissimos omnis perspiciatis molestiae quae nam!</Text>

            <DataTable isAdmin={false}></DataTable>
        </main>
    </>


}