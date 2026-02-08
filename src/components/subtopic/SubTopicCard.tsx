import { useState } from 'react'
import { ChevronRight, ChevronDown, Plus } from 'lucide-react'
import { useSubTopicById, useQuestionIdsBySubTopicId, useSubTopicProgress } from '@/store/selectors'
import { useStoreActions, useSubTopicManager } from '@/hooks/useStore'
import Card, { CardHeader, CardBody } from '@/components/shared/Card'
import ActionButtons from '@/components/shared/ActionButtons'
import ProgressBar from '@/components/shared/ProgressBar'
import EditSubTopicModal from './EditSubTopicModal'
import AddQuestionModal from '../question/AddQuestionModal'
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
import SortableQuestion from '@/components/question/SortableQuestion'

interface SubTopicCardProps {
  subTopicId: string
  isExpanded?: boolean
}

export default function SubTopicCard({ subTopicId, isExpanded: controlledExpanded }: SubTopicCardProps) {
  const subTopic = useSubTopicById(subTopicId)
  const questionIds = useQuestionIdsBySubTopicId(subTopicId)
  const progress = useSubTopicProgress(subTopicId)
  const { updateSubTopic, deleteSubTopic, reorderQuestions } = useStoreActions()
  const { addQuestion } = useSubTopicManager(subTopicId)
  
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
      const oldIndex = questionIds.indexOf(active.id as string)
      const newIndex = questionIds.indexOf(over.id as string)
      
      const newOrder = arrayMove(questionIds, oldIndex, newIndex)
      reorderQuestions(subTopicId, newOrder)
    }
  }
  
  if (!subTopic) return null

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleSave = (name: string) => {
    updateSubTopic(subTopicId, { name })
    setShowEditModal(false)
  }
  
  const toggleExpand = () => {
    setLocalExpanded(!localExpanded)
  }
  
  return (
    <Card variant="nested" className="mb-3 p-4">
      <CardHeader className="cursor-pointer group" onClick={toggleExpand}>
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {isExpanded ? (
            <ChevronDown size={16} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
          ) : (
            <ChevronRight size={16} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
          )}
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 truncate">
            {subTopic.name}
          </h3>
        </div>
        
        {/* Progress when collapsed */}
        {!isExpanded && progress.total > 0 && (
          <div className="w-44 mr-4">
            <ProgressBar
              current={progress.completed}
              total={progress.total}
              size="sm"
              variant="orange"
              showPercentage={false}
            />
          </div>
        )}
        
        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowAddModal(true)
            }}
            className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors opacity-0 group-hover:opacity-100"
            title="Add Question"
          >
            <Plus size={14} />
          </button>
          <ActionButtons 
            onEdit={handleEdit}
            onDelete={() => deleteSubTopic(subTopicId)}
            confirmDelete
            deleteMessage={`Delete "${subTopic.name}"?`}
          />
        </div>
      </CardHeader>

      {isExpanded && (
        <CardBody>
          {questionIds.length === 0 ? (
            <p className="text-sm font-normal text-gray-400 dark:text-gray-500 py-2 text-center">
              No questions
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={questionIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2 ml-7">
                  {questionIds.map((qId, index) => (
                    <SortableQuestion key={qId} questionId={qId} index={index + 1} />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardBody>
      )}

      {showEditModal && (
        <EditSubTopicModal
          currentName={subTopic.name}
          onSave={handleSave}
          onCancel={() => setShowEditModal(false)}
        />
      )}

      {showAddModal && (
        <AddQuestionModal
          onAdd={(content, link, difficulty) => {
            addQuestion(content, link, difficulty)
            setShowAddModal(false)
          }}
          onCancel={() => setShowAddModal(false)}
        />
      )}
    </Card>
  )
}
