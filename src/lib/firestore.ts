import {
  DocumentData,
  DocumentReference,
  FirestoreDataConverter,
  getDoc,
  getDocs,
  onSnapshot,
  Query,
  SnapshotOptions,
} from 'firebase/firestore'
import { DependencyList, useEffect, useState } from 'react'

export type WithId<T> = T & { id: string }

const snapshotOptions: SnapshotOptions = { serverTimestamps: 'estimate' }

export const useDocs = <T>(query: Query<T> | null, deps: DependencyList = []) => {
  const [initialized, setInitialize] = useState(false)
  const [values, setValues] = useState<WithId<T>[]>()

  useEffect(() => {
    if (query) {
      const unsubscirbe = onSnapshot(query, (snap) => {
        if (snap.empty) {
          setValues(undefined)
        } else {
          setValues(
            snap.docs.map((doc) => ({
              id: doc.id,
              ...(doc.data(snapshotOptions) as T),
            }))
          )
        }
        if (!initialized) setInitialize(true)
      })
      return unsubscirbe
    } else {
      setValues(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return [values, initialized] as const
}

export const useDoc = <T>(docRef: DocumentReference<T> | null, deps: DependencyList = []) => {
  const [initialized, setInitialize] = useState(false)
  const [value, setValue] = useState<WithId<T>>()

  useEffect(() => {
    if (docRef) {
      const unsubscribe = onSnapshot(docRef, (snap) => {
        if (snap.exists()) {
          setValue({ id: snap.id, ...(snap.data(snapshotOptions) as T) })
        } else {
          setValue(undefined)
        }
        if (!initialized) setInitialize(true)
      })
      return unsubscribe
    } else {
      setValue(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return [value, initialized] as const
}

export const fetchDocs = async <T>(query: Query<T>) => {
  const snap = await getDocs(query)
  if (snap.empty) {
    return undefined
  } else {
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data(snapshotOptions) as T),
    }))
  }
}

export const fetchDoc = async <T>(docRef: DocumentReference<T>) => {
  const snap = await getDoc(docRef)
  if (snap.exists()) {
    return { id: snap.id, ...(snap.data() as T) }
  } else {
    return undefined
  }
}

export const createConvertor = <T>(): FirestoreDataConverter<T> => ({
  toFirestore: (data) => data as DocumentData,
  fromFirestore: (snap, options) => snap.data(options) as T,
})
