import { useState } from 'react'
import { Download, Sun, Moon, Plus } from 'lucide-react'
import TopicList from './components/topic/TopicList'
import ImportSheet from './pages/ImportSheet'
import AddTopicModal from './components/topic/AddTopicModal'
import { useTheme } from './hooks'
import { useOverallProgress, useCounts } from './store/selectors'
import { useStoreActions } from './hooks/useStore'

function App() {
  const [showImport, setShowImport] = useState(false)
  const [showAddTopic, setShowAddTopic] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { completed, total } = useOverallProgress()
  const { topics } = useCounts()
  const { addTopic } = useStoreActions()

  const handleAddTopic = (name: string) => {
    addTopic(name)
    setShowAddTopic(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111010]">
      {/* Header */}
      <header className="bg-white dark:bg-[#18181b] border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Problem Sheet
              </h1>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {completed}/{total} questions · {topics} {topics === 1 ? 'topic' : 'topics'}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddTopic(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md"
                aria-label="Add topic"
              >
                <Plus size={16} />
                <span>Topic</span>
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#27272a] rounded-md focus:outline-none"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              
              <button
                onClick={() => setShowImport(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-[#27272a] rounded-md"
                aria-label="Import sheet"
              >
                <Download size={16} />
                <span>Import</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        <TopicList />
      </main>

      {/* Import Modal */}
      {showImport && (
        <ImportSheet
          onSuccess={() => setShowImport(false)}
          onCancel={() => setShowImport(false)}
        />
      )}

      {/* Add Topic Modal */}
      {showAddTopic && (
        <AddTopicModal
          onAdd={handleAddTopic}
          onCancel={() => setShowAddTopic(false)}
        />
      )}
    </div>
  )
}

export default App
