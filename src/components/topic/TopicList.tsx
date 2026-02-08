import { useTopicOrder } from '@/store/selectors'
import { useStoreActions } from '@/hooks/useStore'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import SortableTopic from './SortableTopic'

export default function TopicList() {
  const topicIds = useTopicOrder()
  const { reorderTopics } = useStoreActions()
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = topicIds.indexOf(active.id as string)
      const newIndex = topicIds.indexOf(over.id as string)
      
      const newOrder = arrayMove(topicIds, oldIndex, newIndex)
      reorderTopics(newOrder)
    }
  }
  
  return (
    <div>
      {topicIds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-3">Get started by adding your first topic</p>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={topicIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-4">
              {topicIds.map(topicId => (
                <SortableTopic key={topicId} topicId={topicId} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
