import { ScheduleItem, PartnerCode } from './types';

export const PARTNER_NAMES: Record<PartnerCode, string> = {
  'Г': 'Гульнара',
  'А': 'Аида',
  'М.Д.': 'Марина',
  'Ман': 'Маншук'
};

export const SCHEDULE_DATA: ScheduleItem[] = [
  {"date":"2025-12-01","status":"work","location":"Тастак","partner":"Ман"},
  {"date":"2025-12-02","status":"work","location":"Тастак","partner":"А"},
  {"date":"2025-12-03","status":"off"},
  {"date":"2025-12-04","status":"off"},
  {"date":"2025-12-05","status":"work","location":"Сарыарка","partner":"М.Д."},
  {"date":"2025-12-06","status":"work","location":"Сарыарка","partner":"М.Д."},
  {"date":"2025-12-07","status":"work","location":"Тастак","partner":"А"},
  {"date":"2025-12-08","status":"work","location":"Тастак","partner":"Ман"},
  {"date":"2025-12-09","status":"off"},
  {"date":"2025-12-10","status":"off"},
  {"date":"2025-12-11","status":"work","location":"Сарыарка","partner":"Г"},
  {"date":"2025-12-12","status":"work","location":"Сарыарка","partner":"М.Д."},
  {"date":"2025-12-13","status":"work","location":"Тастак","partner":"Ман"},
  {"date":"2025-12-14","status":"work","location":"Тастак","partner":"А"},
  {"date":"2025-12-15","status":"off"},
  {"date":"2025-12-16","status":"off"},
  {"date":"2025-12-17","status":"work","location":"Сарыарка","partner":"М.Д."},
  {"date":"2025-12-18","status":"work","location":"Сарыарка","partner":"М.Д."},
  {"date":"2025-12-19","status":"work","location":"Тастак","partner":"А"},
  {"date":"2025-12-20","status":"work","location":"Тастак","partner":"Ман"},
  {"date":"2025-12-21","status":"off"},
  {"date":"2025-12-22","status":"off"},
  {"date":"2025-12-23","status":"work","location":"Сарыарка","partner":"М.Д."},
  {"date":"2025-12-24","status":"work","location":"Сарыарка","partner":"М.Д."},
  {"date":"2025-12-25","status":"work","location":"Тастак","partner":"Ман"},
  {"date":"2025-12-26","status":"work","location":"Тастак","partner":"А"},
  {"date":"2025-12-27","status":"off"},
  {"date":"2025-12-28","status":"off"},
  {"date":"2025-12-29","status":"work","location":"Сарыарка","partner":"Г"},
  {"date":"2025-12-30","status":"work","location":"Сарыарка","partner":"М.Д."},
  {"date":"2025-12-31","status":"work","location":"Тастак","partner":"А"}
];

export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];