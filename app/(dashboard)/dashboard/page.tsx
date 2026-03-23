"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function DashboardPage() {
  const [quota, setQuota] = useState<any>(null)
  const [recentUsage, setRecentUsage] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/user/quota").then(r => r.json()),
      fetch("/api/user/usage?limit=5").then(r => r.json()),
    ]).then(([quotaData, usageData]) => {
      if (quotaData.success) setQuota(quotaData.data)
      if (usageData.success) setRecentUsage(usageData.data.usages)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="flex justify-center p-8">加载中...</div>
  }

  const getPlanTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      FREE: "免费版",
      BASIC: "基础版",
      PRO: "专业版",
      ENTERPRISE: "企业版",
    }
    return labels[type] || type
  }

  const getActionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      HUMANIZE: "人性化处理",
      DETECT: "AI检测",
      CHECK: "重复率检查",
    }
    return labels[type] || type
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} 天前`
    if (hours > 0) return `${hours} 小时前`
    return "刚刚"
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">欢迎回来</h1>
        <p className="text-gray-600 dark:text-gray-400">管理您的额度和使用记录</p>
      </div>

      {/* Quota Overview */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>额度概览</CardTitle>
              <CardDescription>查看您的剩余额度</CardDescription>
            </div>
            <Badge variant="secondary">{getPlanTypeLabel(quota?.planType)}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">剩余额度</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {quota?.remainingQuota} / {quota?.totalQuota} 字符
                </span>
              </div>
              <Progress value={quota?.usagePercentage || 0} />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{quota?.remainingQuota}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">剩余</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{quota?.usedQuota}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">已用</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{quota?.usagePercentage}%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">使用率</div>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/dashboard/quota" className="flex-1">
                <Button variant="outline" className="w-full">查看详情</Button>
              </Link>
              <Link href="/" className="flex-1">
                <Button className="w-full">开始处理</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>最近活动</CardTitle>
              <CardDescription>您最近的使用记录</CardDescription>
            </div>
            <Link href="/dashboard/usage">
              <Button variant="ghost" size="sm">查看全部</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentUsage.length === 0 ? (
            <p className="text-center text-gray-500 py-8">暂无使用记录</p>
          ) : (
            <div className="space-y-4">
              {recentUsage.map((usage) => (
                <div key={usage.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="font-medium">{getActionTypeLabel(usage.actionType)}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      处理 {usage.inputLength} 字符，扣除 {usage.quotaDeducted} 额度
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(usage.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
