//! @ts-nocheck
import { matchFilter, matchFilters } from '@nostrband/nostr-tools'
import { dbi } from './db'
import { getEventAddr } from './nostr'
// eslint-disable-next-line
// @ts-ignore
import { NostrEvent } from '@nostrband/ndk'
import { Kinds } from './const/kinds'
import { onBeforeNewEvent } from './sync'

const events: NostrEvent[] = []
const eventById = new Map<string, number>()
const eventsByKind = new Map<string, number[]>()
const eventsByAuthor = new Map<string, number[]>()
const eventsByAuthorKind = new Map<string, number[]>()
const eventsByAddr = new Map<string, number[]>()
// eslint-disable-next-line
const subs = new Map<string, any>()

export function addLocalRelayEvent(e: NostrEvent) {
  if (eventById.has(e.id)) return false

  //  console.log("addLocalRelayEvent kind", e.kind, "id", e.id, "pubkey", e.pubkey)
  onBeforeNewEvent(e)

  const index = events.length

  const put = (map: Map<string, number[]>, key: string, replace?: boolean) => {
    if (!map.has(key)) map.set(key, [])
    const a = map.get(key)
    if (replace && a && a.length > 0) {
      const oldIndex = a[0]
      const old = events[oldIndex]
      if (old.created_at < e.created_at) {
        a[0] = index
      }
    } else {
      a?.push(index)
    }
  }

  put(eventsByKind, e.kind + '')
  put(eventsByAuthor, e.pubkey)
  const replaceAuthorKind = e.kind === Kinds.META || e.kind === Kinds.CONTACT_LIST
  put(eventsByAuthorKind, e.kind + ':' + e.pubkey, replaceAuthorKind)
  const replaceAddr =
    e.kind === Kinds.META ||
    e.kind === Kinds.CONTACT_LIST ||
    (e.kind >= 10000 && e.kind < 20000) ||
    (e.kind >= 30000 && e.kind < 40000)
  put(eventsByAddr, getEventAddr(e), replaceAddr)
  eventById.set(e.id, index)
  events.push(e)
  return true
}

export class LocalRelayClient {
  // eslint-disable-next-line
  _subs: Set<any>
  // eslint-disable-next-line
  _onSend: (msg: any) => void
  // eslint-disable-next-line
  constructor(onSend: (msg: any) => void) {
    // eslint-disable-next-line
    this._subs = new Set<any>()
    this._onSend = onSend
  }
  cleanup() {
    for (const subId of this._subs) {
      this.removeSub(subId)
    }
  }
  // eslint-disable-next-line
  addSub(subId: string, filters: any) {
    subs.set(subId, { instance: this, filters })
    this._subs.add(subId)
  }
  removeSub(subId: string) {
    subs.delete(subId)
    this._subs.delete(subId)
  }
  // eslint-disable-next-line
  send(message: any) {
    this._onSend(message)
  }
  handle(message: string) {
    try {
      message = JSON.parse(message)
    } catch (e) {
      this.send(['NOTICE', '', 'Unable to parse message'])
    }

    let verb: string = ''
    // eslint-disable-next-line
    let payload: Array<any> = []
    try {
      ;[verb, ...payload] = message
    } catch (e) {
      this.send(['NOTICE', '', 'Unable to read message'])
    }

    // eslint-disable-next-line
    // @ts-ignore
    const handler = this[`on${verb}`]

    if (handler) {
      handler.call(this, ...payload)
    } else {
      this.send(['NOTICE', '', 'Unable to handle message'])
    }
  }
  onCLOSE(subId: string) {
    this.removeSub(subId)
  }
  // eslint-disable-next-line
  onREQ(subId: string, ...filters: any[]) {
    const start = Date.now()
    console.log(start, 'REQ', subId, filters)

    this.addSub(subId, filters)

    const resultFilters = new Map<string, Set<number>>()
    const results: NostrEvent[] = []

    // eslint-disable-next-line
    const matchAppend = (filter: any, filterIndex: number, e: NostrEvent) => {
      if (!e) return

      try {
        if (!matchFilter(filter, e)) return
      } catch {
        console.log('invalid event?', e)
        return
      }

      if (!resultFilters.has(e.id)) {
        resultFilters.set(e.id, new Set())
        results.push(e)
      }
      resultFilters.get(e.id)?.add(filterIndex)
    }

    for (let filterIndex = 0; filterIndex < filters.length; filterIndex++) {
      const filter = filters[filterIndex]
      if (filter.ids?.length) {
        for (const id of filter.ids) {
          const index = eventById.get(id)
          if (index === undefined) continue
          const e = events[index]
          matchAppend(filter, filterIndex, e)
        }
      } else if (filter.kinds?.length && filter.authors?.length) {
        for (const kind of filter.kinds) {
          for (const pubkey of filter.authors) {
            const key = kind + ':' + pubkey
            const indexes = eventsByAuthorKind.get(key)
            if (!indexes) continue
            for (const i of indexes) {
              const e = events[i]
              matchAppend(filter, filterIndex, e)
            }
          }
        }
      } else if (filter.kinds?.length) {
        for (const kind of filter.kinds) {
          const key = kind + ''
          const indexes = eventsByKind.get(key)
          if (!indexes) continue
          for (const i of indexes) {
            const e = events[i]
            matchAppend(filter, filterIndex, e)
          }
        }
      } else {
        for (const e of events) matchAppend(filter, filterIndex, e)
      }
    }

    //     for (const event of events) {
    //       if (matchFilters(filters, event)) {
    // //        console.log('match', subId, event)

    //         this.send(['EVENT', subId, event])
    //       } else {
    // //        console.log('miss', subId, event)
    //       }
    //     }

    // sort all results by timestamp
    results.sort((a, b) => b.created_at - a.created_at)

    // send as much as each filter-limit required
    const filterCounts = new Array(filters.length).fill(0)
    let sent = 0
    for (const e of results) {
      const filterIndexes = resultFilters.get(e.id)
      if (!filterIndexes) throw new Error('Impossible')
      //      console.log("event", e.id, "filterIndexes", filterIndexes)

      // check if this event fits one of it's matching filters' limits
      let send = false
      for (const filterIndex of filterIndexes) {
        const filter = filters[filterIndex]
        const limit = Math.min(filter.limit || 3000, 3000)
        const count = filterCounts[filterIndex]
        if (count < limit) {
          filterCounts[filterIndex]++
          send = true
        }
      }

      if (send) {
        this.send(['EVENT', subId, e])
        sent++
      }
    }

    console.log(Date.now(), 'REQ EOSE done in ', Date.now() - start, 'sent', sent, 'results', results.length)

    this.send(['EOSE', subId])
  }
  onEVENT(event: NostrEvent) {
    const added = addLocalRelayEvent(event)

    console.log('EVENT', event, true)

    this.send(['OK', event.id])

    if (!added) return

    for (const [subId, { instance, filters }] of subs.entries()) {
      if (matchFilters(filters, event)) {
        console.log('new match', subId, event)

        instance.send(['EVENT', subId, event])
      }
    }
  }
}

export async function initLocalRelay() {
  const start = Date.now()
  const dbEvents = await dbi.listLocalRelayEvents()
  for (const e of dbEvents) addLocalRelayEvent(e)
  console.log('local events', events.length, 'loaded in', Date.now() - start, 'ms')
}

export function getEventsCount() {
  return events.length
}

export function getEventStats() {
  const kinds = new Map<number, number>()
  const pubkeys = new Map<number, number>()
  for (const e of events) {
    const k = (kinds.get(e.kind) || 0) + 1
    const p = (pubkeys.get(e.pubkey) || 0) + 1
    kinds.set(e.kind, k)
    pubkeys.set(e.pubkey, p)
  }

  return {
    kinds: [...kinds.entries()],
    pubkeys: [...pubkeys.entries()]
  }
}
