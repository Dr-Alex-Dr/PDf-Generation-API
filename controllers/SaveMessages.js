import { pool } from '../db.js';
import 'dotenv/config';
import moment from 'moment';

const conn = pool.promise();

async function SaveMessages(message, telegram_id) {
    await conn.execute(`INSERT INTO Messages (message, date, telegram_id) VALUES (?, ?, ?)`, [
        message,
        moment().format('YYYY-MM-DD HH:mm:ss'),
        telegram_id
    ]);
}

export {SaveMessages}
