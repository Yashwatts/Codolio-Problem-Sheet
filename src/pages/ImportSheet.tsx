import { useState } from 'react'
import { fetchAndLoadSheet, AVAILABLE_SHEETS } from '@/api/fetchSheet'
import { LoadingSpinner } from '@/components/shared'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { TransformedSheetData } from '@/utils/transformSheetData'

interface ImportSheetProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function ImportSheet({ onSuccess, onCancel }: ImportSheetProps) {
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importedData, setImportedData] = useState<TransformedSheetData | null>(null)
  const [showRawData, setShowRawData] = useState(false)

  const handleImport = async () => {
    if (!slug.trim()) {
      setError('Please enter a sheet slug')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await fetchAndLoadSheet(slug.trim(), true)
      setImportedData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import sheet')
    } finally {
      setLoading(false)
    }
  }

  const handleDone = () => {
    onSuccess()
  }

  // If data is imported, show success state
  if (importedData) {
    const topicCount = Object.keys(importedData.topics).length
    const subTopicCount = Object.keys(importedData.subTopics).length
    const questionCount = Object.keys(importedData.questions).length

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onCancel}>
        <div className="bg-white dark:bg-[#18181b] rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Imported</h2>
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{topicCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Topics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{subTopicCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Subtopics</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{questionCount}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Questions</div>
              </div>
            </div>

            {/* Sheet Info */}
            <div className="bg-gray-50 dark:bg-[#27272a] rounded-lg p-4 mb-4">
              <div className="text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Problem Sheet</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{importedData.metadata.sheetName}</span>
                </div>
                {importedData.metadata.sheetDescription && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {importedData.metadata.sheetDescription}
                  </div>
                )}
              </div>
            </div>

            {/* Raw Data Toggle */}
            <button
              onClick={() => setShowRawData(!showRawData)}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 mb-2"
            >
              {showRawData ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span>Data</span>
            </button>

            {showRawData && (
              <div className="bg-gray-900 dark:bg-[#0d0d0d] rounded-md p-4 overflow-x-auto">
                <pre className="text-xs text-gray-100 dark:text-gray-300 font-mono">
                  {JSON.stringify(importedData, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button
              onClick={handleDone}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Import form
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onCancel}>
      <div className="bg-white dark:bg-[#18181b] rounded-lg shadow-xl max-w-lg w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Import Problem Sheet</h2>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <label htmlFor="sheet-slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Problem Sheet
            </label>
            <input
              id="sheet-slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. striver-sde-sheet"
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#27272a] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-[#1a1a1d] disabled:text-gray-500 dark:disabled:text-gray-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading) {
                  handleImport()
                } else if (e.key === 'Escape') {
                  onCancel()
                }
              }}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">Examples</p>
            <div className="space-y-1">
              {Object.entries(AVAILABLE_SHEETS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSlug(value)}
                  disabled={loading}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#27272a] hover:bg-gray-100 dark:hover:bg-[#323237] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#27272a] border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-[#323237] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={loading || !slug.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && <LoadingSpinner size="sm" variant="white" />}
            {loading ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  )
}
