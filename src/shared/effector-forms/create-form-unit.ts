import { createStore, createEvent, Domain, Store, Event } from "effector"

type CreateStoreParams<Value> = {
  init: Value
  domain?: Domain
  existing?: Store<Value>
}

function store<Value>(
    { init, domain, existing }: CreateStoreParams<Value>,
    effectorData?: any
) {
    return createStore(init, effectorData)
}

type CreateEventParams<Value> = {
  domain?: Domain
  existing?: Event<Value>
}

function event<Value>({ domain, existing }: CreateEventParams<Value>) {
    return createEvent<Value>()
}

export const createFormUnit = {
    store,
    event,
}
