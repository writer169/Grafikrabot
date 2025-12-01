export type WorkLocation = 'Тастак' | 'Сарыарка';
export type WorkStatus = 'work' | 'off';
export type PartnerCode = 'Ман' | 'А' | 'М.Д.' | 'Г';

export interface ScheduleItem {
  date: string;
  status: WorkStatus;
  location?: WorkLocation;
  partner?: PartnerCode;
}

export interface DayStats {
  workDays: number;
  offDays: number;
  tastakDays: number;
  saryarkaDays: number;
}