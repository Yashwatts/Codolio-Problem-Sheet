import type { ApiResponse } from '@/types/api'
import { transformSheetData, type TransformedSheetData } from '@/utils/transformSheetData'

/**
 * Base API URL for Codolio Question Tracker
 */
const API_BASE_URL = 'https://node.codolio.com/api/question-tracker/v1'

/**
 * Error thrown when fetching sheet data fails
 */
export class SheetFetchError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message)
    this.name = 'SheetFetchError'
  }
}

/**
 * Fetch a sheet by its slug from the Codolio API
 * 
 * @param slug - The sheet identifier (e.g., 'striver-sde-sheet')
 * @returns Transformed sheet data ready for the store
 * @throws {SheetFetchError} If the request fails or returns invalid data
 * 
 * @example
 * ```ts
 * try {
 *   const sheetData = await fetchSheet('striver-sde-sheet')
 *   console.log(`Loaded ${sheetData.metadata.totalQuestions} questions`)
 * } catch (error) {
 *   if (error instanceof SheetFetchError) {
 *     console.error('Failed to fetch sheet:', error.message)
 *   }
 * }
 * ```
 */
export async function fetchSheet(slug: string): Promise<TransformedSheetData> {
  const url = `${API_BASE_URL}/sheet/public/get-sheet-by-slug/${slug}`

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new SheetFetchError(
        `Failed to fetch sheet: ${response.statusText}`,
        response.status
      )
    }

    const data: ApiResponse = await response.json()

    // Validate API response structure
    if (!data.status?.success) {
      throw new SheetFetchError(
        data.status?.message || 'API returned unsuccessful response',
        data.status?.code
      )
    }

    if (!data.data?.sheet || !Array.isArray(data.data.questions)) {
      throw new SheetFetchError('Invalid API response structure')
    }

    // Transform and return the data
    return transformSheetData(data)
  } catch (error) {
    if (error instanceof SheetFetchError) {
      throw error
    }

    // Network or parsing errors
    throw new SheetFetchError(
      'Failed to fetch or parse sheet data',
      undefined,
      error
    )
  }
}

/**
 * Fetch sheet and directly load into the store
 * 
 * @param slug - The sheet identifier
 * @param resetStore - Whether to reset the store before loading (default: true)
 * 
 * @example
 * ```ts
 * import { useQuestionStore } from '@/store'
 * import { fetchAndLoadSheet } from '@/api/fetchSheet'
 * 
 * const loadSheet = async () => {
 *   try {
 *     await fetchAndLoadSheet('striver-sde-sheet')
 *     console.log('Sheet loaded successfully!')
 *   } catch (error) {
 *     console.error('Failed to load sheet:', error)
 *   }
 * }
 * ```
 */
export async function fetchAndLoadSheet(
  slug: string,
  resetStore: boolean = true
): Promise<TransformedSheetData> {
  const sheetData = await fetchSheet(slug)

  // Dynamically import to avoid circular dependencies
  const { useQuestionStore } = await import('@/store/useQuestionStore')
  const store = useQuestionStore.getState()

  if (resetStore) {
    store.resetStore()
  }

  // Create mappings from API IDs to store IDs
  const topicIdMap = new Map<string, string>()
  const subTopicIdMap = new Map<string, string>()

  // Load topics and build mapping
  Object.values(sheetData.topics).forEach((topic) => {
    const newTopicId = store.addTopic(topic.name)
    topicIdMap.set(topic.id, newTopicId)
  })

  // Load sub-topics and build mapping
  Object.values(sheetData.subTopics).forEach((subTopic) => {
    // Find parent topic using API data, then get the store ID from mapping
    const parentApiTopic = Object.values(sheetData.topics).find((t) =>
      t.subTopicIds.includes(subTopic.id)
    )
    
    if (parentApiTopic) {
      const parentStoreTopicId = topicIdMap.get(parentApiTopic.id)
      if (parentStoreTopicId) {
        const newSubTopicId = store.addSubTopic(parentStoreTopicId, subTopic.name)
        subTopicIdMap.set(subTopic.id, newSubTopicId)
      }
    }
  })

  // Load questions
  Object.values(sheetData.questions).forEach((question) => {
    // Find parent sub-topic using API data, then get the store ID from mapping
    const parentApiSubTopic = Object.values(sheetData.subTopics).find((st) =>
      st.questionIds.includes(question.id)
    )
    
    if (parentApiSubTopic) {
      const parentStoreSubTopicId = subTopicIdMap.get(parentApiSubTopic.id)
      if (parentStoreSubTopicId) {
        store.addQuestion(parentStoreSubTopicId, question.content, question.answer, question.difficulty)
      }
    }
  })

  return sheetData
}

/**
 * Available sheet slugs (add more as needed)
 */
export const AVAILABLE_SHEETS = {
  STRIVER_SDE: 'striver-sde-sheet',
  // Add more sheets here as they become available
} as const

/**
 * Type for available sheet slugs
 */
export type AvailableSheetSlug = typeof AVAILABLE_SHEETS[keyof typeof AVAILABLE_SHEETS]
