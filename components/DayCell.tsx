import React from 'react';
import { motion } from 'framer-motion';
import { ScheduleItem } from '../types';
import { cn } from '../utils';

interface DayCellProps {
  day: number;
  data?: ScheduleItem;
  onClick: (day: number, data?: ScheduleItem) => void;
  isToday?: boolean;
}

export const DayCell: React.FC<DayCellProps> = ({ day, data, onClick, isToday }) => {
  // Animation variants
  const variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    hover: { y: -4, shadow: "0px 10px 20px rgba(0,0,0,0.1)" },
    tap: { scale: 0.95 }
  };

  const isWork = data?.status === 'work';
  const isOff = data?.status === 'off';
  const isTastak = data?.location === 'Тастак';
  const isSaryarka = data?.location === 'Сарыарка';
  const isManshuk = data?.partner === 'Ман';

  // Dynamic classes based on status
  const bgClass = cn(
    "relative w-full aspect-[4/5] sm:aspect-square rounded-2xl p-2 flex items-center justify-center transition-colors shadow-sm cursor-pointer border border-transparent overflow-hidden group",
    !data && "bg-white/50 cursor-default opacity-50 hover:bg-white/60",
    isOff && "bg-gradient-to-br from-off-from to-off-to text-white shadow-rose-200",
    isTastak && "bg-gradient-to-br from-tastak-from to-tastak-to text-white shadow-emerald-200",
    isSaryarka && "bg-gradient-to-br from-saryarka-from to-saryarka-to text-white shadow-indigo-200",
    isToday && "ring-4 ring-yellow-400 ring-offset-2 z-10"
  );

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover={data ? "hover" : undefined}
      whileTap={data ? "tap" : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => data && onClick(day, data)}
      className={bgClass}
    >
      {/* Background decorations for style */}
      {isWork && (
         <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-colors" />
      )}

      {/* Day Number - Centered */}
      <span className={cn(
          "text-2xl sm:text-3xl font-bold tracking-tight z-10",
           !data ? "text-slate-400" : "text-white/95"
        )}>
        {day}
      </span>

      {/* Red Dot Indicator - Bottom Right */}
      {isManshuk && (
        <div className="absolute bottom-2 right-2 z-20">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-sm ring-1 ring-white/30" title="Работа с Маншук" />
        </div>
      )}
    </motion.div>
  );
};