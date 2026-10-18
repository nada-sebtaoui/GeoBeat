import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = { sm: 14, md: 22, lg: 32 };
const strokeMap = { sm: 2, md: 2.5, lg: 3 };

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  const s = sizeMap[size];
  const sw = strokeMap[size];
  const r = (s - sw * 2) / 2;
  const circ = 2 * Math.PI * r;

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={{ animation: 'spin 0.75s linear infinite', flexShrink: 0 }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle
        cx={s / 2}
        cy={s / 2}
        r={r}
        fill="none"
        stroke="#1e2d45"
        strokeWidth={sw}
      />
      <circle
        cx={s / 2}
        cy={s / 2}
        r={r}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={sw}
        strokeDasharray={`${circ * 0.25} ${circ * 0.75}`}
        strokeLinecap="round"
      />
    </svg>
  );
};
