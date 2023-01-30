import { Card, Text, Heading, Skeleton, Table, Tbody, Th, Thead, Tr, IconButton, Editable, EditablePreview, EditableInput, Link } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ArrowLeftIcon, ChevronLeftIcon, ArrowRightIcon, ChevronRightIcon, ExternalLinkIcon } from "@chakra-ui/icons";

interface Item {
    name: string,
    domain: string,
    href: string,
    id: string,
    note: string
}

export default function List() {
    const [data, setData] = useState<Item[]>([])
    const [last, setLast] = useState(1)

    const [page, setPage] = useState(1)
    const [inputPage, setInputPage] = useState(page)

    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {

        setIsLoaded(false)
        setInputPage(page)

        const url = location.pathname + "?page=" + page

        setTimeout(() => {

            setData(
                [
                    {
                        name: 'Test',
                        domain: 'baidu.com',
                        href: 'https://baidu.com',
                        id: '123',
                        note: 'Lorem ipsum'
                    }
                ]
            )
            setLast(10)

            setIsLoaded(true)
        }, 1000)

    }, [page])


    return <>
        <Head>
            <title>GICP - 列表</title>
        </Head>
        <main className="max-width">
            <Heading mt="10">列表</Heading>
            <Text mt="3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut dolorem ratione cumque totam tempora, molestiae obcaecati natus nisi delectus, dolores quidem reiciendis? Reiciendis neque dignissimos omnis perspiciatis molestiae quae nam!</Text>


            <Card mt="10" p="3">
                <Skeleton isLoaded={isLoaded}>
                    <Table>
                        <Thead>
                            <Tr>
                                <Th>名称</Th>
                                <Th>域名</Th>
                                <Th>首页链接</Th>
                                <Th>备案号</Th>
                                <Th>备注</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                data.map(item => (
                                    <Tr key={item.id}>
                                        <Th>{item.name}</Th>
                                        <Th>{item.domain}</Th>
                                        <Th>
                                            <Link isExternal href={item.href}>
                                                {item.href}
                                                <ExternalLinkIcon mx="2px"></ExternalLinkIcon>
                                            </Link>
                                        </Th>
                                        <Th>{item.id}</Th>
                                        <Th>{item.note}</Th>
                                    </Tr>
                                ))
                            }
                        </Tbody>
                    </Table>
                </Skeleton>

                <div>
                    <IconButton aria-label="First Page" onClick={() => setPage(1)} isDisabled={page === 1}>
                        <ArrowLeftIcon></ArrowLeftIcon>
                    </IconButton>
                    <IconButton aria-label="Previous Page" onClick={() => setPage(page - 1)} isDisabled={page === 1}>
                        <ChevronLeftIcon></ChevronLeftIcon>
                    </IconButton>

                    <Editable w="10" textAlign="center" value={inputPage.toString()}
                        onChange={value => setInputPage(parseInt(value))}
                        onCancel={() => setInputPage(page)}
                        onSubmit={() => { if (isNaN(inputPage) || inputPage > last || inputPage < 1) { setInputPage(page) } else { setPage(inputPage) } }}
                    >
                        <EditablePreview></EditablePreview>
                        <EditableInput w="10" type="number"></EditableInput>
                    </Editable>


                    <IconButton aria-label="Next Page" onClick={() => setPage(page + 1)} isDisabled={page === last}>
                        <ChevronRightIcon></ChevronRightIcon>
                    </IconButton>
                    <IconButton aria-label="Last Page" onClick={() => setPage(last)} isDisabled={page === last}>
                        <ArrowRightIcon></ArrowRightIcon>
                    </IconButton>
                </div>

                <style jsx>{`
                    div {
                        margin-top: 20px;
                        padding: 10px 20px;
                        display: flex;
                        width: 100%;
                        align-items: center;
                        justify-content: space-between;
                    }
                `}</style>
            </Card>
        </main>
    </>


}