import { useEffect, useState } from "react"
import { Search, MoreHorizontal, Eye, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getInquiries, updateInquiry, Inquiry } from "@/api/contact"
import { useToast } from "@/hooks/useToast"

const statusOptions = ['All', 'New', 'In Progress', 'Responded', 'Closed']
const priorityOptions = ['All', 'Low', 'Medium', 'High']

export function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        console.log('Fetching inquiries...')
        const response = await getInquiries() as { inquiries: Inquiry[] }
        setInquiries(response.inquiries)
        setFilteredInquiries(response.inquiries)
      } catch (error) {
        console.error('Error fetching inquiries:', error)
        toast({
          title: "Error",
          description: "Failed to load inquiries",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInquiries()
  }, [toast])

  useEffect(() => {
    let filtered = inquiries

    if (statusFilter !== 'All') {
      filtered = filtered.filter(inquiry => inquiry.status === statusFilter)
    }

    if (priorityFilter !== 'All') {
      filtered = filtered.filter(inquiry => inquiry.priority === priorityFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(inquiry =>
        inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.jobDetails.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredInquiries(filtered)
  }, [inquiries, statusFilter, priorityFilter, searchTerm])

  const handleUpdateInquiry = async (id: string, updates: { status?: string; priority?: string; notes?: string }) => {
    setUpdating(true)
    try {
      console.log('Updating inquiry:', id, updates)
      const response = await updateInquiry(id, updates) as { success: boolean; message: string }

      if (response.success) {
        // Update local state
        setInquiries(prev => prev.map(inquiry => {
          if (inquiry._id !== id) return inquiry
          return {
            ...inquiry,
            status: (updates.status as Inquiry["status"]) || inquiry.status,
            priority: (updates.priority as Inquiry["priority"]) || inquiry.priority,
            notes: updates.notes ? [...(inquiry.notes || []), updates.notes] : inquiry.notes
          }
        }))
        
        toast({
          title: "Success",
          description: response.message,
        })
        setSelectedInquiry(null)
      }
    } catch (error) {
      console.error('Error updating inquiry:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update inquiry",
        variant: "destructive",
      })
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Responded': return 'bg-green-100 text-green-800'
      case 'Closed': return 'bg-slate-100 text-slate-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'Low': return 'bg-green-100 text-green-800'
      default: return 'bg-slate-100 text-slate-800'
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-96 animate-pulse"></div>
        </div>
        <div className="honey-panel p-6 animate-pulse">
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Inquiries</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Manage customer inquiries and track their progress.
        </p>
      </div>

      {/* Filters */}
      <Card className="honey-panel border-0">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search inquiries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inquiries Table */}
      <Card className="honey-panel border-0">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">
            All Inquiries ({filteredInquiries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInquiries.map((inquiry) => (
                  <TableRow key={inquiry._id}>
                    <TableCell className="font-medium">{inquiry.name}</TableCell>
                    <TableCell>{inquiry.company || '-'}</TableCell>
                    <TableCell>{inquiry.email}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(inquiry.status)}>
                        {inquiry.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadgeColor(inquiry.priority)}>
                        {inquiry.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(inquiry.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedInquiry(inquiry)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateInquiry(inquiry._id, { status: 'In Progress' })}>
                            <Edit className="mr-2 h-4 w-4" />
                            Mark In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateInquiry(inquiry._id, { status: 'Responded' })}>
                            <Edit className="mr-2 h-4 w-4" />
                            Mark Responded
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInquiries.length === 0 && (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-300">
                No inquiries found matching your criteria.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inquiry Detail Modal */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-2xl bg-white dark:bg-slate-800">
          {selectedInquiry && (
            <>
              <DialogHeader>
                <DialogTitle>Inquiry Details</DialogTitle>
                <DialogDescription>
                  Submitted on {new Date(selectedInquiry.submittedAt).toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Name</Label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email</Label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Phone</Label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.phone || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Company</Label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.company || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Country</Label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.country || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Job Title</Label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.jobTitle || '-'}</p>
                  </div>
                </div>

                {/* Project Details */}
                <div>
                  <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Project Details</Label>
                  <p className="text-slate-900 dark:text-white mt-1">{selectedInquiry.jobDetails}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Budget</Label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.budget || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Timeline</Label>
                    <p className="text-slate-900 dark:text-white">{selectedInquiry.timeline || '-'}</p>
                  </div>
                </div>

                {/* Status and Priority */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</Label>
                    <Select
                      value={selectedInquiry.status}
                      onValueChange={(value) => handleUpdateInquiry(selectedInquiry._id, { status: value })}
                      disabled={updating}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="New">New</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Responded">Responded</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Priority</Label>
                    <Select
                      value={selectedInquiry.priority}
                      onValueChange={(value) => handleUpdateInquiry(selectedInquiry._id, { priority: value })}
                      disabled={updating}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Notes */}
                {selectedInquiry.notes && selectedInquiry.notes.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Notes</Label>
                    <div className="mt-1 space-y-2">
                      {selectedInquiry.notes.map((note, index) => (
                        <div key={index} className="bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                          <p className="text-sm text-slate-900 dark:text-white">{note}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Note */}
                <div>
                  <Label className="text-sm font-medium text-slate-600 dark:text-slate-400">Add Note</Label>
                  <Textarea
                    placeholder="Add a note about this inquiry..."
                    className="mt-1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        const textarea = e.target as HTMLTextAreaElement
                        if (textarea.value.trim()) {
                          handleUpdateInquiry(selectedInquiry._id, { notes: textarea.value.trim() })
                          textarea.value = ''
                        }
                      }
                    }}
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Press Ctrl+Enter to save note
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}