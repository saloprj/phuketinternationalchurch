import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  /** Add a hover shadow effect for interactive cards */
  hoverable?: boolean;
  /** Add an internal padding (default: true) */
  padded?: boolean;
}

export default function Card({
  children,
  className,
  hoverable = false,
  padded = true,
}: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-100',
        hoverable && 'hover:shadow-md transition-shadow',
        padded && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}
