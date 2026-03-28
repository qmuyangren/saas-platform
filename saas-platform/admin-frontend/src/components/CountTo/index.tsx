import React, { useEffect, useRef, useState } from 'react';

interface CountToProps {
  from: number;
  to: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

const CountTo: React.FC<CountToProps> = ({
  from = 0,
  to = 100,
  duration = 2000,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  onStart,
  onEnd,
}) => {
  const [count, setCount] = useState(from);
  const countRef = useRef(from);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    countRef.current = from;
    setCount(from);
  }, [from]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
        onStart?.();
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // 缓动函数 (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentCount = from + (to - from) * easeOut;
      countRef.current = currentCount;
      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(to);
        onEnd?.();
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [from, to, duration, onStart, onEnd]);

  const formatNumber = (num: number): string => {
    const fixed = num.toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  };

  return (
    <span>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

export default CountTo;
