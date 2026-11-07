
import type { ReactNode } from "react";
import SideBar from "../views/components/sideBar";

interface PrivateLayoutProps {
  children: ReactNode;
}
export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SideBar />

      <main className="min-w-0 flex-1 overflow-y-auto bg-gray-50 p-0 pt-16 md:pt-0 md:ml-64">
        <div className="w-full min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}