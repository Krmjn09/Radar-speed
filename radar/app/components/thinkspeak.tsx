"use client"

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Line } from "react-chartjs-2"
import "chart.js/auto"
import moment from "moment"
import { Calendar, momentLocalizer } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"

const localizer = momentLocalizer(moment)

const ThingSpeakChart = ({
  channelId,
  apiKey,
}: {
  channelId: string
  apiKey: string
}) => {
  const [chartData, setChartData] = useState<{
    daily: {
      labels: string[]
      datasets: {
        label: string
        data: number[]
        fill: boolean
        backgroundColor: string
        borderColor: string
      }[]
    }
    weekly: {
      labels: string[]
      datasets: {
        label: string
        data: number[]
        fill: boolean
        backgroundColor: string
        borderColor: string
      }[]
    }
    monthly: {
      labels: string[]
      datasets: {
        label: string
        data: number[]
        fill: boolean
        backgroundColor: string
        borderColor: string
      }[]
    }
    [key: string]: any // Add index signature
  }>({
    daily: { labels: [], datasets: [] },
    weekly: { labels: [], datasets: [] },
    monthly: { labels: [], datasets: [] },
  })
  const [currentView, setCurrentView] = useState("daily")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    fetchData()
  }, [channelId, apiKey, selectedDate])

  const fetchData = async () => {
    try {
      let startDate = moment().startOf("month")
      let endDate = moment().endOf("month")

      if (selectedDate) {
        startDate = moment(selectedDate).startOf("day")
        endDate = moment(selectedDate).endOf("day")
      }

      const response = await axios.get(
        `https://api.thingspeak.com/channels/${channelId}/feeds.json`,
        {
          params: {
            api_key: apiKey,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
        }
      )

      const data = response.data.feeds

      const processData = (data: any[]) => {
        const chartData: { [key: string]: number } = {}

        data.forEach((feed: any) => {
          const date = moment(feed.created_at).format("YYYY-MM-DD")
          const value = parseFloat(feed.field1)

          if (!chartData[date]) {
            chartData[date] = value
          } else {
            chartData[date] += value
          }
        })

        const labels = Object.keys(chartData).sort()
        const values = labels.map((key) => chartData[key])

        return {
          labels,
          datasets: [
            {
              label: "Sensor Data",
              data: values,
              fill: false,
              backgroundColor: "rgba(75,192,192,0.4)",
              borderColor: "rgba(75,192,192,1)",
            },
          ],
        }
      }

      setChartData({
        daily: processData(data),
        weekly: processData(data),
        monthly: processData(data),
      })
    } catch (error) {
      console.error("Error fetching data from ThingSpeak", error)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const renderChart = () => {
    if (!chartData[currentView].datasets.length) {
      return <p>Loading data...</p>
    }
    return <Line data={chartData[currentView]} />
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">ThingSpeak Sensor Data</h2>
      <div className="flex justify-center mb-4">
        <Calendar
          localizer={localizer}
          events={[]}
          selectable
          onSelectSlot={(slotInfo: any) => handleDateSelect(slotInfo.start)}
        />
      </div>
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded ${
            currentView === "daily" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setCurrentView("daily")}
        >
          Daily
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded ${
            currentView === "weekly" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setCurrentView("weekly")}
        >
          Weekly
        </button>
        <button
          className={`px-4 py-2 rounded ${
            currentView === "monthly" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setCurrentView("monthly")}
        >
          Monthly
        </button>
      </div>
      <div className="chart-container">{renderChart()}</div>
    </div>
  )
}

export default ThingSpeakChart
