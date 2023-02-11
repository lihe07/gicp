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
            <Text mt="3"> </Text>

            <DataTable isAdmin={false}></DataTable>
        </main>
    </>


}