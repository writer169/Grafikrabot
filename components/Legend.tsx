import React from 'react';
import { cn } from '../utils';

export const Legend: React.FC = () => {
    const items = [
        { label: 'Тастак', colorClass: 'bg-gradient-to-br from-tastak-from to-tastak-to' },
        { label: 'Сары-Арка', colorClass: 'bg-gradient-to-br from-saryarka-from to-saryarka-to' },
        { label: 'Выходной', colorClass: 'bg-gradient-to-br from-off-from to-off-to' },
    ];

    return (
        <div className="w-full bg-white rounded-2xl p-4 shadow-xl shadow-slate-200/50 mt-6">
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
                {items.map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5">
                        <div className={cn("w-3 h-3 rounded-full shadow-sm ring-2 ring-white/50", item.colorClass)} />
                        <span className="text-xs sm:text-sm font-medium text-slate-600">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};