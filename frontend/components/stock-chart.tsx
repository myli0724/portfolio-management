"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"
import { HistoryItem } from "@/types/history"

interface StockChartProps {
  historyData: HistoryItem[]
  color?: string
}

export default function StockChart({ historyData, color = "#ff6b00" }: StockChartProps) {
  if (!historyData || historyData.length === 0) {
    return <div className="h-[300px] w-full flex items-center justify-center text-muted-foreground">No data available</div>
  }
  
  const data = historyData.map((item) => ({
    date: new Date(item.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
    value: item.close
  }))
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Value</span>
                        <span className="font-bold text-muted-foreground">
                          {Number(payload[0].value).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                        <span className="font-bold">{payload[0].payload.date}</span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
            cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: "3 3" }}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} isAnimationActive={true} animationDuration={800} animationEasing="ease-out" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
