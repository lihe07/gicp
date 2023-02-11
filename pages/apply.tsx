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
            <Text mt="3">您只需填写相关信息，审核通过后不到24小时就会收到我们的邮件通知！
                <br></br>You only need to fill in the relevant information, and you will receive our email notification after less than 24 hours of review!</Text>

            <Form></Form>
        </main>
    </>
}