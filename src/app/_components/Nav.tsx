"use client"
import { type ComponentProps, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import styles from "./Nav.module.css"



export function Nav({children}: {children : ReactNode}){

    return (
    <nav className={styles.nav}>{children}</nav>
)
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">){
    const pathname = usePathname()
    const isActive = pathname === props.href
    return <Link {...props} className={`${styles.navLink} ${isActive ? styles.active : ''}`}/>
}