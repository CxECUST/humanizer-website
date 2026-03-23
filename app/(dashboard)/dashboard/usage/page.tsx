"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function UsagePage() {
  const [usages, setUsages] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    loadData()
  }, [page])

  const loadData = async () => {
    setLoading(true)
    try {
      const [usageRes, statsRes] = await Promise.all([
        fetch(`/api/user/usage?limit=20&offset=${(page - 1) * 20}`),
        fetch("/api/user/usage/stats"),
      ])
      const usageData = await usageRes.json()
      const statsData = await statsRes.json()

      if (usageData.success) setUsages(usageData.data.usages)
      if (statsData.success) setStats(statsData.data)
    } catch (error) {
      console.error("Failed to load usage data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      HUMANIZE: "人性化处理",
      DETECT: "AI检测",
      CHECK: "重复率检查",
    }
    return labels[type] || type
  }

  const getActionTypeBadge = (type: string) => {
    const variants: Record<string, any> = {
      HUMANIZE: "default",
      DETECT: "secondary",
      CHECK: "outline",
    }
    return variants[type] || "outline"
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getModeLabel = (mode: string) => {
    const labels: Record<string, string> = {
      standard: "标准",
      deep: "深度",
      quick: "快速",
    }
    return labels[mode] || mode
  }

  const getToneLabel = (tone: string) => {
    const labels: Record<string, string> = {
      natural: "自然",
      formal: "正式",
      casual: "随意",
      professional: "专业",
      humorous: "幽默",
      academic: "学术",
    }
    return labels[tone] || tone
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">使用记录</h1>
        <p className="text-gray-600 dark:text-gray-400">查看您的历史使用记录</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.totalRequests}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">总请求次数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalCharactersProcessed?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">处理字符数</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                {stats.averageAiScoreImprovement?.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">平均AI分数改善</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {stats.averageUniquenessScore?.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">平均原创度</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>使用记录</CardTitle>
          <CardDescription>您所有的文本处理历史</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">加载中...</div>
          ) : usages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">暂无使用记录</div>
          ) : (
            <div className="space-y-4">
              {usages.map((usage) => (
                <div key={usage.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={getActionTypeBadge(usage.actionType)}>
                        {getActionTypeLabel(usage.actionType)}
                      </Badge>
                      {usage.mode && (
                        <Badge variant="outline" className="text-xs">
                          {getModeLabel(usage.mode)}
                        </Badge>
                      )}
                      {usage.tone && (
                        <Badge variant="outline" className="text-xs">
                          {getToneLabel(usage.tone)}
                        </Badge>
                      )}
                      {usage.antiDuplicate && (
                        <Badge variant="secondary" className="text-xs">
                          防重复
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(usage.createdAt)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">输入长度</div>
                      <div className="font-medium">{usage.inputLength} 字符</div>
                    </div>
                    <div>
                      <div className="text-gray-600 dark:text-gray-400">扣除额度</div>
                      <div className="font-medium">{usage.quotaDeducted}</div>
                    </div>
                    {usage.aiScoreBefore !== null && (
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">AI分数</div>
                        <div className="font-medium">
                          {usage.aiScoreBefore} → {usage.aiScoreAfter}
                        </div>
                      </div>
                    )}
                    {usage.uniquenessScore !== null && (
                      <div>
                        <div className="text-gray-600 dark:text-gray-400">原创度</div>
                        <div className="font-medium">{usage.uniquenessScore}%</div>
                      </div>
                    )}
                  </div>

                  {usage.language && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      语言: {usage.language === "zh" ? "中文" : usage.language === "en" ? "英文" : "自动"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
