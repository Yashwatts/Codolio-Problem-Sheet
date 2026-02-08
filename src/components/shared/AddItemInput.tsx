import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from './Button'

interface AddItemInputProps {
  placeholder: string
  onAdd: (value: string, link?: string, difficulty?: 'easy' | 'medium' | 'hard') => void
  buttonText?: string
  multiline?: boolean
  showLinkInput?: boolean
  showDifficultySelector?: boolean
}

export default function AddItemInput({ 
  placeholder,
  onAdd,
  buttonText = 'Add',
  multiline = false,
  showLinkInput = false,
  showDifficultySelector = false
}: AddItemInputProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [value, setValue] = useState('')
  const [link, setLink] = useState('')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  
  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value.trim(), link.trim() || undefined, showDifficultySelector ? difficulty : undefined)
      setValue('')
      setLink('')
      setDifficulty('medium')
      setIsExpanded(false)
    }
  }
  
  const handleCancel = () => {
    setValue('')
    setLink('')
    setDifficulty('medium')
    setIsExpanded(false)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      handleAdd()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }
  
  if (!isExpanded) {
    return (
      <Button 
        variant="ghost" 
        onClick={() => setIsExpanded(true)}
        leftIcon={<Plus size={16} />}
        size="sm"
      >
        {buttonText.replace('Add ', '')}
      </Button>
    )
  }
  
  return (
    <div className="flex flex-col gap-2">
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm font-normal text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-[#27272a] border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 resize-none"
          rows={3}
          autoFocus
        />
      ) : (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm font-normal text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-[#27272a] border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
          autoFocus
        />
      )}
      
      {showLinkInput && (
        <input
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="Link (optional)"
          className="w-full px-3 py-2 text-sm font-normal text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 bg-white dark:bg-[#27272a] border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
        />
      )}
      
      {showDifficultySelector && (
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
            className="w-full px-3 py-2 text-sm font-normal text-gray-900 dark:text-gray-100 bg-white dark:bg-[#27272a] border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      )}
      
      <div className="flex gap-2">
        <Button 
          variant="primary" 
          onClick={handleAdd} 
          disabled={!value.trim()}
          size="sm"
        >
          Add
        </Button>
        <Button 
          variant="secondary" 
          onClick={handleCancel}
          size="sm"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
