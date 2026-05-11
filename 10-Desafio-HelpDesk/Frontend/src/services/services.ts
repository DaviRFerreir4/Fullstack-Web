import type {
  IndexServiceAPIResponse,
  IndexServiceQuery,
} from '../dtos/services'
import { api } from './api'

export function useServiceServices() {
  async function index(query: IndexServiceQuery) {
    const response = await api.get<IndexServiceAPIResponse>('/services', {
      params: query,
    })
    return response
  }

  return { index }
}
