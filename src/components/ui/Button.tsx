import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary:   { background: '#3b82f6', color: '#fff',     border: 'none' },
  secondary: { background: '#111827', color: '#94a3b8',  border: '0.5px solid #1e2d45' },
  danger:    { background: '#ef4444', color: '#fff',     border: 'none' },
  ghost:     { background: 'transparent', color: '#64748b', border: '0.5px solid #1e2d45' },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { padding: '5px 10px', fontSize: '10px' },
  md: { padding: '8px 14px', fontSize: '11px' },
  lg: { padding: '11px 18px', fontSize: '12px' },
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  style,
  className = '',
  children,
  disabled,
  onMouseEnter,
  onMouseLeave,
  ...props
}) => {
  const [hovered, setHovered] = React.useState(false);

  const hoverOverlay: React.CSSProperties = hovered && !disabled
    ? { filter: 'brightness(1.12)' }
    : {};

  return (
    <button
      disabled={disabled}
      style={{
        fontFamily: 'IBM Plex Mono, monospace',
        fontWeight: 600,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        transition: 'filter 0.15s, transform 0.1s',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...hoverOverlay,
        ...style,
      }}
      onMouseEnter={e => { setHovered(true); onMouseEnter?.(e); }}
      onMouseLeave={e => { setHovered(false); onMouseLeave?.(e); }}
      {...props}
    >
      {children}
    </button>
  );
};
