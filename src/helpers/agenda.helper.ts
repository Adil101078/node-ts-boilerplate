import '@core/declarations'
import Agenda from 'agenda/es'

let agenda = null

class AgendaHelper {
  constructor() {
    if (!agenda) {
      agenda = new Agenda({
        defaultConcurrency: 10,
        defaultLockLimit: 10,
      })
      agenda.database(
        App.Config.DB_CONNECTION_STRING,
        'AgendaJobs',
        App.Config.DB_CONNECTION_OPTIONS
      )
    }
  }

  Get() {
    return agenda
  }
}

export default new AgendaHelper()
