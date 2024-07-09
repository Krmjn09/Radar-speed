// pages/homepage.jsx
import { UserButton } from "@clerk/nextjs"
import Link from "next/link"
import logo from "../images/TIET-Logo.png"
import ThingSpeakChart from "../components/thinkspeak"
import Image from "next/image" // Import the 'Image' component from the appropriate library

const homepage = ({ children }: { children: React.ReactNode }) => {
  const channelId = "2586394" // Replace with your ThingSpeak Channel ID
  const apiKey = "ONF0P9WIPWH2TLEB" // Replace with your ThingSpeak API Key

  return (
    <div className="w-screen h-screen relative">
      <aside className="absolute left-0 top-0 h-full w-[100px] border-r border-black/10 flex flex-col items-center">
        <div className="px-4 my-4">
          <Image src={logo} alt="Logo" className="w-16 h-16" />
        </div>
      </aside>
      <div className="ml-[100px] h-full w-[calc(100vw-100px)]">
        <header className="h-[60px] border-b border-black/10 flex justify-between items-center px-4">
          <h1 className="text-2xl">Speed Detection</h1>
          <nav className="h-full">
            <div className="flex items-center justify-end h-full">
              <UserButton afterSignOutUrl="/" />
            </div>
          </nav>
        </header>
        <div className="h-[calc(100vh-60px)] px-4 py-4">
          <ThingSpeakChart channelId={channelId} apiKey={apiKey} />
        </div>
      </div>
    </div>
  )
}

export default homepage
