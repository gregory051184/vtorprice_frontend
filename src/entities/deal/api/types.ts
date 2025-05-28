export type DealCreateParams = {
  with_nds: boolean,
  price: number,
  is_packing_deduction: boolean,
  packing_deduction_type?: number
  packing_deduction_value?: number
  comment?: string
  weight: number
  weediness: number
  moisture: number
  other_payment_term: string
  supplier_company: number
  buyer_company: number
  application: number
  buyer_pays_shipping: boolean
};
