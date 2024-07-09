import { UserButton } from "@clerk/nextjs"
import Link from "next/link"

const homepage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-screen h-screen h-relative">
      <aside className="absolute left-0 top-0 h-full w-[100px] border-r border-black/10">
        <div className="px-4 my-4">
          <span className="text-0.5xl">Speed Detection</span>
        </div>
        <div></div>
      </aside>
      <div className="ml-[100px] h-full w-[calc(100vw-100px)]">
        <header className="h-[60px] border-b border-black/10">
          <nav className="px-4 h-full">
            <div className="flex items-center justify-end h-full">
              <UserButton afterSignOutUrl="/" />
            </div>
          </nav>
        </header>
        <div className="h-[calc(100vh-60px)]">{children}</div>
      </div>
    </div>
  )
}

export default homepage
