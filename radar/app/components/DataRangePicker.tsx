import React, { useState } from "react"

interface DateRangePickerProps {
  onDateRangeSelect: (startDate: Date, endDate: Date) => void
  onClose: () => void
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onDateRangeSelect,
  onClose,
}) => {
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const handleStartDateChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStartDate(new Date(event.target.value))
  }

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(new Date(event.target.value))
  }

  const handleApply = () => {
    onDateRangeSelect(startDate, endDate)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-md mx-4">
        <div className="flex flex-col space-y-4 items-center">
          <div className="w-full">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate.toISOString().substr(0, 10)}
              onChange={handleStartDateChange}
              className="ml-2 border rounded p-1 w-full"
            />
          </div>
          <div className="w-full">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate.toISOString().substr(0, 10)}
              onChange={handleEndDateChange}
              className="ml-2 border rounded p-1 w-full"
            />
          </div>
          <button
            onClick={handleApply}
            className="bg-blue-500 text-white px-3 py-2 rounded mt-4 text-sm"
            // Adjusted padding and font size to make the button smaller
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default DateRangePicker
