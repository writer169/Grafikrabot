
import clientPromise from '../lib/mongodb';

export default async function handler(req, res) {
  const { key } = req.query;
  const adminKey = process.env.ADMIN_KEY;
  const userKey = process.env.USER_KEY;

  // Простая авторизация по ключу
  let role = null;
  if (key === adminKey) role = 'admin';
  else if (key === userKey) role = 'user';

  if (!role) {
    return res.status(401).json({ error: 'Неверный ключ доступа' });
  }

  try {
    const client = await clientPromise;
    if (!client) throw new Error('Database connection failed');
    
    const db = client.db('calendar_app'); // Имя базы данных
    const collection = db.collection('schedules');

    // ID документа для Декабря 2025
    const docId = 'dec_2025';

    if (req.method === 'GET') {
      const doc = await collection.findOne({ _id: docId });
      // Если данных нет в базе, возвращаем null (фронт подставит дефолтные)
      return res.status(200).json({ 
        schedule: doc ? doc.data : null, 
        role 
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
        { $set: { data: schedule, updatedAt: new Date() } },
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
