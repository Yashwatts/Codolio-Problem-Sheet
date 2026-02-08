# Question Sheet Tracker

A React application for managing and tracking educational problem sheets with hierarchical organization, progress tracking and API-based sheet import.

## Features

### Core Functionality
- Hierarchical three-level structure (Topics → SubTopics → Questions)
- Visual progress bars and completion statistics
- Mark questions as complete with circular checkboxes
- Dark and light theme modes with smooth transitions
- Drag-and-drop reordering for all levels
- Import pre-configured sheets via Codolio API
- Automatic state persistence to localStorage
- Undo deletions within 5 seconds

### User Interface
- Modal dialogs for adding and editing items
- Difficulty badges (Easy, Medium, Hard)
- Question links to external problem URLs
- Pencil icon for editing with modal forms
- Delete confirmation dialogs with undo option
- Undo notifications (5-second window to restore)
- Orange accent color for primary actions and stats
- Custom dark theme (#111010 background, #18181b cards)

### Technical Implementation
- Built with Vite for fast development
- Full TypeScript with strict mode
- Zustand state management with Immer
- Tailwind CSS with custom design tokens
- Semantic HTML and ARIA labels
- SSR-safe localStorage with graceful fallbacks

## Getting Started

### Prerequisites
- Node.js 16+ and npm or yarn installed

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Usage Guide

### Importing a Sheet

1. Click the Import button in the top header
2. Enter a sheet slug from the available options
3. Click Import and wait for the data to load
4. Click Done to start using the sheet

Available sheet slugs:
- `striver-sde-sheet` - Striver's SDE Sheet with coding problems

Note: The import feature fetches data from the Codolio API endpoint, not directly from Google Sheets URLs. Only pre-configured sheets with valid slugs can be imported.

### Managing Topics

- Add Topic: Click the + Topic button in the header
- Edit Topic: Click the pencil icon next to a topic name
- Delete Topic: Click the delete icon, confirm deletion, optionally undo within 5 seconds
- Expand/Collapse: Click anywhere on the topic card
- Reorder: Drag topics using the always-visible grip handle on the left

### Managing SubTopics

- Add SubTopic: Hover over a topic and click the + icon
- Edit SubTopic: Click the pencil icon
- Delete SubTopic: Click the delete icon, confirm deletion, optionally undo
- Reorder: Drag subtopics using the grip handle

### Managing Questions

- Add Question: Hover over a subtopic and click the + icon
- Fill Details: Enter question name, link (optional), and difficulty
- Edit Question: Click the pencil icon to modify
- Delete Question: Click the delete icon, confirm deletion, optionally undo
- Mark Complete: Click the circular checkbox
- View Link: Click the orange View button if a link exists
- Reorder: Drag questions using the grip handle

### Theme Switching

- Click the Moon icon to switch to dark mode
- Click the Sun icon to switch to light mode
- Theme preference is saved automatically

## API Integration

The application integrates with the Codolio Question Tracker API to import pre-configured problem sheets.

### Endpoint
```
https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/{slug}
```

### How It Works
1. User enters a sheet slug (e.g., `striver-sde-sheet`)
2. App fetches structured data from the Codolio API
3. Data is transformed into the app's normalized state format
4. Topics, subtopics, and questions are loaded into the store
5. All imported data persists to localStorage

### Data Structure
The API returns:
- Sheet metadata (name, description)
- Topics with hierarchical relationships
- Subtopics grouped under topics
- Questions with difficulty levels, links, and content

## Project Structure

```
src/
├── api/                    # API integration
│   ├── fetchSheet.ts      # Sheet fetching and loading
│   └── index.ts
├── components/
│   ├── question/          # Question components
│   │   ├── QuestionItem.tsx
│   │   ├── SortableQuestion.tsx
│   │   ├── AddQuestionModal.tsx
│   │   └── EditQuestionModal.tsx
│   ├── subtopic/          # SubTopic components
│   │   ├── SubTopicCard.tsx
│   │   ├── SortableSubTopic.tsx
│   │   ├── AddSubTopicModal.tsx
│   │   └── EditSubTopicModal.tsx
│   ├── topic/             # Topic components
│   │   ├── TopicCard.tsx
│   │   ├── TopicList.tsx
│   │   ├── SortableTopic.tsx
│   │   ├── AddTopicModal.tsx
│   │   └── EditTopicModal.tsx
│   └── shared/            # Reusable components
│       ├── ActionButtons.tsx
│       ├── AddItemInput.tsx
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── CircularProgress.tsx
│       ├── LoadingSpinner.tsx
       ├── ProgressBar.tsx
       ├── Toast.tsx
       └── ToastContainer.tsx
├── hooks/                 # Custom React hooks
│   ├── useStore.ts       # Store wrapper hooks
│   └── useTheme.ts       # Theme management
├── pages/                 # Page components
│   └── ImportSheet.tsx   # Sheet import UI
├── store/                 # Zustand store
│   ├── useQuestionStore.ts
│   └── selectors.ts      # Memoized selectors
├── types/                 # TypeScript types
│   ├── api.ts            # API response types
│   └── store.ts          # Store state types
├── utils/                 # Utility functions
│   ├── transformSheetData.ts
│   ├── reorder.ts
│   └── constants.ts
├── App.tsx               # Main app component
├── main.tsx              # Entry point
└── index.css             # Global styles
```

## Tech Stack

### Core
- React 18.3.1 - UI library
- TypeScript 5.5.3 - Type safety
- Vite 5.3.1 - Build tool and dev server

### State Management
- Zustand 4.5.0 - Lightweight state management
- Immer 10.1.1 - Immutable state updates

### UI & Styling
- Tailwind CSS 3.4.4 - Utility-first CSS
- lucide-react 0.563.0 - Icon library
- @dnd-kit - Drag and drop functionality

### Utilities
- nanoid 5.0.7 - Unique ID generation

## Design System

### Colors

#### Light Mode
- Background: `#f9fafb` (gray-50)
- Cards: `#ffffff` (white)
- Text: `#111827` (gray-900)
- Borders: `#e5e7eb` (gray-200)

#### Dark Mode
- Background: `#111010` (custom black)
- Cards: `#18181b` (custom dark)
- Nested Cards: `#27272a`
- Text: `#f9fafb` (gray-50)
- Borders: `#374151` (gray-700)

#### Accent Colors
- Primary: **Orange** (`#ea580c` / `#f97316`)
- Success: **Green** (`#22c55e` / `#4ade80`)
- Warning: **Yellow** (`#eab308` / `#facc15`)
- Error: **Red** (`#dc2626` / `#ef4444`)

### Typography
- Base: 14px (0.875rem)
- Topic Title: 18px semibold
- SubTopic Title: 16px medium
- Question: 14px regular

## Key Features Implementation

### Progress Tracking
- Real-time calculation of completed questions
- Progress bars at subtopic and topic levels
- Circular progress indicator for topics when collapsed
- Overall stats in header (X/Y questions · Z topics)

### Drag and Drop
- Smooth animations with DnD Kit
- Visual feedback during drag
- Always-visible grip handles on the left side
- Orange highlight when dragging

### Delete & Undo System
- Confirmation dialog before deletion
- 5-second undo window after deletion
- Toast notification at bottom-right with undo button
- Restores full state including all child items
- Automatic permanent deletion after timeout

### Theme System
- Persistent theme storage in localStorage
- Smooth 300ms color transitions
- System preference detection on first visit
- Synchronized across all components

### Data Persistence
- Auto-save to localStorage on every change
- SSR-safe with fallback handling
- Preserves completion state
- Stores entire app state (topics, subtopics, questions)

## License

This project is created for educational purposes as part of Codolio assignment.

## Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Drag and drop by [dnd-kit](https://dndkit.com/)
- State management by [Zustand](https://github.com/pmndrs/zustand)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)
