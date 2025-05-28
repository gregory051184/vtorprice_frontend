export interface ILogisticsOffer {
  id: number
  isDeleted: boolean
  application: Application
  contractor: Contractor
  chat: Chat
  createdAt: string
  name: string
  status: Status2
  amount: number
  shippingDate: string
  logist: number
}

export interface Application {
  id: number
  isDeleted: boolean
  createdAt: string
  shippingAddress: string
  deliveryAddress: string
  sender: string
  recipient: string
  status: Status
  cargoType: string
  loadingType: LoadingType
  weight: number
  loadingHours: string
  weekendWork: boolean
  comment: string
  objectId: number
  createdBy: number
  contentType: number
}

export interface Status {
  id: number
  label: string
}

export interface LoadingType {
  id: number
  label: string
}

export interface Contractor {
  id: number
  isDeleted: boolean
  documents: any[]
  createdAt: string
  name: string
  address: string
  contractorType: ContractorType
  transportOwnsCount: number
  createdBy: number
}

export interface ContractorType {
  id: number
  label: string
}

export interface Chat {
  id: number
  isDeleted: boolean
  lastMessage: LastMessage
  unreadCount: number
  createdAt: string
  name: string
}

export interface LastMessage {
  chat: any
  author: Author
  content: string
  isRead: boolean
}

export interface Author {
  email: string
  role: any
}

export interface Status2 {
  id: number
  label: string
}
