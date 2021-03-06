import { collection, doc } from 'firebase/firestore'

import { db } from '@/firebaseApp'
import { WithId } from '@/lib/firestore'
import { createConvertor } from '@/lib/firestore'

// schema
export type AdminData = {
  email: string
}
export type Admin = WithId<AdminData>

// ref
const adminConvertor = createConvertor<AdminData>()

export const adminsRef = () => {
  return collection(db, 'admins').withConverter(adminConvertor)
}
export const adminRef = ({ adminId }: { adminId: string }) => {
  return doc(db, adminsRef().path, adminId).withConverter(adminConvertor)
}
