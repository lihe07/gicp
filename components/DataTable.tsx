import {
  IconButton,
  Card,
  Table,
  Thead,
  Tr,
  Th,
  Button,
  ButtonGroup,
  Skeleton,
  Tbody,
  Link,
  Icon,
  Editable,
  EditableInput,
  EditablePreview
} from "@chakra-ui/react";

import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  QuestionIcon,
} from "@chakra-ui/icons";

interface Item {
  name: string;
  domain: string;
  href: string;
  id: string;
  note: string;
  email: string;
  phone: string;
  approved: boolean;
}

interface DataTableProps {
  isAdmin: boolean;
  token?: string;
}

export default function DataTable(props: DataTableProps) {
  const [data, setData] = useState<Item[]>([]);
  const [last, setLast] = useState(1);

  const [page, setPage] = useState(1);
  const [inputPage, setInputPage] = useState(page);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setInputPage(page);

    const url = "/api/list?page=" + page;

    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setData(data.items);
        setLast(data.total_pages);
        setIsLoaded(true);
      });
  }, [page]);

  const [loading, setLoading] = useState<string[]>([]);

  function approve(item: Item) {
    setLoading([...loading, `approve${item.id}`]);
    fetch("/api/approve/" + item.id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token || "",
      },
    }).then((res) => {
      if (res.status === 200) {
        item.approved = true;
        setData([...data]);
      }
      setLoading(loading.filter((i) => i !== `approve${item.id}`));
    });
  }

  function disapprove(item: Item) {
    setLoading([...loading, `disapprove${item.id}`]);
    fetch("/api/disapprove/" + item.id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token || "",
      },
    }).then((res) => {
      if (res.status === 200) {
        item.approved = false;
        setData([...data]);
      }
      setLoading(loading.filter((i) => i !== `disapprove${item.id}`));
    });
  }

  function del(item: Item) {
    setLoading([...loading, `del${item.id}`]);
    fetch("/api/list/" + item.id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: props.token || "",
      },
    }).then((res) => {
      if (res.status === 200) {
        setData(data.filter((i) => i.id !== item.id));
      }
      setLoading(loading.filter((i) => i !== `del${item.id}`));
    });
  }

  return (
    <Card mt="10" p="3">
      <Skeleton isLoaded={isLoaded}>
        <Table>
          <Thead>
            <Tr>
              {props.isAdmin && <Th>审核状态</Th>}
              <Th>名称</Th>
              <Th>域名</Th>
              <Th>首页链接</Th>
              <Th>备案号</Th>
              <Th>备注</Th>
              {props.isAdmin && (
                <>
                  <Th>邮箱及手机号</Th>
                  <Th>操作</Th>
                </>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((item) => (
              <Tr key={item.id}>
                {props.isAdmin && (
                  <Th>
                    <Icon
                      boxSize="5"
                      as={item.approved ? CheckCircleIcon : QuestionIcon}
                      color={item.approved ? "green.400" : "blue.400"}
                    ></Icon>
                  </Th>
                )}
                <Th>{item.name}</Th>
                <Th>{item.domain}</Th>
                <Th>
                  <Link isExternal href={item.href}>
                    {item.href}
                    <ExternalLinkIcon mx="2px"></ExternalLinkIcon>
                  </Link>
                </Th>
                <Th>{item.id}</Th>
                <Th>{item.note.length ? item.note : "无"}</Th>
                {props.isAdmin && (
                  <>
                    <Th>
                      {item.email} {item.phone}
                    </Th>
                    <Th>
                      <ButtonGroup size="sm">
                        {item.approved ? (
                          <Button
                            colorScheme="yellow"
                            isLoading={loading.includes(`disapprove${item.id}`)}
                            onClick={() => disapprove(item)}
                          >
                            拒绝
                          </Button>
                        ) : (
                          <Button
                            colorScheme="blue"
                            isLoading={loading.includes(`approve${item.id}`)}
                            onClick={() => approve(item)}
                          >
                            通过
                          </Button>
                        )}

                        <Button
                          colorScheme="red"
                          isLoading={loading.includes(`delete${item.id}`)}
                          onClick={() => del(item)}
                        >
                          删除
                        </Button>
                      </ButtonGroup>
                    </Th>
                  </>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Skeleton>

      {last > 1 && (
        <div>
          <IconButton
            aria-label="First Page"
            onClick={() => setPage(1)}
            isDisabled={page === 1}
          >
            <ArrowLeftIcon></ArrowLeftIcon>
          </IconButton>
          <IconButton
            aria-label="Previous Page"
            onClick={() => setPage(page - 1)}
            isDisabled={page === 1}
          >
            <ChevronLeftIcon></ChevronLeftIcon>
          </IconButton>

          <Editable
            w="10"
            textAlign="center"
            value={inputPage.toString()}
            onChange={(value) => setInputPage(parseInt(value))}
            onCancel={() => setInputPage(page)}
            onSubmit={() => {
              if (isNaN(inputPage) || inputPage > last || inputPage < 1) {
                setInputPage(page);
              } else {
                setPage(inputPage);
              }
            }}
          >
            <EditablePreview></EditablePreview>
            <EditableInput w="10" type="number"></EditableInput>
          </Editable>

          <IconButton
            aria-label="Next Page"
            onClick={() => setPage(page + 1)}
            isDisabled={page === last}
          >
            <ChevronRightIcon></ChevronRightIcon>
          </IconButton>
          <IconButton
            aria-label="Last Page"
            onClick={() => setPage(last)}
            isDisabled={page === last}
          >
            <ArrowRightIcon></ArrowRightIcon>
          </IconButton>
        </div>
      )}

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
  );
}
