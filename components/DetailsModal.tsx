import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScheduleItem } from '../types';
import { PARTNER_NAMES } from '../constants'; 
import { X, MapPin, User, Coffee, Briefcase } from 'lucide-react';
import { cn } from '../utils';

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  day: number | null;
  data: ScheduleItem | null;
}

export const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, onClose, day, data }) => {
  if (!day || !data) return null;

  const isWork = data.status === 'work';
  const partnerFullName = data.partner ? PARTNER_NAMES[data.partner] : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative"
            >
              {/* Header Image/Color Area */}
              <div className={cn(
                "h-32 w-full flex items-center justify-center relative",
                data.status === 'off' 
                  ? "bg-gradient-to-br from-rose-400 to-rose-500" 
                  : data.location === 'Тастак' 
                    ? "bg-gradient-to-br from-emerald-500 to-teal-600"
                    : "bg-gradient-to-br from-violet-500 to-indigo-600"
              )}>
                 <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                  >
                    <X size={20} />
                  </button>
                  
                  <div className="text-center text-white">
                    <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        transition={{ delay: 0.1 }}
                        className="bg-white/20 backdrop-blur-md rounded-2xl p-4 inline-flex flex-col items-center"
                    >
                        <span className="text-4xl font-bold">{day}</span>
                        <span className="text-sm font-medium opacity-90 uppercase tracking-wider">Декабря</span>
                    </motion.div>
                  </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                
                {/* Status Section */}
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0",
                         isWork ? "bg-slate-800" : "bg-rose-500"
                    )}>
                        {isWork ? <Briefcase size={24} /> : <Coffee size={24} />}
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Статус</p>
                        <p className="text-lg font-bold text-slate-800">
                            {isWork ? 'Рабочий день' : 'Выходной'}
                        </p>
                    </div>
                </div>

                {isWork && (
                    <>
                        {/* Divider */}
                        <div className="h-px bg-slate-100 w-full" />

                        {/* Location Section */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Локация</p>
                                <p className="text-lg font-bold text-slate-800">{data.location}</p>
                            </div>
                        </div>

                         {/* Partner Section */}
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Менеджер</p>
                                <p className="text-lg font-bold text-slate-800">{partnerFullName || data.partner}</p>
                            </div>
                        </div>
                    </>
                )}

                {/* Footer Message */}
                <div className="pt-2">
                    <p className="text-center text-slate-400 text-sm italic">
                        {isWork ? "Продуктивного дня! 💪" : "Отдыхайте и набирайтесь сил! 🧘‍♀️"}
                    </p>
                </div>

              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};