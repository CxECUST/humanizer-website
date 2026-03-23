"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function QuotaPage() {
  const [quota, setQuota] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/user/quota")
      .then(r => r.json())
      .then(data => {
        if (data.success) setQuota(data.data)
      })
      .finally(() => setLoading(false))
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

  const getPlanColor = (type: string) => {
    const colors: Record<string, string> = {
      FREE: "bg-gray-100 text-gray-800",
      BASIC: "bg-blue-100 text-blue-800",
      PRO: "bg-purple-100 text-purple-800",
      ENTERPRISE: "bg-orange-100 text-orange-800",
    }
    return colors[type] || ""
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("zh-CN").format(num)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">额度管理</h1>
        <p className="text-gray-600 dark:text-gray-400">查看和管理您的字符额度</p>
      </div>

      <div className="grid gap-6">
        {/* Main Quota Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>当前额度</CardTitle>
                <CardDescription>本月可用字符数</CardDescription>
              </div>
              <Badge className={getPlanColor(quota?.planType)}>
                {getPlanTypeLabel(quota?.planType)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">使用进度</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {quota?.usagePercentage}%
                  </span>
                </div>
                <Progress value={quota?.usagePercentage || 0} />
              </div>

              {/* Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {formatNumber(quota?.remainingQuota || 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">剩余字符</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {formatNumber(quota?.usedQuota || 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">已用字符</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {formatNumber(quota?.totalQuota || 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">总额度</div>
                </div>
              </div>

              {/* Renewal Info */}
              {quota?.nextRenewalDate && (
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <div className="text-sm font-medium">额度重置日期</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(quota.nextRenewalDate).toLocaleDateString("zh-CN")}
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    升级套餐
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Usage Rules */}
        <Card>
          <CardHeader>
            <CardTitle>额度使用规则</CardTitle>
            <CardDescription>了解不同操作消耗的额度</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1x</span>
                </div>
                <div>
                  <div className="font-medium">人性化处理</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    每字符消耗 1 额度，最少 10 额度/次
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold">0.5x</span>
                </div>
                <div>
                  <div className="font-medium">AI 检测</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    每字符消耗 0.5 额度，最少 5 额度/次
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">0.3x</span>
                </div>
                <div>
                  <div className="font-medium">重复率检查</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    每字符消耗 0.3 额度，最少 3 额度/次
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade CTA */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">需要更多额度？</h3>
                <p className="text-blue-100">
                  升级到专业版，获得更多额度和高级功能
                </p>
              </div>
              <Button variant="secondary">
                查看套餐
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
