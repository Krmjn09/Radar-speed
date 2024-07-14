import React, { useState, useEffect } from "react"
import axios from "axios"
import { Line } from "react-chartjs-2"
import "chart.js/auto"
import { ChartData, ChartDataset, PluginOptionsByType } from "chart.js"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

interface ThingSpeakChartProps {
  channelId: string
  apiKey: string
  date?: Date
  startDate?: Date
  endDate?: Date
}

const ThingSpeakChart: React.FC<ThingSpeakChartProps> = ({
  channelId,
  apiKey,
  date,
  startDate,
  endDate,
}) => {
  const [chartData, setChartData] = useState<ChartData<
    "line",
    (number | ChartDataset<"line", (number | null)[]>)[],
    any
  > | null>(null)
  const [overspeedingCount, setOverspeedingCount] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      let startOfDay = ""
      let endOfDay = ""

      if (date) {
        const formattedDate = dayjs(date)
          .tz("Asia/Kolkata")
          .format("YYYY-MM-DD")
        startOfDay = `${formattedDate} 00:00:00`
        endOfDay = `${formattedDate} 23:59:59`
      } else if (startDate && endDate) {
        startOfDay =
          dayjs(startDate).tz("Asia/Kolkata").format("YYYY-MM-DD") + " 00:00:00"
        endOfDay =
          dayjs(endDate).tz("Asia/Kolkata").format("YYYY-MM-DD") + " 23:59:59"
      }

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
        dayjs(feed.created_at).tz("Asia/Kolkata").format("DD-MM   hh:mmA")
      )
      const data = feeds.map((feed: any) => parseFloat(feed.field1))
      const count = data.filter((value: number) => value > 25).length

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
  }, [channelId, apiKey, date, startDate, endDate])

  const dateText = date
    ? dayjs(date).tz("Asia/Kolkata").format("YYYY-MM-DD")
    : `${dayjs(startDate).tz("Asia/Kolkata").format("YYYY-MM-DD")} - ${dayjs(
        endDate
      )
        .tz("Asia/Kolkata")
        .format("YYYY-MM-DD")}`

  const customPlugin = {
    id: "customCanvasBackgroundColor",
    beforeDraw: (chart: any) => {
      const ctx = chart.ctx
      const { width, height } = chart.chartArea
      ctx.save()
      ctx.font = "16px Arial"
      ctx.fillStyle = "black"
      ctx.textAlign = "right"
      ctx.fillText(dateText, width - 10, 20)
      ctx.restore()
    },
  }

  return (
    <div className="p-4">
      <div className="mb-4 ml-3">
        <h3 className="font-bold bg-blue-100">
          Number of Overspeeding Vehicles:{" "}
          <span className="font-bold">{overspeedingCount}</span>
        </h3>
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
                  font: {
                    size: 20,
                  },
                  color: "black",
                },
                ticks: {
                  maxRotation: 90,
                  minRotation: 30,
                  callback: function (value, index, values) {
                    return chartData.labels
                      ? chartData.labels[index].replace(" ", "   ")
                      : ""
                  },
                  font: {
                    size: 9,
                    weight: "bold",
                  },
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Speed (km/h)",
                  font: {
                    size: 20,
                  },
                  color: "black",
                },
                ticks: {
                  font: {
                    size: 12,
                    weight: "bold",
                  },
                },
              },
            },
            plugins: {
              customCanvasBackgroundColor: customPlugin,
            } as unknown as PluginOptionsByType<"line">,
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )
}

export default ThingSpeakChart
