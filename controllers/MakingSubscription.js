import moment from "moment";
import { pool } from '../db.js';
const conn = pool.promise();

async function MakingSubscription(telegram_id) {
    const currentData = moment().format('YYYY-MM-DD');
    const nextMonthDate = moment().add(1, 'months').format('YYYY-MM-DD');

    await conn.execute(`UPDATE User SET start_sub = '${currentData}' WHERE telegram_id = ${telegram_id}`);
    await conn.execute(`UPDATE User SET end_sub = '${nextMonthDate}' WHERE telegram_id = ${telegram_id}`);
}

export {MakingSubscription}