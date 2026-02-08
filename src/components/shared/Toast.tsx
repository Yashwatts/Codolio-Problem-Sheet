import { useEffect } from 'react'
import { X, Undo2 } from 'lucide-react'

export interface ToastProps {
  id: string
  message: string
  onUndo?: () => void
  onClose: () => void
  duration?: number
}

export default function Toast({ message, onUndo, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (!onUndo) {
      // If no undo, auto-close after duration
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    } else {
      // If undo available, auto-finalize after duration
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose, onUndo])

  return (
    <div
      className="flex items-center gap-3 bg-gray-900 dark:bg-[#18181b] text-white rounded-lg shadow-lg px-4 py-3 min-w-[320px] border border-gray-700 animate-slide-up"
    >
      <span className="flex-1 text-sm">{message}</span>
      
      {onUndo && (
        <button
          onClick={() => {
            onUndo()
            onClose()
          }}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-orange-400 hover:text-orange-300 hover:bg-orange-900/20 rounded transition-colors"
        >
          <Undo2 size={14} />
          Undo
        </button>
      )}
      
      <button
        onClick={onClose}
        className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  )
}
