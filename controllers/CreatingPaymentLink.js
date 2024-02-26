import 'dotenv/config';
import axios from "axios";

async function CreatingPaymentLink(ctx) {
	return new Promise((resolve, reject) => {
		const linkform = 'https://anastasiia-navi.payform.ru'

		const data = {
			"do": "link",
			"order_id": `${ctx.from.id}-${Date.now()}`,
			"products": [
				{
					"name": "Сервис по автоматизации подбора хештегов",
					"price": "50.00",
					"quantity": "1",
				}
			]
		}
		
		axios.get(linkform, {params: data})
		.then(res => {
			resolve(res.data)
		})
		.catch(err => {
			reject(err)
		})
	})
}


export { CreatingPaymentLink }

