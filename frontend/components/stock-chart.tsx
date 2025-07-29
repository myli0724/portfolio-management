"use client"

import { useEffect, useRef } from "react"
import { HistoryItem } from "@/types/history"

interface StockChartProps {
  historyData: HistoryItem[]
  color?: string
}

export default function StockChart({ historyData, color = "#ef4444" }: StockChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const data = historyData.map(history => history.close);

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const padding = 10 // 减少padding确保图表不会超出边界

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    if (data.length < 2) return

    // Calculate min and max values with some margin
    const minValue = Math.min(...data)
    const maxValue = Math.max(...data)
    const range = maxValue - minValue || 1
    const margin = range * 0.1 // 10% margin

    // Create gradient
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding)
    gradient.addColorStop(0, `${color}40`)
    gradient.addColorStop(1, `${color}00`)

    // Calculate points
    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding)
      const y = padding + ((maxValue + margin - value) / (range + 2 * margin)) * (height - 2 * padding)
      return { x, y }
    })

    // Draw area
    ctx.beginPath()
    ctx.moveTo(points[0].x, height - padding)
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.lineTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.lineTo(points[points.length - 1].x, height - padding)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw line
    ctx.beginPath()
    points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw points
    points.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI)
      ctx.fillStyle = color
      ctx.fill()
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 1
      ctx.stroke()
    })
  }, [data, color])

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
