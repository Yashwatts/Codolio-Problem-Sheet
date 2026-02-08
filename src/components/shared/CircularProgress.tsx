interface CircularProgressProps {
  current: number
  total: number
  size?: number
}

export default function CircularProgress({
  current,
  total,
  size = 60
}: CircularProgressProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0
  
  const strokeWidth = 4
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  
  const color = '#F97316' // orange
  
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Circular progress */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E5E7EB"
            className="dark:stroke-[#3f3f46]"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {percentage}%
          </span>
        </div>
      </div>
      
      {/* Count */}
      <div className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {current}/{total}
      </div>
    </div>
  )
}
