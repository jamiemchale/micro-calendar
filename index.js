require('dotenv').config()

const fetch = require('node-fetch')
const { json } = require('micro')

const getCalendar = async () => {
  const result = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${process.env.CALENDAR}/events?timeMin=${(new Date()).toISOString()}&orderBy=startTime&singleEvents=true&key=${process.env.SECRET}`)
  const json = await result.json();
  return json.items ? json.items.map(({ summary, start, end, description, location }) => ({ summary, start, end, description, location })) : []
}

const handler = async (req, res) => {
  const events = await getCalendar()
  return events
}

module.exports = handler
