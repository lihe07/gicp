import Head from "next/head";
import {
  Card,
  Code,
  Heading,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  Link,
  Text,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useState } from "react";

export default function SitePage() {
  const data = useState();

  return (
    <>
      <Head>
        <title>Gay ICP - 站点详情</title>
      </Head>
      <main className="max-width">
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
                  <Td>GiCP-%ID%</Td>
                </Tr>
                <Tr>
                  <Td>介绍</Td>
                  <Td>%NOTE%</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          <Text my="3" mx="6">
            添加到您的网站：「
            <Code fontFamily="sans-serif">
              {`<a href="https://www.icp.gay/id/%ID%" target="_blank">GayICP备%ID%号</a>`}
            </Code>
            」
          </Text>
        </Card>
      </main>
    </>
  );
}
