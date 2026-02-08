import { useState } from 'react'
import { ChevronRight, ChevronDown, Plus } from 'lucide-react'
import { useTopicById, useSubTopicIdsByTopicId, useTopicProgress } from '@/store/selectors'
import { useStoreActions, useTopicManager } from '@/hooks/useStore'
import { useQuestionStore } from '@/store/useQuestionStore'
import { useToastStore } from '@/components/shared'
import Card, { CardHeader, CardBody } from '@/components/shared/Card'
import ActionButtons from '@/components/shared/ActionButtons'
import ProgressBar from '@/components/shared/ProgressBar'
import CircularProgress from '@/components/shared/CircularProgress'
import EditTopicModal from './EditTopicModal'
import AddSubTopicModal from '../subtopic/AddSubTopicModal'
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
import SortableSubTopic from '@/components/subtopic/SortableSubTopic'

interface TopicCardProps {
  topicId: string
  isExpanded?: boolean
  onToggleExpand?: () => void
}

export default function TopicCard({ topicId, isExpanded: controlledExpanded, onToggleExpand }: TopicCardProps) {
  const topic = useTopicById(topicId)
  const subTopicIds = useSubTopicIdsByTopicId(topicId)
  const progress = useTopicProgress(topicId)
  const { updateTopic, deleteTopic, reorderSubTopics } = useStoreActions()
  const { addSubTopic } = useTopicManager(topicId)
  const addToast = useToastStore((state) => state.addToast)
  
  const [localExpanded, setLocalExpanded] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const isExpanded = controlledExpanded ?? localExpanded
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = subTopicIds.indexOf(active.id as string)
      const newIndex = subTopicIds.indexOf(over.id as string)
      
      const newOrder = arrayMove(subTopicIds, oldIndex, newIndex)
      reorderSubTopics(topicId, newOrder)
    }
  }
  
  if (!topic) return null

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleSave = (name: string) => {
    updateTopic(topicId, { name })
    setShowEditModal(false)
  }
  
  const handleToggle = () => {
    if (onToggleExpand) {
      onToggleExpand()
    } else {
      setLocalExpanded(!localExpanded)
    }
  }
  
  const handleDelete = () => {
    // Capture state before deletion for undo
    const state = useQuestionStore.getState()
    const deletedTopic = state.topics[topicId]
    const deletedSubTopics: Record<string, any> = {}
    const deletedQuestions: Record<string, any> = {}
    const topicIndex = state.topicOrder.indexOf(topicId)
    
    // Capture all sub-topics and questions
    deletedTopic.subTopicIds.forEach((subTopicId: string) => {
      const subTopic = state.subTopics[subTopicId]
      if (subTopic) {
        deletedSubTopics[subTopicId] = { ...subTopic }
        subTopic.questionIds.forEach((questionId: string) => {
          const question = state.questions[questionId]
          if (question) {
            deletedQuestions[questionId] = { ...question }
          }
        })
      }
    })
    
    // Delete the topic
    deleteTopic(topicId)
    
    // Show undo toast
    addToast({
      message: `Deleted "${deletedTopic.name}"`,
      onUndo: () => {
        // Restore the topic
        useQuestionStore.setState((state) => {
          state.topics[topicId] = deletedTopic
          Object.assign(state.subTopics, deletedSubTopics)
          Object.assign(state.questions, deletedQuestions)
          state.topicOrder.splice(topicIndex, 0, topicId)
        })
      },
      duration: 5000
    })
  }
  
  return (
    <Card className="mb-4 p-5">
      <CardHeader className="cursor-pointer group" onClick={handleToggle}>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isExpanded ? (
            <ChevronDown size={20} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronRight size={20} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
          )}
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {topic.name}
          </h2>
        </div>
        
        {/* Circular progress when collapsed */}
        {!isExpanded && progress.total > 0 && (
          <CircularProgress
            current={progress.completed}
            total={progress.total}
            size={56}
          />
        )}
        
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowAddModal(true)
            }}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors opacity-0 group-hover:opacity-100"
            title="Add Subtopic"
          >
            <Plus size={16} />
          </button>
          <ActionButtons 
            onEdit={handleEdit}
            onDelete={handleDelete}
            confirmDelete
            deleteMessage={`Delete "${topic.name}"?`}
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardBody>
          {progress.total > 0 && (
            <div className="mb-4">
              <ProgressBar
                current={progress.completed}
                total={progress.total}
                size="md"
                variant="orange"
              />
            </div>
          )}
          
          {subTopicIds.length === 0 ? (
            <p className="text-sm font-normal text-gray-400 dark:text-gray-500 py-2 text-center">
              No subtopics
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={subTopicIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 ml-8">
                  {subTopicIds.map(subTopicId => (
                    <SortableSubTopic key={subTopicId} subTopicId={subTopicId} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardBody>
      )}

      {showEditModal && (
        <EditTopicModal
          currentName={topic.name}
          onSave={handleSave}
          onCancel={() => setShowEditModal(false)}
        />
      )}

      {showAddModal && (
        <AddSubTopicModal
          onAdd={(name) => {
            addSubTopic(name)
            setShowAddModal(false)
          }}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </Card>
  )
}
