/**
 * Core entity types for the question sheet application
 * Using normalized data structure for scalability and clean updates
 */

export interface Question {
  id: string
  content: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  completed: boolean
  createdAt: number
  updatedAt: number
}

export interface SubTopic {
  id: string
  name: string
  questionIds: string[]
  createdAt: number
  updatedAt: number
}

export interface Topic {
  id: string
  name: string
  subTopicIds: string[]
  createdAt: number
  updatedAt: number
}

/**
 * Normalized state structure
 * Entities stored as key-value maps for O(1) lookups
 * Order arrays maintain sequence
 */
export interface QuestionSheetState {
  // Entity maps (normalized)
  topics: Record<string, Topic>
  subTopics: Record<string, SubTopic>
  questions: Record<string, Question>

  // Order arrays (for consistent ordering)
  topicOrder: string[]

  // Actions - Topics
  addTopic: (name: string) => string
  updateTopic: (id: string, updates: Partial<Pick<Topic, 'name'>>) => void
  deleteTopic: (id: string) => void
  reorderTopics: (newOrder: string[]) => void

  // Actions - SubTopics
  addSubTopic: (topicId: string, name: string) => string
  updateSubTopic: (id: string, updates: Partial<Pick<SubTopic, 'name'>>) => void
  deleteSubTopic: (id: string) => void
  reorderSubTopics: (topicId: string, newOrder: string[]) => void

  // Actions - Questions
  addQuestion: (subTopicId: string, content: string, answer: string, difficulty?: 'easy' | 'medium' | 'hard') => string
  updateQuestion: (id: string, updates: Partial<Pick<Question, 'content' | 'answer' | 'completed' | 'difficulty'>>) => void
  deleteQuestion: (id: string) => void
  reorderQuestions: (subTopicId: string, newOrder: string[]) => void
  toggleQuestionCompletion: (id: string) => void

  // Utility
  resetStore: () => void
}

/**
 * Input types for creating entities
 */
export interface CreateTopicInput {
  name: string
}

export interface CreateSubTopicInput {
  name: string
  topicId: string
}

export interface CreateQuestionInput {
  content: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  subTopicId: string
}
