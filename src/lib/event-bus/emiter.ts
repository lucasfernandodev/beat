import { EventEmitter } from 'node:events'

export type Events = {
  'pressure.created': {
    patientId: string
  }
}

export const eventBus = new EventEmitter()

