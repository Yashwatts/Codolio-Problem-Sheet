import type { Topic, SubTopic, Question } from '@/types/store'
import { useQuestionStore } from '@/store/useQuestionStore'

/**
 * Helper functions for working with the normalized store
 * These selectors help retrieve related entities efficiently
 */

/**
 * Get all topics in display order
 */
export const useTopics = (): Topic[] => {
  return useQuestionStore((state) =>
    state.topicOrder.map((id) => state.topics[id]).filter(Boolean)
  )
}

/**
 * Get a single topic by ID
 */
export const useTopic = (topicId: string): Topic | undefined => {
  return useQuestionStore((state) => state.topics[topicId])
}

/**
 * Get all sub-topics for a topic in order
 */
export const useSubTopics = (topicId: string): SubTopic[] => {
  return useQuestionStore((state) => {
    const topic = state.topics[topicId]
    if (!topic) return []

    return topic.subTopicIds
      .map((id) => state.subTopics[id])
      .filter(Boolean)
  })
}

/**
 * Get a single sub-topic by ID
 */
export const useSubTopic = (subTopicId: string): SubTopic | undefined => {
  return useQuestionStore((state) => state.subTopics[subTopicId])
}

/**
 * Get all questions for a sub-topic in order
 */
export const useQuestions = (subTopicId: string): Question[] => {
  return useQuestionStore((state) => {
    const subTopic = state.subTopics[subTopicId]
    if (!subTopic) return []

    return subTopic.questionIds
      .map((id) => state.questions[id])
      .filter(Boolean)
  })
}

/**
 * Get a single question by ID
 */
export const useQuestion = (questionId: string): Question | undefined => {
  return useQuestionStore((state) => state.questions[questionId])
}

/**
 * Get full topic with nested sub-topics and questions (denormalized view)
 * Useful for displaying hierarchical data
 */
export const useTopicWithChildren = (topicId: string) => {
  return useQuestionStore((state) => {
    const topic = state.topics[topicId]
    if (!topic) return null

    const subTopics = topic.subTopicIds.map((subTopicId) => {
      const subTopic = state.subTopics[subTopicId]
      if (!subTopic) return null

      const questions = subTopic.questionIds
        .map((questionId) => state.questions[questionId])
        .filter(Boolean)

      return {
        ...subTopic,
        questions,
      }
    }).filter(Boolean)

    return {
      ...topic,
      subTopics,
    }
  })
}

/**
 * Get total counts for statistics
 */
export const useCounts = () => {
  return useQuestionStore((state) => ({
    topics: Object.keys(state.topics).length,
    subTopics: Object.keys(state.subTopics).length,
    questions: Object.keys(state.questions).length,
  }))
}

/**
 * Check if store has any data
 */
export const useHasData = (): boolean => {
  return useQuestionStore((state) => state.topicOrder.length > 0)
}

/**
 * Find parent topic for a sub-topic
 */
export const useParentTopic = (subTopicId: string): Topic | undefined => {
  return useQuestionStore((state) => {
    const topic = Object.values(state.topics).find((t) =>
      t.subTopicIds.includes(subTopicId)
    )
    return topic
  })
}

/**
 * Find parent sub-topic for a question
 */
export const useParentSubTopic = (questionId: string): SubTopic | undefined => {
  return useQuestionStore((state) => {
    const subTopic = Object.values(state.subTopics).find((st) =>
      st.questionIds.includes(questionId)
    )
    return subTopic
  })
}

/**
 * Search questions by content
 */
export const useSearchQuestions = (searchTerm: string): Question[] => {
  return useQuestionStore((state) => {
    if (!searchTerm.trim()) return []

    const term = searchTerm.toLowerCase()
    return Object.values(state.questions).filter(
      (q) =>
        q.content.toLowerCase().includes(term) ||
        q.answer.toLowerCase().includes(term)
    )
  })
}

/**
 * Calculate progress for a sub-topic
 * Returns { completed, total, percentage }
 */
export const useSubTopicProgress = (subTopicId: string) => {
  return useQuestionStore((state) => {
    const subTopic = state.subTopics[subTopicId]
    if (!subTopic) return { completed: 0, total: 0, percentage: 0 }

    const questions = subTopic.questionIds
      .map((id) => state.questions[id])
      .filter(Boolean)

    const total = questions.length
    const completed = questions.filter((q) => q.completed).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { completed, total, percentage }
  })
}

/**
 * Calculate progress for a topic (across all sub-topics)
 * Returns { completed, total, percentage }
 */
export const useTopicProgress = (topicId: string) => {
  return useQuestionStore((state) => {
    const topic = state.topics[topicId]
    if (!topic) return { completed: 0, total: 0, percentage: 0 }

    let total = 0
    let completed = 0

    topic.subTopicIds.forEach((subTopicId) => {
      const subTopic = state.subTopics[subTopicId]
      if (!subTopic) return

      const questions = subTopic.questionIds
        .map((id) => state.questions[id])
        .filter(Boolean)

      total += questions.length
      completed += questions.filter((q) => q.completed).length
    })

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { completed, total, percentage }
  })
}

/**
 * Calculate overall progress across all topics
 * Returns { completed, total, percentage }
 */
export const useOverallProgress = () => {
  return useQuestionStore((state) => {
    const questions = Object.values(state.questions)
    const total = questions.length
    const completed = questions.filter((q) => q.completed).length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return { completed, total, percentage }
  })
}

/**
 * Convenience selectors for use in components
 */
export const useTopicById = (topicId: string) => useTopic(topicId)
export const useSubTopicById = (subTopicId: string) => useSubTopic(subTopicId)
export const useQuestionById = (questionId: string) => useQuestion(questionId)
export const useTopicOrder = () => useQuestionStore((state) => state.topicOrder)
export const useSubTopicIdsByTopicId = (topicId: string) =>
  useQuestionStore((state) => state.topics[topicId]?.subTopicIds || [])
export const useQuestionIdsBySubTopicId = (subTopicId: string) =>
  useQuestionStore((state) => state.subTopics[subTopicId]?.questionIds || [])

