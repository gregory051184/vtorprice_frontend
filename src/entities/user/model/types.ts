export interface IUser {
  id: number,
  first_name: string,
  last_name: string,
  middle_name: string,
  firstName?: string,
  lastName?: string,
  middleName?: string,
  phone: string,
  position: string,
  email?: string,
  status: {
    id: number
    label:string
  },
  image: File | string | null
}
