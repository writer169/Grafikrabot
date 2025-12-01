import React, { useState, useMemo } from 'react';
import { ScheduleItem, WorkStatus, WorkLocation, PartnerCode } from '../types';
import { WEEKDAYS } from '../constants';
import { Check, X, Calendar, Save, ArrowLeft, Trash2 } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth, formatMonth, isToday as checkIsToday } from '../utils';

interface BulkEditPageProps {
  schedule: ScheduleItem[];
  currentYear: number;
  currentMonth: number;
  onUpdateSchedule: (newSchedule: ScheduleItem[]) => void;
  onSaveToCloud: () => Promise<void>;
  onBack: () => void;
  isSaving: boolean;
}

export const BulkEditPage: React.FC<BulkEditPageProps> = ({
  schedule,
  currentYear,
  currentMonth,
  onUpdateSchedule,
  onSaveToCloud,
  onBack,
  isSaving
}) => {
  const [selectedDays, setSelectedDays] = useState<Set<number>>(new Set());
  const [bulkStatus, setBulkStatus] = useState<WorkStatus>('work');
  const [bulkLocation, setBulkLocation] = useState<WorkLocation>('Тастак');
  const [bulkPartner, setBulkPartner] = useState<PartnerCode>('Ман');

  const scheduleMap = useMemo(() => {
    const map: Record<string, ScheduleItem> = {};
    schedule.forEach(item => {
      map[item.date] = item;
    });
    return map;
  }, [schedule]);

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const startEmptyDays = getFirstDayOfMonth(currentYear, currentMonth);

  const toggleDay = (day: number) => {
    const newSelected = new Set(selectedDays);
    if (newSelected.has(day)) {
      newSelected.delete(day);
    } else {
      newSelected.add(day);
    }
    setSelectedDays(newSelected);
  };

  const selectAll = () => {
    const all = new Set<number>();
    for (let i = 1; i <= totalDays; i++) {
      all.add(i);
    }
    setSelectedDays(all);
  };

  const clearSelection = () => {
    setSelectedDays(new Set());
  };

  const applyBulkEdit = () => {
    if (selectedDays.size === 0) {
      alert('Выберите хотя бы один день');
      return;
    }

    const newSchedule = [...schedule];
    const existingDates = new Set(schedule.map(item => item.date));

    selectedDays.forEach(day => {
      const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const newItem: ScheduleItem = {
        date: dateStr,
        status: bulkStatus,
        ...(bulkStatus === 'work' && {
          location: bulkLocation,
          partner: bulkPartner
        })
      };

      if (existingDates.has(dateStr)) {
        const index = newSchedule.findIndex(item => item.date === dateStr);
        newSchedule[index] = newItem;
      } else {
        newSchedule.push(newItem);
      }
    });

    onUpdateSchedule(newSchedule.sort((a, b) => a.date.localeCompare(b.date)));
    setSelectedDays(new Set());
    alert(`Изменения применены к ${selectedDays.size} дням`);
  };

  const deleteBulkDays = () => {
    if (selectedDays.size === 0) {
      alert('Выберите хотя бы один день');
      return;
    }

    if (!confirm(`Удалить данные для ${selectedDays.size} выбранных дней?`)) {
      return;
    }

    const selectedDates = Array.from(selectedDays).map(day => 
      `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    );

    const newSchedule = schedule.filter(item => !selectedDates.includes(item.date));
    onUpdateSchedule(newSchedule);
    setSelectedDays(new Set());
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-200/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Назад к календарю</span>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-indigo-600" size={24} />
            <h1 className="text-3xl font-bold text-slate-900">
              Массовое редактирование
            </h1>
          </div>
          <p className="text-slate-600">
            {formatMonth(currentYear, currentMonth)} {currentYear} · Выбрано дней: <span className="font-bold text-indigo-600">{selectedDays.size}</span>
          </p>
        </header>

        <div className="grid lg:grid-cols-[1fr,400px] gap-6">
          {/* Calendar Grid */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-700">
                {formatMonth(currentYear, currentMonth)} {currentYear}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={selectAll}
                  className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors"
                >
                  Выбрать все
                </button>
                <button
                  onClick={clearSelection}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                  Снять выбор
                </button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {WEEKDAYS.map(day => (
                <div key={day} className="text-center">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {day}
                  </span>
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: startEmptyDays }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {Array.from({ length: totalDays }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const item = scheduleMap[dateStr];
                const isSelected = selectedDays.has(day);
                const isToday = checkIsToday(currentYear, currentMonth, day);

                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`
                      aspect-square rounded-xl border-2 transition-all relative
                      ${isSelected 
                        ? 'border-indigo-500 bg-indigo-50 shadow-lg scale-95' 
                        : 'border-slate-200 hover:border-indigo-300 hover:shadow-md'
                      }
                      ${isToday ? 'ring-2 ring-rose-400 ring-offset-2' : ''}
                    `}
                  >
                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}

                    {/* Day Number */}
                    <div className={`text-lg font-bold mb-1 ${isSelected ? 'text-indigo-700' : 'text-slate-700'}`}>
                      {day}
                    </div>

                    {/* Status Indicator */}
                    {item && (
                      <div className="absolute bottom-1 left-1 right-1 flex justify-center">
                        {item.status === 'work' ? (
                          <div className={`w-2 h-2 rounded-full ${
                            item.location === 'Тастак' ? 'bg-emerald-500' : 'bg-amber-500'
                          }`} />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-rose-500" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bulk Edit Controls */}
          <div className="space-y-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50">
              <h3 className="text-lg font-bold text-slate-700 mb-4">Применить к выбранным</h3>
              
              {/* Status */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Статус
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setBulkStatus('work')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      bulkStatus === 'work'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold">Работа</div>
                  </button>
                  <button
                    onClick={() => setBulkStatus('off')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      bulkStatus === 'off'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold">Выходной</div>
                  </button>
                </div>
              </div>

              {/* Location (only for work days) */}
              {bulkStatus === 'work' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Локация
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setBulkLocation('Тастак')}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          bulkLocation === 'Тастак'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-bold">Тастак</div>
                      </button>
                      <button
                        onClick={() => setBulkLocation('Сарыарка')}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          bulkLocation === 'Сарыарка'
                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="font-bold">Сарыарка</div>
                      </button>
                    </div>
                  </div>

                  {/* Partner */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Партнер
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Ман', 'А', 'М.Д.', 'Г'] as PartnerCode[]).map(partner => (
                        <button
                          key={partner}
                          onClick={() => setBulkPartner(partner)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            bulkPartner === partner
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-bold">{partner}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Apply Button */}
              <button
                onClick={applyBulkEdit}
                disabled={selectedDays.size === 0}
                className="w-full bg-indigo-600 text-white p-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Применить изменения
              </button>

              {/* Delete Button */}
              <button
                onClick={deleteBulkDays}
                disabled={selectedDays.size === 0}
                className="w-full mt-2 bg-rose-100 text-rose-700 p-3 rounded-xl font-bold hover:bg-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Удалить выбранные
              </button>
            </div>

            {/* Save to Cloud */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/50">
              <button
                onClick={onSaveToCloud}
                disabled={isSaving}
                className="w-full bg-emerald-600 text-white p-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                {isSaving ? 'Сохранение...' : 'Сохранить в облако'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};