import type {
  IndexRequestByUserAPIResponse,
  IndexRequestsQuery,
} from '../dtos/requests'
import { api } from './api'

export function useRequestServices() {
  async function index({
    query,
    endpoint,
  }: {
    query: IndexRequestsQuery
    endpoint: string
  }) {
    const response = await api.get<IndexRequestByUserAPIResponse>(endpoint, {
      params: query,
    })
    return response
  }

  return { index }
}
