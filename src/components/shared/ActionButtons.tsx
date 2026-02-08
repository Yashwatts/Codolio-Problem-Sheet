import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'

interface ActionButtonsProps {
  onEdit?: () => void
  onDelete?: () => void
  confirmDelete?: boolean
  deleteMessage?: string
  size?: 'sm' | 'md'
}

export default function ActionButtons({ 
  onEdit,
  onDelete,
  confirmDelete = false,
  deleteMessage = 'Delete?',
  size = 'sm'
}: ActionButtonsProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirmDelete) {
      setShowConfirm(true)
    } else {
      onDelete?.()
    }
  }
  
  const confirmDeleteAction = () => {
    onDelete?.()
    setShowConfirm(false)
  }
  
  return (
    <>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
        {onEdit && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit()
            }}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            title="Edit"
          >
            <Pencil size={size === 'sm' ? 14 : 16} />
          </button>
        )}
        
        {onDelete && (
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete"
          >
            <Trash2 size={size === 'sm' ? 14 : 16} />
          </button>
        )}
      </div>
      
      {showConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowConfirm(false)}
        >
          <div 
            className="bg-white dark:bg-[#18181b] rounded-lg p-6 max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-gray-900 dark:text-gray-100 font-medium mb-6">{deleteMessage}</p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#27272a] border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-[#323237]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAction}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 dark:bg-red-700 rounded-md hover:bg-red-700 dark:hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
