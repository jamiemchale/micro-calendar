require('dotenv').config()

const cors = require('micro-cors')()
const fetch = require('node-fetch')
const { json } = require('micro')
const Cacheman = require('cacheman')
const cache = new Cacheman('googlecalendar', { ttl: 604800 })

const getCalendar = async () => {
  const result = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${process.env.CALENDAR}/events?timeMin=${(new Date()).toISOString()}&orderBy=startTime&singleEvents=true&key=${process.env.SECRET}`)
  const json = await result.json();
  return json.items ? json.items.map(({ summary, start, end, description, location }) => ({ summary, start, end, description, location })) : []
}

const handler = async (req, res) => {
  if (req.method  != 'POST') {
    const cachedEvents = await cache.get(`googlecalendar_${process.env.CALENDAR}`)
    if (cachedEvents) return cachedEvents
  }

  const events = await getCalendar()
  await cache.set(`googlecalendar_${process.env.CALENDAR}`, events)
  return events
}

module.exports = cors(handler)
