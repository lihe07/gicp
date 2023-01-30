import { Button, Card, Box, CardBody, CardHeader, FormControl, FormHelperText, FormLabel, Heading, Input, Text, InputGroup, InputLeftAddon, Textarea } from "@chakra-ui/react";
import Head from "next/head";
import Form from "@/components/apply/Form";

export default function Apply() {
    return <>
        <Head>
            <title>GICP - 申请</title>
        </Head>
        <main className="max-width">
            <Heading mt="10">申请 GICP ID</Heading>
            <Text mt="3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dolorem ratione cumque totam tempora, molestiae obcaecati natus nisi delectus, dolores quidem reiciendis? Reiciendis neque dignissimos omnis perspiciatis molestiae quae nam!</Text>

            <Form></Form>
        </main>
    </>
}