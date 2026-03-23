import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect("/signin")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">Humanizer</h1>
          <div className="flex items-center gap-4">
            <a href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
              Dashboard
            </a>
            <a href="/dashboard/quota" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
              额度
            </a>
            <a href="/dashboard/usage" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
              使用记录
            </a>
            <form action="/api/auth/signout" method="POST">
              <button type="submit" className="text-gray-600 hover:text-gray-900 dark:text-gray-300">
                退出
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
