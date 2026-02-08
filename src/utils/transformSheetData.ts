import type { ApiResponse, ApiQuestion } from '@/types/api'
import type { Topic, SubTopic, Question } from '@/types/store'

/**
 * Transformation result containing normalized data ready for the store
 */
export interface TransformedSheetData {
  topics: Record<string, Topic>
  subTopics: Record<string, SubTopic>
  questions: Record<string, Question>
  topicOrder: string[]
  metadata: {
    sheetName: string
    sheetDescription: string
    totalQuestions: number
    totalTopics: number
    totalSubTopics: number
  }
}

/**
 * Default sub-topic name for questions without a sub-topic
 */
const DEFAULT_SUBTOPIC = 'General'

/**
 * Generate a stable, unique ID for a topic
 */
function generateTopicId(topicName: string): string {
  return `topic-${topicName.toLowerCase().replace(/\s+/g, '-')}`
}

/**
 * Generate a stable, unique ID for a sub-topic
 */
function generateSubTopicId(topicName: string, subTopicName: string): string {
  const topic = topicName.toLowerCase().replace(/\s+/g, '-')
  const subTopic = subTopicName.toLowerCase().replace(/\s+/g, '-')
  return `subtopic-${topic}-${subTopic}`
}

/**
 * Transform API question data into store Question format
 */
function transformQuestion(apiQuestion: ApiQuestion): Question {
  const timestamp = new Date(apiQuestion.createdAt).getTime()

  // Map API difficulty (capitalized) to store difficulty (lowercase)
  const difficultyMap: Record<string, 'easy' | 'medium' | 'hard'> = {
    'Easy': 'easy',
    'Medium': 'medium',
    'Hard': 'hard'
  }
  
  const difficulty = difficultyMap[apiQuestion.questionId.difficulty] || 'medium'

  return {
    id: apiQuestion._id, // Use existing backend ID for stability
    content: apiQuestion.title,
    answer: apiQuestion.questionId.problemUrl, // Store problem URL as answer
    difficulty,
    completed: false, // Initialize as not completed
    createdAt: timestamp,
    updatedAt: new Date(apiQuestion.updatedAt).getTime(),
  }
}

/**
 * Transform API response data into normalized store format
 * 
 * This function:
 * 1. Groups questions by Topic and SubTopic
 * 2. Generates stable, unique IDs for all entities
 * 3. Creates normalized data structure (entities in maps, relationships via ID arrays)
 * 4. Maintains order from the API's topicOrder configuration
 * 
 * @param apiData - Raw API response from the backend
 * @returns Normalized data ready to be loaded into the store
 */
export function transformSheetData(apiData: ApiResponse): TransformedSheetData {
  const topics: Record<string, Topic> = {}
  const subTopics: Record<string, SubTopic> = {}
  const questions: Record<string, Question> = {}
  const topicOrder: string[] = []

  // Group questions by topic and sub-topic
  const questionsByTopicAndSubTopic = new Map<string, Map<string, ApiQuestion[]>>()

  apiData.data.questions.forEach((apiQuestion) => {
    const topicName = apiQuestion.topic
    const subTopicName = apiQuestion.subTopic || DEFAULT_SUBTOPIC

    if (!questionsByTopicAndSubTopic.has(topicName)) {
      questionsByTopicAndSubTopic.set(topicName, new Map())
    }

    const topicMap = questionsByTopicAndSubTopic.get(topicName)!
    if (!topicMap.has(subTopicName)) {
      topicMap.set(subTopicName, [])
    }

    topicMap.get(subTopicName)!.push(apiQuestion)
  })

  // Use the API's topicOrder for consistent ordering
  const orderedTopics = apiData.data.sheet.config.topicOrder

  orderedTopics.forEach((topicName) => {
    const topicId = generateTopicId(topicName)
    const topicData = questionsByTopicAndSubTopic.get(topicName)

    if (!topicData) {
      // Topic exists in order but has no questions - skip it
      return
    }

    const subTopicIds: string[] = []
    const timestamp = Date.now()

    // Process all sub-topics for this topic
    topicData.forEach((apiQuestions, subTopicName) => {
      const subTopicId = generateSubTopicId(topicName, subTopicName)
      const questionIds: string[] = []

      // Transform all questions in this sub-topic
      apiQuestions.forEach((apiQuestion) => {
        const question = transformQuestion(apiQuestion)
        questions[question.id] = question
        questionIds.push(question.id)
      })

      // Create sub-topic entity
      subTopics[subTopicId] = {
        id: subTopicId,
        name: subTopicName,
        questionIds,
        createdAt: timestamp,
        updatedAt: timestamp,
      }

      subTopicIds.push(subTopicId)
    })

    // Create topic entity
    topics[topicId] = {
      id: topicId,
      name: topicName,
      subTopicIds,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    topicOrder.push(topicId)
  })

  return {
    topics,
    subTopics,
    questions,
    topicOrder,
    metadata: {
      sheetName: apiData.data.sheet.name,
      sheetDescription: apiData.data.sheet.description,
      totalQuestions: Object.keys(questions).length,
      totalTopics: Object.keys(topics).length,
      totalSubTopics: Object.keys(subTopics).length,
    },
  }
}

/**
 * Example usage showing the transformation structure
 */
export function getTransformationExample() {
  return {
    description: 'Transformed data structure for store',
    example: {
      topics: {
        'topic-arrays': {
          id: 'topic-arrays',
          name: 'Arrays',
          subTopicIds: ['subtopic-arrays-general'],
          createdAt: 1234567890,
          updatedAt: 1234567890,
        },
      },
      subTopics: {
        'subtopic-arrays-general': {
          id: 'subtopic-arrays-general',
          name: 'General',
          questionIds: ['66e769be8a15c1adcdf77a4c'],
          createdAt: 1234567890,
          updatedAt: 1234567890,
        },
      },
      questions: {
        '66e769be8a15c1adcdf77a4c': {
          id: '66e769be8a15c1adcdf77a4c',
          content: 'Set Matrix Zeros',
          answer: 'https://leetcode.com/problems/set-matrix-zeros',
          createdAt: 1234567890,
          updatedAt: 1234567890,
        },
      },
      topicOrder: ['topic-arrays'],
    },
  }
}
