enum CategoriesAPIEnum {
  Food = 'food',
  Others = 'others',
  Services = 'services',
  Transport = 'transport',
  Accommodation = 'accommodation',
}

type RefundAPIResponse = {
  id: string
  userId: string
  name: string
  category: CategoriesAPIEnum
  amount: number
  filename: string
  user: {
    name: string
  }
}

type RefundPaginationData = {
  refunds: RefundAPIResponse[]
  pagination: {
    page: number
    perPage: number
    totalPages: number
    totalRecords: number
  }
}
