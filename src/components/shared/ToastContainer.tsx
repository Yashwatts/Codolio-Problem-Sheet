import { create } from 'zustand'
import Toast from './Toast'

interface ToastItem {
  id: string
  message: string
  onUndo?: () => void
  duration?: number
}

interface ToastStore {
  toasts: ToastItem[]
  addToast: (toast: Omit<ToastItem, 'id'>) => string
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }]
    }))
    return id
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id)
    }))
  }
}))

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          onUndo={toast.onUndo}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  )
}
