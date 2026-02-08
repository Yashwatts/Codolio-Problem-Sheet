import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { TopicCard } from '@/components/topic'

interface SortableTopicProps {
  topicId: string
}

export default function SortableTopic({ topicId }: SortableTopicProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: topicId })

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
      <div className="relative group/topic">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-8 transition-all duration-100 cursor-grab active:cursor-grabbing p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#27272a] rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1"
          aria-label="Drag to reorder topic"
          tabIndex={0}
        >
          <GripVertical size={18} strokeWidth={2.5} />
        </button>
        
        <div className={isDragging ? 'shadow-lg ring-2 ring-orange-500 rounded-lg' : 'group-hover/topic:bg-gray-50/50 dark:group-hover/topic:bg-[#27272a]/30 rounded-lg'}>
          <TopicCard topicId={topicId} />
        </div>
      </div>
    </div>
  )
}
