import { useQuestionStore } from '@/store/useQuestionStore'
import {
  useTopics,
  useSubTopics,
  useQuestions,
  useCounts,
  useHasData,
} from '@/store/selectors'

/**
 * Custom hook that provides all store actions
 * Useful for forms and components that need to modify data
 */
export function useStoreActions() {
  const addTopic = useQuestionStore((state) => state.addTopic)
  const updateTopic = useQuestionStore((state) => state.updateTopic)
  const deleteTopic = useQuestionStore((state) => state.deleteTopic)
  const reorderTopics = useQuestionStore((state) => state.reorderTopics)

  const addSubTopic = useQuestionStore((state) => state.addSubTopic)
  const updateSubTopic = useQuestionStore((state) => state.updateSubTopic)
  const deleteSubTopic = useQuestionStore((state) => state.deleteSubTopic)
  const reorderSubTopics = useQuestionStore((state) => state.reorderSubTopics)

  const addQuestion = useQuestionStore((state) => state.addQuestion)
  const updateQuestion = useQuestionStore((state) => state.updateQuestion)
  const deleteQuestion = useQuestionStore((state) => state.deleteQuestion)
  const reorderQuestions = useQuestionStore((state) => state.reorderQuestions)
  const toggleQuestionCompletion = useQuestionStore((state) => state.toggleQuestionCompletion)

  const resetStore = useQuestionStore((state) => state.resetStore)

  return {
    // Topics
    addTopic,
    updateTopic,
    deleteTopic,
    reorderTopics,
    // SubTopics
    addSubTopic,
    updateSubTopic,
    deleteSubTopic,
    reorderSubTopics,
    // Questions
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    toggleQuestionCompletion,
    // Utility
    resetStore,
  }
}

/**
 * Hook for managing a specific topic
 * Provides all data and actions related to a single topic
 */
export function useTopicManager(topicId: string) {
  const topic = useQuestionStore((state) => state.topics[topicId])
  const subTopics = useSubTopics(topicId)
  const actions = useStoreActions()

  return {
    topic,
    subTopics,
    updateTopic: (name: string) => actions.updateTopic(topicId, { name }),
    deleteTopic: () => actions.deleteTopic(topicId),
    addSubTopic: (name: string) => actions.addSubTopic(topicId, name),
    reorderSubTopics: (newOrder: string[]) =>
      actions.reorderSubTopics(topicId, newOrder),
  }
}

/**
 * Hook for managing a specific sub-topic
 * Provides all data and actions related to a single sub-topic
 */
export function useSubTopicManager(subTopicId: string) {
  const subTopic = useQuestionStore((state) => state.subTopics[subTopicId])
  const questions = useQuestions(subTopicId)
  const actions = useStoreActions()

  return {
    subTopic,
    questions,
    updateSubTopic: (name: string) => actions.updateSubTopic(subTopicId, { name }),
    deleteSubTopic: () => actions.deleteSubTopic(subTopicId),
    addQuestion: (content: string, answer: string = '', difficulty: 'easy' | 'medium' | 'hard' = 'medium') =>
      actions.addQuestion(subTopicId, content, answer, difficulty),
    reorderQuestions: (newOrder: string[]) =>
      actions.reorderQuestions(subTopicId, newOrder),
  }
}

/**
 * Hook for managing a specific question
 * Provides data and actions related to a single question
 */
export function useQuestionManager(questionId: string) {
  const question = useQuestionStore((state) => state.questions[questionId])
  const actions = useStoreActions()

  return {
    question,
    updateQuestion: (updates: { content?: string; answer?: string; completed?: boolean }) =>
      actions.updateQuestion(questionId, updates),
    deleteQuestion: () => actions.deleteQuestion(questionId),
  }
}

/**
 * Hook for dashboard/overview statistics
 */
export function useDashboardStats() {
  const counts = useCounts()
  const hasData = useHasData()
  const topics = useTopics()

  return {
    counts,
    hasData,
    topics,
    isEmpty: !hasData,
  }
}
