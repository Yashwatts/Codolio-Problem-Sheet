import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { nanoid } from 'nanoid'
import type { QuestionSheetState, Topic, SubTopic, Question } from '@/types/store'

/**
 * Initial empty state
 */
const initialState = {
  topics: {},
  subTopics: {},
  questions: {},
  topicOrder: [],
}

/**
 * SSR-safe storage implementation
 * Returns null during SSR, uses localStorage on client
 */
const getStorage = (): StateStorage | undefined => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return undefined
  }

  return {
    getItem: (name: string): string | null => {
      try {
        return localStorage.getItem(name)
      } catch (error) {
        console.warn(`Failed to read from localStorage: ${error}`)
        return null
      }
    },
    setItem: (name: string, value: string): void => {
      try {
        localStorage.setItem(name, value)
      } catch (error) {
        console.warn(`Failed to write to localStorage: ${error}`)
      }
    },
    removeItem: (name: string): void => {
      try {
        localStorage.removeItem(name)
      } catch (error) {
        console.warn(`Failed to remove from localStorage: ${error}`)
      }
    },
  }
}

/**
 * Migration function for handling version updates
 * Ensures backward compatibility when store structure changes
 */
const migratePersistedState = (persistedState: any, version: number): any => {
  // Version 1: Current structure (no migration needed yet)
  if (version === 1) {
    // Ensure all required fields exist
    return {
      topics: persistedState?.topics || {},
      subTopics: persistedState?.subTopics || {},
      questions: persistedState?.questions || {},
      topicOrder: persistedState?.topicOrder || [],
    }
  }

  // Future migrations can be added here
  // Example for version 2:
  // if (version === 2) {
  //   return {
  //     ...persistedState,
  //     newField: defaultValue,
  //   }
  // }

  return persistedState
}

/**
 * Main Zustand store with localStorage persistence
 * Uses immer middleware for clean immutable updates
 */
export const useQuestionStore = create<QuestionSheetState>()(
  persist(
    immer((set) => ({
      ...initialState,

      // ============= TOPIC ACTIONS =============

      addTopic: (name: string) => {
        const id = nanoid()
        set((state) => {
          const timestamp = Date.now()

          state.topics[id] = {
            id,
            name,
            subTopicIds: [],
            createdAt: timestamp,
            updatedAt: timestamp,
          }

          state.topicOrder.push(id)
        })
        return id
      },

      updateTopic: (id: string, updates: Partial<Pick<Topic, 'name'>>) => {
        set((state) => {
          if (state.topics[id]) {
            Object.assign(state.topics[id], updates)
            state.topics[id].updatedAt = Date.now()
          }
        })
      },

      deleteTopic: (id: string) => {
        set((state) => {
          const topic = state.topics[id]
          if (!topic) return

          // Delete all sub-topics and their questions (cascade)
          topic.subTopicIds.forEach((subTopicId) => {
            const subTopic = state.subTopics[subTopicId]
            if (subTopic) {
              // Delete all questions in this sub-topic
              subTopic.questionIds.forEach((questionId) => {
                delete state.questions[questionId]
              })
              delete state.subTopics[subTopicId]
            }
          })

          // Delete the topic itself
          delete state.topics[id]

          // Remove from order
          state.topicOrder = state.topicOrder.filter((topicId) => topicId !== id)
        })
      },

      reorderTopics: (newOrder: string[]) => {
        set((state) => {
          state.topicOrder = newOrder
        })
      },

      // ============= SUBTOPIC ACTIONS =============

      addSubTopic: (topicId: string, name: string) => {
        const id = nanoid()
        set((state) => {
          if (!state.topics[topicId]) return

          const timestamp = Date.now()

          state.subTopics[id] = {
            id,
            name,
            questionIds: [],
            createdAt: timestamp,
            updatedAt: timestamp,
          }

          state.topics[topicId].subTopicIds.push(id)
          state.topics[topicId].updatedAt = timestamp
        })
        return id
      },

      updateSubTopic: (id: string, updates: Partial<Pick<SubTopic, 'name'>>) => {
        set((state) => {
          if (state.subTopics[id]) {
            Object.assign(state.subTopics[id], updates)
            state.subTopics[id].updatedAt = Date.now()
          }
        })
      },

      deleteSubTopic: (id: string) => {
        set((state) => {
          const subTopic = state.subTopics[id]
          if (!subTopic) return

          // Delete all questions in this sub-topic
          subTopic.questionIds.forEach((questionId) => {
            delete state.questions[questionId]
          })

          // Remove from parent topic
          Object.values(state.topics).forEach((topic) => {
            if (topic.subTopicIds.includes(id)) {
              topic.subTopicIds = topic.subTopicIds.filter(
                (subTopicId) => subTopicId !== id
              )
              topic.updatedAt = Date.now()
            }
          })

          // Delete the sub-topic itself
          delete state.subTopics[id]
        })
      },

      reorderSubTopics: (topicId: string, newOrder: string[]) => {
        set((state) => {
          const topic = state.topics[topicId]
          if (!topic) return

          state.topics[topicId].subTopicIds = newOrder
          state.topics[topicId].updatedAt = Date.now()
        })
      },

      // ============= QUESTION ACTIONS =============

      addQuestion: (subTopicId: string, content: string, answer: string, difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
        const id = nanoid()
        set((state) => {
          if (!state.subTopics[subTopicId]) return

          const timestamp = Date.now()

          state.questions[id] = {
            id,
            content,
            answer,
            difficulty,
            completed: false,
            createdAt: timestamp,
            updatedAt: timestamp,
          }

          state.subTopics[subTopicId].questionIds.push(id)
          state.subTopics[subTopicId].updatedAt = timestamp
        })
        return id
      },

      updateQuestion: (id: string, updates: Partial<Pick<Question, 'content' | 'answer' | 'completed' | 'difficulty'>>) => {
        set((state) => {
          if (state.questions[id]) {
            Object.assign(state.questions[id], updates)
            state.questions[id].updatedAt = Date.now()
          }
        })
      },

      deleteQuestion: (id: string) => {
        set((state) => {
          if (!state.questions[id]) return

          // Remove from parent sub-topic
          Object.values(state.subTopics).forEach((subTopic) => {
            if (subTopic.questionIds.includes(id)) {
              subTopic.questionIds = subTopic.questionIds.filter(
                (questionId) => questionId !== id
              )
              subTopic.updatedAt = Date.now()
            }
          })

          // Delete the question itself
          delete state.questions[id]
        })
      },

      reorderQuestions: (subTopicId: string, newOrder: string[]) => {
        set((state) => {
          const subTopic = state.subTopics[subTopicId]
          if (!subTopic) return

          state.subTopics[subTopicId].questionIds = newOrder
          state.subTopics[subTopicId].updatedAt = Date.now()
        })
      },

      toggleQuestionCompletion: (id: string) => {
        set((state) => {
          if (state.questions[id]) {
            state.questions[id].completed = !state.questions[id].completed
            state.questions[id].updatedAt = Date.now()
          }
        })
      },

      // ============= UTILITY =============

      resetStore: () => {
        set(initialState)
      },
    })),
    {
      name: 'question-sheet-storage',
      version: 1,
      
      // Use custom storage implementation for SSR safety
      storage: createJSONStorage(() => getStorage() || {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      }),
      
      // Specify which parts of state to persist
      partialize: (state) => ({
        topics: state.topics,
        subTopics: state.subTopics,
        questions: state.questions,
        topicOrder: state.topicOrder,
      }),
      
      // Merge function for safe hydration
      merge: (persistedState, currentState) => {
        const migrated = migratePersistedState(persistedState, 1)
        
        return {
          ...currentState,
          topics: migrated.topics || {},
          subTopics: migrated.subTopics || {},
          questions: migrated.questions || {},
          topicOrder: migrated.topicOrder || [],
        }
      },
      
      // Skip hydration during SSR
      skipHydration: typeof window === 'undefined',
      
      // Handle persistence errors gracefully
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate store:', error)
        } else if (state) {
          console.info('Store rehydrated successfully')
        }
      },
    }
  )
)
