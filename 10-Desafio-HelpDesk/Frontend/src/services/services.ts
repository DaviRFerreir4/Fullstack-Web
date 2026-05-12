import type {
  CreateServiceAPIResponse,
  CreateServiceBody,
  IndexServiceAPIResponse,
  IndexServiceQuery,
  PatchServiceIsActiveAPIResponse,
  PatchServiceIsActiveBody,
  PutServiceAPIResponse,
  PutServiceBody,
} from '../dtos/services'
import { api } from './api'

export function useServiceServices() {
  async function indexServices({ query }: { query: IndexServiceQuery }) {
    const { title, is_active, idsToIgnore, gt, lt, page, perPage } = query

    const response = await api.get<IndexServiceAPIResponse>('/services', {
      params: { title, is_active, idsToIgnore, gt, lt, page, perPage },
    })

    return response
  }

  async function createService({ body }: { body: CreateServiceBody }) {
    const { title, value } = body

    const response = await api.post<CreateServiceAPIResponse>('/services', {
      title,
      value,
    })

    return response
  }

  async function putService({
    id,
    body,
  }: {
    id: string
    body: PutServiceBody
  }) {
    const { title, value } = body

    const response = await api.put<PutServiceAPIResponse>(`/services/${id}`, {
      title,
      value,
    })

    return response
  }

  async function patchServiceIsActive({
    id,
    body,
  }: {
    id: string
    body: PatchServiceIsActiveBody
  }) {
    const { isActive } = body

    const response = await api.patch<PatchServiceIsActiveAPIResponse>(
      `/services/${id}/isActive`,
      { isActive }
    )

    return response
  }

  return { indexServices, createService, putService, patchServiceIsActive }
}
