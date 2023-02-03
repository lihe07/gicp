import Head from "next/head";

import { Heading } from "@chakra-ui/react";
import { useState, useEffect } from 'react';
import Login from "@/components/admin/Login";
import Manage from "@/components/admin/Manage";

export default function Admin() {

    // Check if has token cookie

    const [isLogin, setIsLogin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (document.cookie.includes("token")) {
            // Check if token is valid
            fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": document.cookie.split("token=")[1].split(";")[0]
                }
            }).then(res => {
                if (res.status === 200) {
                    setIsLogin(true);
                } else {
                    // Clear cookie
                    document.cookie = ""
                }
                setLoading(false);
            }).catch(() => {
                setLoading(false);
            })
        } else {
            setLoading(false);
        }

    }, [])

    return <>
        <Head>
            <title>GICP - 申请管理</title>
        </Head>

        {(!loading) && (isLogin ? <Manage></Manage> : <Login setIsLogin={setIsLogin}></Login>)}
    </>

}