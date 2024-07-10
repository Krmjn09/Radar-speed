// components/ThingSpeakChart.tsx
"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { Line } from "react-chartjs-2"
import "chart.js/auto"
import { ChartData, ChartDataset } from "chart.js"

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

  useEffect(() => {
    const fetchData = async () => {
      const formattedDate = date.toISOString().split("T")[0]
      const response = await axios.get(
        `https://api.thingspeak.com/channels/${channelId}/feeds.json`,
        {
          params: {
            api_key: apiKey,
            start: `${formattedDate} 00:00:00`,
            end: `${formattedDate} 23:59:59`,
          },
        }
      )

      const feeds = response.data.feeds
      const labels = feeds.map((feed: any) => feed.created_at)
      const data = feeds.map((feed: any) => feed.field1)

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
    }

    fetchData()
  }, [channelId, apiKey, date])

  return (
    <div className="p-4">
      {chartData ? <Line data={chartData} /> : <p>Loading...</p>}
    </div>
  )
}

export default ThingSpeakChart
