// pages/homepage.tsx
"use client"
import { useState } from "react"
import { UserButton } from "@clerk/nextjs"
import Image from "next/image"
import logo from "../images/TIET-Logo.png"
import Calendar from "../components/Calendar"
import ThingSpeakChart from "../components/thinkspeak"
const Homepage = () => {
  const channelId = "2586394" // Replace with your ThingSpeak Channel ID
  const apiKey = "ONF0P9WIPWH2TLEB" // Replace with your ThingSpeak API Key
  const [selectedDate, setSelectedDate] = useState(new Date())

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

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
        <div className="p-4 flex">
          <div className="w-1/3">
            <Calendar onDateSelect={handleDateSelect} />
          </div>
          <div className="flex-grow p-4">
            <ThingSpeakChart
              channelId={channelId}
              apiKey={apiKey}
              date={selectedDate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Homepage
