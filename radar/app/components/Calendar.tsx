import React, { useState } from "react"
import {
  format,
  addMonths,
  subMonths,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns"

const Calendar = ({ onDateSelect }: { onDateSelect: (date: Date) => void }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center py-2">
        <div className="flex space-x-7 items-center">
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-2 rounded"
            onClick={prevMonth}
          >
            Prev
          </button>
          <button
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-1 px-2 rounded "
            onClick={nextMonth}
          >
            Next
          </button>
          <span className="font-semibold text-lg ">
            {format(currentMonth, "MMMM yyyy")}
          </span>
        </div>
      </div>
    )
  }

  const renderDays = () => {
    const days = []
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 })

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="w-10 h-10 flex items-center justify-center " key={i}>
          {format(addDays(startDate, i), "EEE")}
        </div>
      )
    }

    return <div className="flex">{days}</div>
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ""

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d")
        const cloneDay = day
        days.push(
          <div
            className={`w-10 h-10 flex items-center justify-center cursor-pointer ${
              !isSameMonth(day, monthStart)
                ? "text-gray-400"
                : isSameDay(day, selectedDate)
                ? "bg-blue-500 text-white"
                : ""
            }`}
            key={day.toString()}
            onClick={() => onDateClick(cloneDay)}
          >
            <span>{formattedDate}</span>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div className="flex" key={day.toString()}>
          {days}
        </div>
      )
      days = []
    }

    return <div>{rows}</div>
  }

  const onDateClick = (day: Date) => {
    setSelectedDate(day)
    onDateSelect(day)
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  return (
    <div className="p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  )
}

export default Calendar
