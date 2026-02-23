
import type { ReactNode } from "react"
import Header from "../views/components/header"
import SideBar from "../views/components/sideBar"
import Rodape from "../views/components/rodape"

interface PrivateLayoutProps {
  children: ReactNode
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">

      <Header />

      <div className="flex flex-1">
        <SideBar />

        <main className="flex-1 p-6 bg-gray-50 w-full">
          {children}
        </main>
      </div>

      <Rodape />
    </div>
  )
}