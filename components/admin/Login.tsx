import { Button, Card, CardBody, CardFooter, CardHeader, FormControl, FormErrorMessage, FormLabel, Heading, Input, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";

interface LoginProps {
    setIsLogin: (isLogin: boolean) => void;
}

export default function Login(props: LoginProps) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const toast = useToast()

    const [loading, setLoading] = useState(false);

    async function login() {
        setLoading(true);

        let e = false;
        if (!username) {
            setUsernameError("请输入用户名");
            e = true;
        }

        if (!password) {
            setPasswordError("请输入密码");
            e = true;
        }

        if (e) {
            setLoading(false);
            return;
        }

        console.log(username, password);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa(username + ":" + password)
                }
            })

            if (res.status === 200) {
                // Store token in cookie
                const token = "Basic " + btoa(username + ":" + password);
                document.cookie = `token=${token}; path=/; max-age=86400;`;
                props.setIsLogin(true);
            } else {
                setUsernameError("用户名或密码错误");
                setPasswordError("用户名或密码错误");
            }

        } catch (e) {
            toast({
                title: "登录失败",
                description: "请检查网络连接",
                status: "error",
                duration: 5000,
                isClosable: true,
            })
        }

        setLoading(false);
    }

    function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
        setUsernameError("");
        setPasswordError("");
        if (e.key === "Enter") {
            login();
        }
    }

    return <main className="max-width" style={{ minHeight: 'calc(100vh - 71px)', display: 'flex' }}>
        <Card mt="10" maxW="500px" flex="1" margin="auto">
            <CardHeader textAlign="center">
                <Heading mt="5">登录</Heading>
                <Text mt="5">请使用配置的管理员账户登录</Text>
            </CardHeader>
            <CardBody>
                <FormControl isRequired isInvalid={!!usernameError}>
                    <FormLabel>用户名</FormLabel>
                    <Input placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)} onKeyUp={onKeyUp}></Input>
                    <FormErrorMessage>{usernameError}</FormErrorMessage>
                </FormControl>

                <FormControl isRequired mt="5" isInvalid={!!passwordError}>
                    <FormLabel>密码</FormLabel>
                    <Input placeholder="密码" type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyUp={onKeyUp}></Input>
                    <FormErrorMessage>{passwordError}</FormErrorMessage>
                </FormControl>
            </CardBody>
            <CardFooter>
                <Button colorScheme="blue" w="full" onClick={() => login()} isLoading={loading}>登录</Button>
            </CardFooter>
        </Card>
    </main>

}