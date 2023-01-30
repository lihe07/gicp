import Head from "next/head";

export default function NotFound() {

    return <>
        <Head>
            <title>GICP - 找不到这个页面</title>
        </Head>
        <main>
            <p>404 Not found</p>
            <style jsx>{`
                
                main {
                    display: flex;
                    height: calc(100vh - 71px);
                    justify-content: center;
                    align-items: center;
                }
                `}</style>
        </main>
    </>
}