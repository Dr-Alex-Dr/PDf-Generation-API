# PDf-Generation-API

**Проблема:**


Возникает сложность в сортировке и формировании хештегов для платформы Instagram. Требуется собирать данные с аккаунтов Instagram, очищать их от ненужной информации и сортировать хештеги в зависимости от числа подписчиков. Весь этот процесс занимал более 6 часов.

</br>

**Решение:**


Разработал Telegram-бота для автоматизации этой задачи. Теперь вся процедура занимает всего несколько секунд.  

</br>

**Процесс разработки:**

Для успешной реализации проекта в ограниченные сроки, применил стратегию разделения функциональности на две ключевые части. Первую часть, которая требовала меньше времени на разработку и могла быть быстро создана, реализовал с использованием конструктора.

Основную и наиболее сложную задачу – сбор данных с аккаунтов Instagram, их обработку и сортировку хештегов – решил реализовать с использованием Node.js и представить в виде REST API. Такой подход позволил более гибко управлять процессом обработки данных и обеспечить высокую производительность системы. Благодаря этому решению я смог сэкономить около трех дней разработки, что было критически важно для уложения в установленные сроки.

Этот подход также дал возможность легко масштабировать проект в будущем и добавить новые функции.

</br>

**Возможности бота:**

🔎 Автоматический отбор хештегов с более чем 10 подписчиками.

🧹 Очистка файла от лишних слов и мусора.

💎 Предоставление хештегов в наилучшем формате.

♻️ Перемешивание хештегов и предоставление их в удобном формате.

https://t.me/TagShuffleBot

