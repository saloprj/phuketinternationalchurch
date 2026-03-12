import Link from 'next/link';
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-dark active:bg-primary-dark border border-transparent',
  secondary:
    'bg-white text-text-main border border-gray-300 hover:bg-gray-50 active:bg-gray-100',
  ghost:
    'bg-transparent text-primary border border-transparent hover:bg-primary/5 active:bg-primary/10',
  danger:
    'bg-red-600 text-white border border-transparent hover:bg-red-700 active:bg-red-800',
};

const sizeClasses: Record<Size, string> = {
  sm: 'text-sm px-3 py-1.5 rounded-md',
  md: 'text-sm px-5 py-2.5 rounded-lg',
  lg: 'text-base px-7 py-3 rounded-lg',
};

const baseClasses =
  'inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

type ButtonBaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsLink = ButtonBaseProps & {
  href: string;
  external?: boolean;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps | 'href'>;

type ButtonAsButton = ButtonBaseProps & {
  href?: undefined;
  external?: undefined;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps>;

type ButtonProps = ButtonAsLink | ButtonAsButton;

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if ('href' in props && props.href !== undefined) {
    const { href, external, ...rest } = props as ButtonAsLink;

    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...rest}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...(rest as any)}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
