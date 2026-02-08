/**
 * Application constants and configuration values
 */

export const APP_CONFIG = {
  name: 'Question Sheet App',
  version: '1.0.0',
  storageKey: 'question-sheet-storage',
} as const

export const LIMITS = {
  maxTopicNameLength: 100,
  maxSubTopicNameLength: 100,
  maxQuestionContentLength: 1000,
  maxAnswerLength: 2000,
} as const

export const MESSAGES = {
  confirmDeleteTopic: 'Delete this topic and all its sub-topics and questions?',
  confirmDeleteSubTopic: 'Delete this sub-topic and all its questions?',
  confirmDeleteQuestion: 'Delete this question?',
  confirmResetStore: 'Reset all data? This cannot be undone.',
  emptyState: {
    topics: 'No topics yet. Create your first topic to get started.',
    subTopics: 'No sub-topics yet. Add a sub-topic to organize questions.',
    questions: 'No questions yet. Start adding questions to this sub-topic.',
  },
} as const

export const VALIDATION = {
  topicName: {
    required: 'Topic name is required',
    maxLength: `Topic name must be less than ${LIMITS.maxTopicNameLength} characters`,
  },
  subTopicName: {
    required: 'Sub-topic name is required',
    maxLength: `Sub-topic name must be less than ${LIMITS.maxSubTopicNameLength} characters`,
  },
  question: {
    contentRequired: 'Question content is required',
    answerRequired: 'Answer is required',
    contentMaxLength: `Question must be less than ${LIMITS.maxQuestionContentLength} characters`,
    answerMaxLength: `Answer must be less than ${LIMITS.maxAnswerLength} characters`,
  },
} as const

export const DND_IDS = {
  topicPrefix: 'topic-',
  subTopicPrefix: 'subtopic-',
  questionPrefix: 'question-',
} as const
