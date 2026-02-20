'use client'

import { useEffect, useState } from 'react'
import { Edit, Trash2, Eye, BookOpen, Calendar, User, Clock, CheckCircle, FileText } from 'lucide-react'
import { knowledgeApi, KnowledgeQueryParams } from '@/lib/api/knowledge'
import { KnowledgeArticle } from '@/lib/api/knowledge'
import { EditKnowledgeDialog } from './EditKnowledgeDialog'
import { DeleteKnowledgeDialog } from './DeleteKnowledgeDialog'
import { ViewKnowledgeDialog } from './ViewKnowledgeDialog'

interface KnowledgeTableProps {
  filters: KnowledgeQueryParams
}

export function KnowledgeTable({ filters }: KnowledgeTableProps) {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [editArticle, setEditArticle] = useState<KnowledgeArticle | null>(null)
  const [deleteArticle, setDeleteArticle] = useState<KnowledgeArticle | null>(null)
  const [viewArticle, setViewArticle] = useState<KnowledgeArticle | null>(null)

  useEffect(() => {
    fetchArticles()
  }, [filters])

  async function fetchArticles() {
    try {
      setLoading(true)
      const response = await knowledgeApi.getAll({ limit: 50, ...filters })
      setArticles(response.data?.articles || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (article: KnowledgeArticle) => {
    try {
      await knowledgeApi.publish(article.id)
      fetchArticles()
    } catch (error) {
      console.error('Error publishing article:', error)
    }
  }

  const getStatusBadge = (article: KnowledgeArticle) => {
    if (article.publishedAt) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/15 text-green-400">
          <CheckCircle className="h-3 w-3 mr-1" />
          Δημοσιευμένο
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/15 text-yellow-400">
        <FileText className="h-3 w-3 mr-1" />
        Πρόχειρο
      </span>
    )
  }

  if (loading) {
    return (
      <div className="card">
        <div className="p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="card">
        <div className="p-8 text-center text-gray-500">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Δεν βρέθηκαν άρθρα βάσης γνώσης</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left p-4 font-medium text-gray-900">Τίτλος</th>
                <th className="text-left p-4 font-medium text-gray-900">Κατηγορία</th>
                <th className="text-left p-4 font-medium text-gray-900">Συγγραφέας</th>
                <th className="text-left p-4 font-medium text-gray-900">Κατάσταση</th>
                <th className="text-left p-4 font-medium text-gray-900">Ενημερώθηκε</th>
                <th className="text-left p-4 font-medium text-gray-900">Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{article.titleGr}</div>
                      <div className="text-sm text-gray-500">{article.titleEn}</div>
                      {article.readTime && (
                        <div className="flex items-center text-xs text-gray-400 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {article.readTime} λεπτά
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/15 text-blue-400">
                      {article.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-gray-900">
                      <User className="h-4 w-4 mr-2 text-gray-400" />
                      {article.author}
                    </div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(article)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(article.updatedAt).toLocaleDateString('el-GR')}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewArticle(article)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Προβολή"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditArticle(article)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Επεξεργασία"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {!article.publishedAt && (
                        <button
                          onClick={() => handlePublish(article)}
                          className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                          title="Δημοσίευση"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteArticle(article)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Διαγραφή"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {viewArticle && (
        <ViewKnowledgeDialog
          article={viewArticle}
          onClose={() => setViewArticle(null)}
        />
      )}

      {editArticle && (
        <EditKnowledgeDialog
          article={editArticle}
          onClose={() => setEditArticle(null)}
          onSuccess={fetchArticles}
        />
      )}

      {deleteArticle && (
        <DeleteKnowledgeDialog
          article={deleteArticle}
          onClose={() => setDeleteArticle(null)}
          onSuccess={fetchArticles}
        />
      )}
    </>
  )
}
