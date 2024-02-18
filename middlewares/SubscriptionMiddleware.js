import moment from "moment";
import { pool } from '../db.js';

const conn = pool.promise();

async function SubscriptionMiddleware(ctx, next) {
    const [checkSub] = await conn.execute(`SELECT * FROM User WHERE telegram_id = ${ctx.from.id}`)

    const currentData = moment(moment().format('YYYY-MM-DD'));
    const endData = moment(checkSub[0].end_sub); 

    // если текущая дата больше даты окончания, то false иначе true
    if(currentData.isBefore(endData)) {
        ctx.customData = true;
        console.log('Подписка есть')
        next()
    } else {
        ctx.customData = false;
        console.log('Подписки нет')
        next()
    }


}

export {SubscriptionMiddleware};