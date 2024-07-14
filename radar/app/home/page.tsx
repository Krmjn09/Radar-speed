// pages/homepage.tsx
"use client"
import { useState } from "react"
import { UserButton } from "@clerk/nextjs"
import Image from "next/image"
import logo from "../images/TIET-Logo.png"
import Calendar from "../components/Calendar"
import ThingSpeakChart from "../components/thinkspeak"
import DateRangePicker from "../components/DataRangePicker"

const Homepage = () => {
  const channelId = "2586394" // Replace with your ThingSpeak Channel ID
  const apiKey = "ONF0P9WIPWH2TLEB" // Replace with your ThingSpeak API Key
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [isDateRangePickerOpen, setIsDateRangePickerOpen] = useState(false)
  const [activeComponent, setActiveComponent] = useState<
    "calendar" | "dateRangePicker" | null
  >(null)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setStartDate(date)
    setEndDate(date)
  }

  const handleDateRangeSelect = (start: Date, end: Date) => {
    setStartDate(start)
    setEndDate(end)
  }

  const openDateRangePicker = () => {
    setIsDateRangePickerOpen(true)
    setActiveComponent("dateRangePicker")
  }

  const closeDateRangePicker = () => {
    setIsDateRangePickerOpen(false)
    setActiveComponent(null)
  }

  return (
    <div className="w-screen h-screen relative">
      <aside className="absolute left-0 top-0 h-full w-[80px] sm:w-[100px] border-r border-black/10 flex flex-col items-center">
        <div className="px-4 my-4">
          <Image src={logo} alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16" />
        </div>
      </aside>
      <div className="ml-[80px] sm:ml-[100px] h-full w-[calc(100vw-80px)] sm:w-[calc(100vw-100px)]">
        <header className="h-[50px] sm:h-[60px] border-b border-black/10 flex justify-between items-center px-2 sm:px-4">
          <h1 className="text-xl sm:text-1xl">
            Speed Detection System Of Thapar
          </h1>
          <nav className="h-full">
            <div className="flex items-center justify-end h-full">
              <UserButton afterSignOutUrl="/" />
            </div>
          </nav>
        </header>
        <div className="p-2 sm:p-4 flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3">
            <Calendar onDateSelect={handleDateSelect} />
            <button
              onClick={openDateRangePicker}
              className="bg-blue-500 text-white ml-7 px-3 py-2 rounded mt-w-full mt-10"
              disabled={activeComponent === "calendar"}
            >
              Date Range
            </button>
          </div>
          <div className="w-full sm:flex-grow mt-4 sm:mt-0">
            <ThingSpeakChart
              channelId={channelId}
              apiKey={apiKey}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      </div>
      {isDateRangePickerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <DateRangePicker
              onDateRangeSelect={handleDateRangeSelect}
              onClose={closeDateRangePicker}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Homepage

// global.css (Add the following styles to make the website more responsive and improve alignment)
