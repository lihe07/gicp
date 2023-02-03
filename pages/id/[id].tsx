import Head from "next/head";
import { useRouter } from "next/router";
import { Card, Heading, TableContainer, Table, Tbody, Tr, Td, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { useState } from 'react';



export default function SitePage() {
    const data = useState();

    return (
        <>
            <Head>
                <title>Gay ICP - 站点详情</title>
            </Head>
            <main className='max-width'>
                <Heading mt="10">站点 %DOMAIN% 的详细信息</Heading>
                <Card mt="10" p="3">
                    <TableContainer>
                        <Table>
                            <Tbody>
                                <Tr>
                                    <Td>站点域名</Td>
                                    <Td>%DOMAIN%</Td>
                                </Tr>
                                <Tr>
                                    <Td>主页地址</Td>
                                    <Td>
                                        <Link href="%HREF%" isExternal>
                                            %HREF%
                                            <ExternalLinkIcon mx="2px"></ExternalLinkIcon>
                                        </Link>
                                    </Td>
                                </Tr>
                                <Tr>
                                    <Td>备案号</Td>
                                    <Td>%ID%</Td>
                                </Tr>
                                <Tr>
                                    <Td>备注</Td>
                                    <Td>
                                        %NOTE%
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Card>
            </main>
        </>
    )
}