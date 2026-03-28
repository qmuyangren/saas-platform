import React, { useState, useEffect } from 'react';
import { Statistic } from 'antd';

interface CountDownProps {
  targetDate: Date | string | number;
  onEnd?: () => void;
  format?: string;
  showDay?: boolean;
  prefix?: string;
  suffix?: string;
  valueStyle?: React.CSSProperties;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountDown: React.FC<CountDownProps> = ({
  targetDate,
  onEnd,
  format = 'HH:mm:ss',
  showDay = true,
  prefix,
  suffix,
  valueStyle,
}) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 && newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        clearInterval(timer);
        onEnd?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onEnd]);

  const renderContent = () => {
    if (showDay && timeLeft.days > 0) {
      return (
        <>
          <Statistic value={timeLeft.days} suffix="天" valueStyle={valueStyle} />
          <Statistic value={timeLeft.hours} suffix="时" valueStyle={valueStyle} />
          <Statistic value={timeLeft.minutes} suffix="分" valueStyle={valueStyle} />
          <Statistic value={timeLeft.seconds} suffix="秒" valueStyle={valueStyle} />
        </>
      );
    }

    return (
      <Statistic
        value={`${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
        valueStyle={valueStyle}
      />
    );
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {prefix}
      {renderContent()}
      {suffix}
    </div>
  );
};

export default CountDown;
