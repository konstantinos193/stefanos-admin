'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Search, Filter, Calendar, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { cleaningApi } from '@/lib/api/cleaning'
import { CleaningSchedule } from '@/lib/api/types'

interface CleaningTableProps {
  schedules: CleaningSchedule[]
  loading: boolean
  onEdit: (schedule: CleaningSchedule) => void
  onDelete: (schedule: CleaningSchedule) => Promise<void>
  onMarkCleaned: (schedule: CleaningSchedule) => Promise<void>
}

export function CleaningTable({ schedules, loading, onEdit, onDelete, onMarkCleaned }: CleaningTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'overdue':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'DAILY':
        return 'bg-blue-100 text-blue-800'
      case 'WEEKLY':
        return 'bg-green-100 text-green-800'
      case 'MONTHLY':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.property?.titleGr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.property?.address.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Καθαριότητα Δωματίων</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Αναζήτηση δωματίου..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-[250px]"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Φίλτρα
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ακίνητο</TableHead>
              <TableHead>Συχνότητα</TableHead>
              <TableHead>Υπεύθυνος Καθαρισμού</TableHead>
              <TableHead>Τελευταίος Καθαρισμός</TableHead>
              <TableHead>Επόμενος Καθαρισμός</TableHead>
              <TableHead>Σημειώσεις</TableHead>
              <TableHead>Ενέργειες</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSchedules.map((schedule) => (
              <TableRow key={schedule.id}>
                <TableCell className="font-medium">
                  {schedule.property?.titleGr || 'N/A'}
                  <div className="text-sm text-muted-foreground">
                    {schedule.property?.address}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getFrequencyColor(schedule.frequency)}>
                    {schedule.frequency === 'DAILY' ? 'Ημερήσια' :
                     schedule.frequency === 'WEEKLY' ? 'Εβδομαδιαία' :
                     schedule.frequency === 'BIWEEKLY' ? 'Δύφωνη' :
                     schedule.frequency === 'MONTHLY' ? 'Μηνιαία' :
                     schedule.frequency === 'AFTER_EACH_BOOKING' ? 'Μετά από κάθε κράτηση' :
                     schedule.frequency}
                  </Badge>
                </TableCell>
                <TableCell>{schedule.assignedCleaner || '-'}</TableCell>
                <TableCell>
                  {schedule.lastCleaned ? 
                    new Date(schedule.lastCleaned).toLocaleDateString('el-GR') : 
                    '-'
                  }
                </TableCell>
                <TableCell>
                  {schedule.nextCleaning ? 
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(schedule.nextCleaning).toLocaleDateString('el-GR')}</span>
                    </div> : 
                    '-'
                  }
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  {schedule.notes || '-'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(schedule)}>
                      Επεξεργασία
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}