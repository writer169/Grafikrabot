import React, { useState, useEffect, useMemo } from 'react';
import { SCHEDULE_DATA as DEFAULT_SCHEDULE, WEEKDAYS } from './constants';
import { ScheduleItem } from './types';
import { DayCell } from './components/DayCell';
import { DetailsModal } from './components/DetailsModal';
import { Stats } from './components/Stats';
import { AdminView } from './components/AdminView';
import { BulkEditPage } from './components/BulkEditPage';
import { InstallPrompt } from './components/InstallPrompt';
import { 
  getMonthStats, 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  formatMonth,
  getNextMonth,
  getPrevMonth,
  isToday as checkIsToday
} from './utils';
import { Calendar as CalendarIcon, Lock, Loader2, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';

// Fallback logic for when API is not available
const getInitialSchedule = () => DEFAULT_SCHEDULE;

const App: React.FC = () => {
  // Date State
  const [currentYear, setCurrentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(12);

  // Routing & Auth State
  const [accessKey, setAccessKey] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'calendar' | 'bulk-edit'>('calendar');

  // Data State
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // UI State
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedData, setSelectedData] = useState<ScheduleItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch data when month/year changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const key = params.get('key') || params.get('k');
    
    if (!key) {
      setError("Отсутствует ключ доступа");
      setIsLoading(false);
      return;
    }

    setAccessKey(key);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/schedule?key=${key}&month=${currentMonth}&year=${currentYear}`);
        
        if (res.status === 401 || res.status === 403) {
           setError("Неверный ключ доступа");
           setIsLoading(false);
           return;
        }

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setUserRole(data.role);
        
        // If DB has data for this month, use it; otherwise empty array
        if (data.schedule && data.schedule.length > 0) {
          setSchedule(data.schedule);
        } else if (currentYear === 2025 && currentMonth === 12) {
          // Only use fallback for Dec 2025
          setSchedule(getInitialSchedule());
        } else {
          setSchedule([]);
        }
        
        setHasUnsavedChanges(false);
      } catch (err) {
        console.error("API Fetch Error:", err);
        console.warn("Using local fallback data");
        
        if (currentYear === 2025 && currentMonth === 12) {
          setSchedule(getInitialSchedule());
        } else {
          setSchedule([]);
        }
        
        setError("Ошибка подключения к серверу");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentMonth, currentYear]);

  // Derived State
  const scheduleMap = useMemo(() => {
    const map: Record<string, ScheduleItem> = {};
    schedule.forEach(item => {
      map[item.date] = item;
    });
    return map;
  }, [schedule]);

  const stats = useMemo(() => getMonthStats(schedule), [schedule]);

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const startEmptyDays = getFirstDayOfMonth(currentYear, currentMonth);

  // Navigation
  const goToNextMonth = () => {
    if (hasUnsavedChanges) {
      if (!confirm('У вас есть несохраненные изменения. Продолжить без сохранения?')) {
        return;
      }
    }
    const next = getNextMonth(currentYear, currentMonth);
    setCurrentYear(next.year);
    setCurrentMonth(next.month);
  };

  const goToPrevMonth = () => {
    if (hasUnsavedChanges) {
      if (!confirm('У вас есть несохраненные изменения. Продолжить без сохранения?')) {
        return;
      }
    }
    const prev = getPrevMonth(currentYear, currentMonth);
    setCurrentYear(prev.year);
    setCurrentMonth(prev.month);
  };

  // Logic Helpers
  const handleDayClick = (day: number, data?: ScheduleItem) => {
    setSelectedDay(day);
    setSelectedData(data || null);
    setIsModalOpen(true);
  };

  const handleUpdateSchedule = (newSchedule: ScheduleItem[]) => {
    setSchedule(newSchedule);
    setHasUnsavedChanges(true);
  };

  const handleSaveToCloud = async () => {
    if (!accessKey) return;
    setIsSaving(true);
    try {
        const res = await fetch(`/api/schedule?key=${accessKey}&month=${currentMonth}&year=${currentYear}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ schedule })
        });
        
        if (!res.ok) throw new Error("Failed to save");
        
        setHasUnsavedChanges(false);
        alert("✅ Данные успешно сохранены!");
    } catch (e) {
        alert("Ошибка при сохранении!");
        console.error(e);
    } finally {
        setIsSaving(false);
    }
  };

  // Render Logic
  if (isLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-indigo-600 gap-4">
            <Loader2 className="animate-spin w-10 h-10" />
            <p className="font-medium">Загрузка данных...</p>
        </div>
    );
  }

  if (error && !accessKey) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm text-center">
                <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Lock size={32} />
                </div>
                <h1 className="text-xl font-bold text-slate-800 mb-2">Доступ запрещен</h1>
                <p className="text-slate-500">{error}</p>
                <p className="text-xs text-slate-400 mt-6">Проверьте ссылку или обратитесь к администратору</p>
            </div>
        </div>
    );
  }

  // Bulk Edit Page
  if (currentPage === 'bulk-edit' && userRole === 'admin') {
    return (
      <BulkEditPage
        schedule={schedule}
        currentYear={currentYear}
        currentMonth={currentMonth}
        onUpdateSchedule={handleUpdateSchedule}
        onSaveToCloud={handleSaveToCloud}
        onBack={() => setCurrentPage('calendar')}
        isSaving={isSaving}
      />
    );
  }

  // Main Calendar Page
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-200/30 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-indigo-600 mb-2">
            <CalendarIcon size={20} />
            <span className="text-sm font-semibold uppercase tracking-widest">Рабочий график</span>
          </div>
          
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goToPrevMonth}
              className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
              title="Предыдущий месяц"
            >
              <ChevronLeft size={24} className="text-slate-600" />
            </button>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight text-center">
              {formatMonth(currentYear, currentMonth)} <span className="text-indigo-600">{currentYear}</span>
            </h1>
            
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-slate-200 rounded-xl transition-colors"
              title="Следующий месяц"
            >
              <ChevronRight size={24} className="text-slate-600" />
            </button>
          </div>

          {/* Admin Controls */}
          {userRole === 'admin' && (
            <div className="flex items-center justify-between">
              <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                Administrator
              </div>
              <button
                onClick={() => setCurrentPage('bulk-edit')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg text-sm"
                title="Массовое редактирование"
              >
                <Edit3 size={16} />
                <span className="hidden sm:inline">Массовое редактирование</span>
                <span className="sm:hidden">Редактор</span>
              </button>
            </div>
          )}
        </header>

        {/* ADMIN VIEW */}
        {userRole === 'admin' ? (
            <AdminView 
                schedule={schedule}
                scheduleMap={scheduleMap}
                stats={stats}
                currentYear={currentYear}
                currentMonth={currentMonth}
                onUpdateSchedule={handleUpdateSchedule}
                onSaveToCloud={handleSaveToCloud}
                isSaving={isSaving}
                hasUnsavedChanges={hasUnsavedChanges}
            />
        ) : (
        /* USER VIEW */
        <>
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-2xl shadow-slate-200/50 border border-white/50">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {WEEKDAYS.map(day => (
                        <div key={day} className="text-center">
                            <span className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
                                {day}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                    {Array.from({ length: startEmptyDays }).map((_, i) => (
                        <div key={`empty-${i}`} className="w-full aspect-square" />
                    ))}

                    {Array.from({ length: totalDays }).map((_, i) => {
                        const day = i + 1;
                        const dateStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                        const item = scheduleMap[dateStr];
                        const isToday = checkIsToday(currentYear, currentMonth, day);

                        return (
                            <DayCell 
                                key={day}
                                day={day}
                                data={item}
                                isToday={isToday}
                                onClick={handleDayClick}
                            />
                        );
                    })}
                </div>
            </div>

            <Stats stats={stats} />
        </>
        )}

        <DetailsModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            day={selectedDay}
            data={selectedData}
        />

      </div>
      
      {/* PWA Install Prompt */}
      <InstallPrompt />
    </div>
  );
};

export default App;