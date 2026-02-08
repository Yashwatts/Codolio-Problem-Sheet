import { useState } from 'react'
import { ExternalLink, Check } from 'lucide-react'
import { useQuestionById } from '@/store/selectors'
import { useStoreActions } from '@/hooks/useStore'
import { useQuestionStore } from '@/store/useQuestionStore'
import { useToastStore } from '@/components/shared'
import ActionButtons from '@/components/shared/ActionButtons'
import EditQuestionModal from './EditQuestionModal'

interface QuestionItemProps {
  questionId: string
  index?: number // Optional question number to display
}

export default function QuestionItem({ questionId, index }: QuestionItemProps) {
  const question = useQuestionById(questionId)
  const { updateQuestion, deleteQuestion, toggleQuestionCompletion } = useStoreActions()
  const addToast = useToastStore((state) => state.addToast)
  const [showEditModal, setShowEditModal] = useState(false)
  
  if (!question) return null

  const handleEdit = () => {
    setShowEditModal(true)
  }

  const handleSave = (content: string, link: string, difficulty: 'easy' | 'medium' | 'hard') => {
    updateQuestion(questionId, { content, answer: link, difficulty })
    setShowEditModal(false)
  }
  
  const handleDelete = () => {
    // Capture state before deletion for undo
    const state = useQuestionStore.getState()
    const deletedQuestion = { ...state.questions[questionId] }
    let parentSubTopicId: string | null = null
    let questionIndex = -1
    
    // Find parent subtopic and index
    Object.values(state.subTopics).forEach((subTopic) => {
      const idx = subTopic.questionIds.indexOf(questionId)
      if (idx !== -1) {
        parentSubTopicId = subTopic.id
        questionIndex = idx
      }
    })
    
    // Delete the question
    deleteQuestion(questionId)
    
    // Show undo toast
    addToast({
      message: `Deleted "${deletedQuestion.content}"`,
      onUndo: () => {
        // Restore the question
        useQuestionStore.setState((state) => {
          state.questions[questionId] = deletedQuestion
          if (parentSubTopicId && questionIndex !== -1) {
            state.subTopics[parentSubTopicId].questionIds.splice(questionIndex, 0, questionId)
          }
        })
      },
      duration: 5000
    })
  }
  
  const difficultyColors = {
    easy: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    medium: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
    hard: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
  }
  
  return (
    <div 
      className="flex items-start gap-2 py-2.5 px-3 rounded-md group hover:bg-gray-50 dark:hover:bg-[#27272a]/50"
    >
      {/* Question number */}
      {index !== undefined && (
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex-shrink-0 w-6 text-left mt-0.5">
          {index}
        </span>
      )}
      
      {/* Completion checkbox */}
      <button
        onClick={() => toggleQuestionCompletion(questionId)}
        className="flex items-center justify-center mt-0.5 w-5 h-5 rounded-full border-2 transition-all cursor-pointer flex-shrink-0 bg-transparent"
        style={{
          borderColor: question.completed ? '#10b981' : '#d1d5db',
        }}
        aria-label={`Mark "${question.content}" as ${question.completed ? 'incomplete' : 'complete'}`}
      >
        {question.completed && (
          <Check size={12} strokeWidth={3} className="text-green-500" />
        )}
      </button>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className={question.completed ? 'opacity-50 transition-opacity duration-150 w-fit line-through' : 'transition-opacity duration-150 w-fit'}>
            <span className="text-sm text-gray-900 dark:text-gray-100">
              {question.content}
            </span>
          </div>
          
          {/* Difficulty badge */}
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColors[question.difficulty]}`}>
            {question.difficulty}
          </span>
        </div>
        
        {question.answer && (
          <a 
            href={question.answer}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 mt-1.5 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={12} strokeWidth={2.5} />
            <span>View</span>
          </a>
        )}
      </div>
      
      <div onClick={(e) => e.stopPropagation()}>
        <ActionButtons 
          onEdit={handleEdit}
          onDelete={handleDelete}
          confirmDelete
          deleteMessage={`Delete "${question.content}"?`}
          size="sm"
        />
      </div>

      {showEditModal && (
        <EditQuestionModal
          currentContent={question.content}
          currentLink={question.answer || ''}
          currentDifficulty={question.difficulty}
          onSave={handleSave}
          onCancel={() => setShowEditModal(false)}
        />
      )}
    </div>
  )
}
