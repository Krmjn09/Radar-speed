// components/ThingSpeakChart.tsx
"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { Line } from "react-chartjs-2"
import "chart.js/auto"
import { ChartData, ChartDataset } from "chart.js"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

interface ThingSpeakChartProps {
  channelId: string
  apiKey: string
  date: Date
}

const ThingSpeakChart: React.FC<ThingSpeakChartProps> = ({
  channelId,
  apiKey,
  date,
}) => {
  const [chartData, setChartData] = useState<ChartData<
    "line",
    (number | ChartDataset<"line", (number | null)[]>)[],
    any
  > | null>(null)
  const [overspeedingCount, setOverspeedingCount] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      const formattedDate = dayjs(date).tz("Asia/Kolkata").format("YYYY-MM-DD")
      const startOfDay = `${formattedDate} 00:00:00`
      const endOfDay = `${formattedDate} 23:59:59`

      const response = await axios.get(
        `https://api.thingspeak.com/channels/${channelId}/feeds.json`,
        {
          params: {
            api_key: apiKey,
            start: startOfDay,
            end: endOfDay,
          },
        }
      )

      const feeds = response.data.feeds
      const labels = feeds.map((feed: any) =>
        dayjs(feed.created_at).tz("Asia/Kolkata").format("HH:mm:ss")
      )
      const data = feeds.map((feed: any) => parseFloat(feed.field1))
      const count = data.filter((value: number) => value > 30).length

      setChartData({
        labels,
        datasets: [
          {
            label: "Speed",
            data,
            borderColor: "rgba(75,192,192,1)",
            fill: false,
          },
        ],
      })

      setOverspeedingCount(count)
    }

    fetchData()
  }, [channelId, apiKey, date])

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3>Number of Overspeeding Vehicles: {overspeedingCount}</h3>
      </div>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Time",
                },
                ticks: {
                  maxRotation: 90,
                  minRotation: 45,
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Speed",
                },
              },
            },
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default ThingSpeakChart
