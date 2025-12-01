import clientPromise from '../lib/mongodb.js';

export default async function handler(req, res) {
  const { key, month, year } = req.query;
  const adminKey = process.env.ADMIN_KEY;
  const userKey = process.env.USER_KEY;

  // Простая авторизация по ключу
  let role = null;
  if (key === adminKey) role = 'admin';
  else if (key === userKey) role = 'user';

  if (!role) {
    return res.status(401).json({ error: 'Неверный ключ доступа' });
  }

  // Валидация месяца и года
  const monthNum = parseInt(month) || 12;
  const yearNum = parseInt(year) || 2025;

  if (monthNum < 1 || monthNum > 12) {
    return res.status(400).json({ error: 'Некорректный месяц' });
  }

  if (yearNum < 2020 || yearNum > 2100) {
    return res.status(400).json({ error: 'Некорректный год' });
  }

  try {
    const client = await clientPromise;
    if (!client) throw new Error('Database connection failed');
    
    const db = client.db('calendar_app');
    const collection = db.collection('schedules');

    // Генерируем ID документа на основе месяца и года
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    const docId = `${monthNames[monthNum - 1]}_${yearNum}`;

    if (req.method === 'GET') {
      const doc = await collection.findOne({ _id: docId });
      return res.status(200).json({ 
        schedule: doc ? doc.data : null, 
        role,
        month: monthNum,
        year: yearNum
      });
    } 
    
    else if (req.method === 'POST') {
      if (role !== 'admin') {
        return res.status(403).json({ error: 'Только админ может сохранять данные' });
      }

      const { schedule } = req.body;
      if (!Array.isArray(schedule)) {
        return res.status(400).json({ error: 'Некорректный формат данных' });
      }

      await collection.updateOne(
        { _id: docId },
        { 
          $set: { 
            data: schedule, 
            updatedAt: new Date(),
            month: monthNum,
            year: yearNum
          } 
        },
        { upsert: true }
      );

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}