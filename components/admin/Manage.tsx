import { Heading, Card, Table, Thead, Tr, Th, Button, ButtonGroup, Tbody } from "@chakra-ui/react"
import DataTable from "../DataTable"

export default function Manage() {

    const token = document.cookie.split("token=")[1].split(";")[0]

    return <main className="max-width">

        <Heading mt="10">站点管理</Heading>

        <DataTable isAdmin={true} token={token}></DataTable>
        </main>

}