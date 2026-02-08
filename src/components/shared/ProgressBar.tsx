interface ProgressBarProps {
  current: number
  total: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'blue' | 'orange' | 'gray'
  showPercentage?: boolean
}

export default function ProgressBar({
  current,
  total,
  size = 'md',
  variant = 'blue',
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0
  const isComplete = current === total && total > 0
  
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }
  
  const variantClasses = {
    blue: {
      bg: 'bg-blue-100 dark:bg-blue-900/20',
      fill: 'bg-blue-600 dark:bg-blue-500',
      text: 'text-blue-700 dark:text-blue-400',
    },
    orange: {
      bg: 'bg-orange-100 dark:bg-orange-900/20',
      fill: 'bg-orange-500 dark:bg-orange-600',
      text: 'text-orange-600 dark:text-orange-400',
    },
    green: {
      bg: 'bg-green-100 dark:bg-green-900/20',
      fill: 'bg-green-600 dark:bg-green-500',
      text: 'text-green-700 dark:text-green-400',
    },
    gray: {
      bg: 'bg-gray-100 dark:bg-[#27272a]',
      fill: 'bg-gray-500 dark:bg-gray-400',
      text: 'text-gray-600 dark:text-gray-400',
    },
  }
  
  const colors = isComplete
    ? variantClasses.orange
    : variantClasses[variant]
  
  return (
    <div className="flex items-center gap-3">
      {/* Progress bar */}
      <div
        className={`flex-1 ${colors.bg} rounded-full overflow-hidden ${heightClasses[size]}`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={isComplete ? 'Complete' : `${current} of ${total} complete`}
      >
        <div
          className={`${colors.fill} ${heightClasses[size]} transition-all duration-150 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Text indicator - motivational */}
      {isComplete ? (
        <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 whitespace-nowrap">
          Complete
        </span>
      ) : (
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {current} of {total}{showPercentage && ` (${percentage}%)`}
        </span>
      )}
    </div>
  )
}
