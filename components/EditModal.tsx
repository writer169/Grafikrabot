import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScheduleItem, WorkLocation, WorkStatus, PartnerCode } from '../types';
import { PARTNER_NAMES } from '../constants';
import { formatMonth } from '../utils';
import { X, Save } from 'lucide-react';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: ScheduleItem) => void;
  day: number | null;
  currentYear: number;
  currentMonth: number;
  data: ScheduleItem | null;
}

export const EditModal: React.FC<EditModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  day, 
  currentYear,
  currentMonth,
  data 
}) => {
  const [status, setStatus] = useState<WorkStatus>('off');
  const [location, setLocation] = useState<WorkLocation>('Тастак');
  const [partner, setPartner] = useState<PartnerCode>('Ман');

  useEffect(() => {
    if (isOpen && data) {
      setStatus(data.status);
      if (data.location) setLocation(data.location);
      if (data.partner) setPartner(data.partner);
    } else if (isOpen && !data) {
        // Default values for empty day
        setStatus('off');
    }
  }, [isOpen, data]);

  if (!day) return null;

  const handleSave = () => {
    const newItem: ScheduleItem = {
      date: `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      status,
    };

    if (status === 'work') {
      newItem.location = location;
      newItem.partner = partner;
    }

    onSave(newItem);
    onClose();
  };

  const monthName = formatMonth(currentYear, currentMonth);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
          >
            <div className="bg-slate-100 p-4 flex justify-between items-center border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">
                Редактирование: {day} {monthName.toLowerCase().slice(0, 3)}.
              </h3>
              <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              
              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Статус</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setStatus('work')}
                    className={`p-3 rounded-xl font-medium transition-all ${
                      status === 'work' 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Рабочий
                  </button>
                  <button
                    onClick={() => setStatus('off')}
                    className={`p-3 rounded-xl font-medium transition-all ${
                      status === 'off' 
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Выходной
                  </button>
                </div>
              </div>

              {status === 'work' && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-5 overflow-hidden"
                >
                    {/* Location Select */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Локация</label>
                        <select 
                            value={location}
                            onChange={(e) => setLocation(e.target.value as WorkLocation)}
                            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium appearance-none"
                        >
                            <option value="Тастак">Тастак</option>
                            <option value="Сарыарка">Сарыарка</option>
                        </select>
                    </div>

                    {/* Partner Select */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Партнер / Менеджер</label>
                        <select 
                            value={partner}
                            onChange={(e) => setPartner(e.target.value as PartnerCode)}
                            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium appearance-none"
                        >
                            {Object.entries(PARTNER_NAMES).map(([code, name]) => (
                                <option key={code} value={code}>{name} ({code})</option>
                            ))}
                        </select>
                    </div>
                </motion.div>
              )}

              <button
                onClick={handleSave}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 transition-all flex items-center justify-center gap-2 mt-4"
              >
                <Save size={20} />
                Сохранить
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};