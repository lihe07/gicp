import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useColorMode } from '@chakra-ui/color-mode'
import { Icon, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { MdTranslate } from 'react-icons/md'


interface LinkProps {
    href: string,
    children: React.ReactNode
}

function Link({ href, children }: LinkProps) {
    const router = useRouter()
    return <>
        <NextLink href={href} className={"link " + (router.pathname === href && "active")}>
            {children}
        </NextLink>
        <style jsx global>{`
        .link:hover {
            text-decoration: underline;
        }
        .link.active {
            color: #06b6d4;
        }
        `}</style>
    </>
}

export default function Header() {
    const { colorMode, toggleColorMode } = useColorMode()

    return <header>
        <div className="content">
            <NextLink href="/">GICP</NextLink>
            <div style={{ flex: 1 }}></div>
            <div className="links">
                <Link href="/apply">申请</Link>
                <Link href="/list">列表</Link>
                {/* <Link href="/about">About</Link> */}
            </div>
            <div className="buttons">
                <IconButton variant="ghost" aria-label="Toggle Color Mode" onClick={toggleColorMode}>
                    {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                </IconButton>

                {/* <Menu>
                    <MenuButton as={IconButton} icon={<Icon as={MdTranslate}></Icon>} variant="ghost" />
                    <MenuList>
                        <MenuItem>中文</MenuItem>
                        <MenuItem>English</MenuItem>
                    </MenuList>
                </Menu> */}
            </div>
        </div>
        <style jsx>{`
            header {
                padding: 0 20px;
                border-bottom: rgba(0,0,0,0.3) 1px solid;
            }
            
            .content {
                max-width: 75rem;
                margin: auto;
                display: flex;
                align-items: center;
                height: 70px;
            }
            .buttons {
                margin-left: 20px;
                display: flex;
                gap: 5px;
            }

            .links {
                display: flex;
                align-items: center;
                gap: 20px;
            }
        `}</style>
    </header>
}  