export let creteSumBtn = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Оформить подписку', callback_data: 'subscribe' }],
      ],
    },
  }

export function downloadFileButton(url) {
    return {
        reply_markup: {
        inline_keyboard: [
            [
            {
                text: '📥 Скачать файл ',
                url
            }
            ]
        ]
        }
    }
}

export function createSubButton(url) {
  return {
    reply_markup: {
    inline_keyboard: [
        [
        {
            text: 'Оформить подписку',
            url
        }
        ]
    ]
    }
}
}

