import { useEffect, useState } from "react"
import { Users, MessageSquare, TrendingUp, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAnalytics, AnalyticsData } from "@/api/analytics"
import { getInquiries, Inquiry } from "@/api/contact"
import { useToast } from "@/hooks/useToast"

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching dashboard data...')
        const [analyticsResponse, inquiriesResponse] = await Promise.all([
          getAnalytics() as Promise<{ analytics: AnalyticsData }>,
          getInquiries() as Promise<{ inquiries: Inquiry[] }>
        ])

        setAnalytics(analyticsResponse.analytics)
        setRecentInquiries(inquiriesResponse.inquiries.slice(0, 5))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-96 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="honey-panel p-6 animate-pulse">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600 dark:text-slate-300">Failed to load dashboard data</p>
      </div>
    )
  }

  const metrics = [
    {
      title: "Total Inquiries",
      value: analytics.totalInquiries,
      change: "+12%",
      changeType: "positive" as const,
      icon: MessageSquare,
      description: "All time inquiries"
    },
    {
      title: "New This Week",
      value: analytics.newInquiriesThisWeek,
      change: "+8%",
      changeType: "positive" as const,
      icon: Clock,
      description: "This week vs last week"
    },
    {
      title: "Response Rate",
      value: `${analytics.responseRate}%`,
      change: "+2%",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Average response rate"
    },
    {
      title: "Active Clients",
      value: 45,
      change: "-3%",
      changeType: "negative" as const,
      icon: Users,
      description: "Currently active projects"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Welcome back! Here's what's happening with your business today.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="honey-panel border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {metric.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                  {metric.value}
                </div>
                <div className="flex items-center text-xs">
                  {metric.changeType === 'positive' ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                    {metric.change}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 ml-1">
                    {metric.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <Card className="honey-panel border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Recent Inquiries
            </CardTitle>
            <CardDescription>
              Latest customer inquiries and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <div key={inquiry._id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {inquiry.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {inquiry.company} • {inquiry.email}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 line-clamp-1">
                      {inquiry.jobDetails}
                    </p>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge
                      variant={
                        inquiry.status === 'New' ? 'default' :
                        inquiry.status === 'In Progress' ? 'secondary' :
                        inquiry.status === 'Responded' ? 'outline' : 'secondary'
                      }
                      className={
                        inquiry.status === 'New' ? 'bg-blue-100 text-blue-800' :
                        inquiry.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        inquiry.status === 'Responded' ? 'bg-green-100 text-green-800' :
                        'bg-slate-100 text-slate-800'
                      }
                    >
                      {inquiry.status}
                    </Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(inquiry.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Services */}
        <Card className="honey-panel border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
              Popular Services
            </CardTitle>
            <CardDescription>
              Most requested services this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.popularServices.map((service, index) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      {service.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                        style={{ width: `${(service.count / analytics.popularServices[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 w-8">
                      {service.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}