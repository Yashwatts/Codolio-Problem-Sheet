/**
 * API Response Types for Codolio Question Tracker
 * These types match the backend API structure
 */

export interface ApiResponse {
  status: {
    code: number
    success: boolean
    message: string
    error: string | null
  }
  data: {
    sheet: SheetMetadata
    questions: ApiQuestion[]
  }
}

export interface SheetMetadata {
  config: {
    topicOrder: string[]
    subTopicOrder: Record<string, unknown>
    questionOrder: string[]
  }
  name: string
  description: string
  visibility: string
  followers: number
  tag: string[]
  createdAt: string
  updatedAt: string
  banner?: string
  // Other fields ignored for transformation
}

export interface ApiQuestion {
  _id: string
  sheetId: string
  questionId: QuestionDetails
  topic: string
  title: string
  subTopic: string | null
  resource: string | null
  session: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
  isSolved: boolean
  // Backend-only fields
  popularSheets?: unknown[]
  questionDocumentId?: unknown
  hotness?: number
  rank?: number
}

export interface QuestionDetails {
  _id: string
  slug: string
  id: string | number
  platform: string
  name: string
  problemUrl: string
  topics: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  verified: boolean
  createdAt: string
  updatedAt: string
  companyTags?: string[]
  similarQuestions?: string[]
  __v?: number
}
