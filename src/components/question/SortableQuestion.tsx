import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { QuestionItem } from '@/components/question'

interface SortableQuestionProps {
  questionId: string
  index?: number
}

export default function SortableQuestion({ questionId, index }: SortableQuestionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: questionId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 100ms ease',
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={isDragging ? 'relative z-50' : 'relative'}
    >
      <div className="relative group/question">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-7 opacity-0 group-hover/question:opacity-100 transition-all duration-100 cursor-grab active:cursor-grabbing p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#27272a] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
          aria-label="Drag to reorder question"
          tabIndex={0}
        >
          <GripVertical size={16} strokeWidth={2.5} />
        </button>
        
        <div className={isDragging ? 'bg-white dark:bg-[#18181b] shadow-md ring-1 ring-orange-300 rounded-md' : 'group-hover/question:bg-gray-50/50 dark:group-hover/question:bg-[#27272a]/30 rounded-md'}>
          <QuestionItem questionId={questionId} index={index} />
        </div>
      </div>
    </div>
  )
}
