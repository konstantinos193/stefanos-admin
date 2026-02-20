'use client'

import { useState } from 'react'
import { X, BookOpen, Calendar, User, Clock, Tag } from 'lucide-react'
import { KnowledgeArticle } from '@/lib/api/knowledge'

interface ViewKnowledgeDialogProps {
  article: KnowledgeArticle
  onClose: () => void
}

export function ViewKnowledgeDialog({ article, onClose }: ViewKnowledgeDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Προβολή Άρθρου</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Title Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{article.titleGr}</h1>
            <h2 className="text-lg text-gray-600 mb-4">{article.titleEn}</h2>
            
            {/* Meta Information */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {article.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Δημιουργία: {new Date(article.createdAt).toLocaleDateString('el-GR')}
              </div>
              {article.readTime && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {article.readTime} λεπτά ανάγνωσης
                </div>
              )}
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Category */}
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500/15 text-blue-600">
                {article.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Greek Content */}
            {article.contentGr && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Περιεχόμενο (Ελληνικά)</h3>
                <div className="prose prose-gray max-w-none">
                  <div 
                    className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.contentGr.replace(/\n/g, '<br>') }}
                  />
                </div>
              </div>
            )}

            {/* English Content */}
            {article.contentEn && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Content (English)</h3>
                <div className="prose prose-gray max-w-none">
                  <div 
                    className="whitespace-pre-wrap text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.contentEn.replace(/\n/g, '<br>') }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Publication Status */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                {article.publishedAt ? (
                  <div className="flex items-center text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Δημοσιευμένο στις {new Date(article.publishedAt).toLocaleDateString('el-GR')}
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-600">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                    Πρόχειρο (μη δημοσιευμένο)
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Τελευταία ενημέρωση: {new Date(article.updatedAt).toLocaleDateString('el-GR')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
