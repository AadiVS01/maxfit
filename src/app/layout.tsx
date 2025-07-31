import { Nav, NavLink } from "./_components/Nav"
import '../styles/globals.css';
export const dynamic = "force-dynamic"

export default function Layout({
    children,
  }: Readonly<{ children: React.ReactNode }>) {
    return (
      <html lang="en">
        <body>
          <Nav>
            <NavLink href="/">Home</NavLink>
            <NavLink href="/gallery">Gallery</NavLink>
            <NavLink href="/savedFits">Saved fits</NavLink>
          </Nav>
          <div className="container my-6  ">{children}</div>
        </body>
      </html>
    )
  }
