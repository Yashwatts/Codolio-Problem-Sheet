interface CardProps {
  children: React.ReactNode
  variant?: 'default' | 'nested' | 'elevated'
  className?: string
  onClick?: () => void
}

export default function Card({ 
  children, 
  variant = 'default', 
  className = '',
  onClick 
}: CardProps) {
  const variants = {
    default: 'bg-white dark:bg-[#18181b] shadow-md hover:shadow-lg',
    nested: 'bg-gray-50 dark:bg-[#27272a] border border-gray-200 dark:border-gray-600',
    elevated: 'bg-white dark:bg-[#18181b] shadow-xl'
  }
  
  return (
    <div 
      className={`rounded-lg ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardHeader({ 
  children, 
  className = '',
  onClick
}: { 
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <div 
      className={`flex items-center justify-between ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export function CardBody({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode
  className?: string 
}) {
  return (
    <div className={`mt-4 ${className}`}>
      {children}
    </div>
  )
}
