import { pool } from '../db.js';
import 'dotenv/config';
import moment from 'moment';

const conn = pool.promise();

async function AuthenticationMiddleware(ctx, next) {
    const [isUser] = await conn.execute(`SELECT * FROM User WHERE telegram_id = ${ctx.from.id}`)

    if (isUser.length !== 0) {
        next()
        console.log('Пользователь уже зарегестрирован')
    }
    else {
        await conn.execute(`INSERT INTO User (telegram_id, nickname, name, start_sub, end_sub) VALUES(?,?,?,?,?)`, [
            ctx.from.id,
            ctx.from.username, 
            ctx.from.first_name,
            moment().format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD')
        ])
        console.log('Пользователь зарегестрирован')
        next()
    } 
}

export { AuthenticationMiddleware }