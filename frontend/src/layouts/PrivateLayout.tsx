
import type { ReactNode } from "react"
import SideBar from "../views/components/sideBar"


interface PrivateLayoutProps {
  children: ReactNode
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <div className="flex flex-col h-screen">

  <div className="flex flex-1">
    <SideBar />

    <main className="flex-1 overflow-y-auto p-6 bg-gray-50 ml-64">
      {children}
    </main>
  </div>

</div>
  )
}