import type {
  CreateRequestAPIResponse,
  CreateRequestBody,
  CreateRequestServiceAPIResponse,
  CreateRequestServiceBody,
  IndexRequestAPIResponse,
  IndexRequestsQuery,
  PatchRequestStatusAPIResponse,
  PatchRequestStatusBody,
  ShowRequestAPIResponse,
} from '../dtos/requests'
import { api } from './api'

export function useRequestServices() {
  async function indexRequests({
    query,
    endpoint,
  }: {
    query: IndexRequestsQuery
    endpoint: string
  }) {
    const { status, page, perPage } = query

    const response = await api.get<IndexRequestAPIResponse>(endpoint, {
      params: { status, page, perPage },
    })

    return response
  }

  async function showRequest({ id }: { id: string }) {
    const response = await api.get<ShowRequestAPIResponse>(`/requests/${id}`)

    return response
  }

  async function createRequest({ body }: { body: CreateRequestBody }) {
    const { title, description, serviceId, assignedTo } = body

    const response = await api.post<CreateRequestAPIResponse>('/requests', {
      title,
      description,
      serviceId,
      assignedTo,
    })

    return response
  }

  async function createRequestService({
    id,
    body,
  }: {
    id: number
    body: CreateRequestServiceBody
  }) {
    const { serviceId } = body

    const response = await api.post<CreateRequestServiceAPIResponse>(
      `/requests/${id}`,
      { serviceId }
    )

    return response
  }

  async function patchRequestStatus({
    id,
    body,
  }: {
    id: string
    body: PatchRequestStatusBody
  }) {
    const { status } = body

    const response = await api.patch<PatchRequestStatusAPIResponse>(
      `/requests/${id}/status`,
      { status }
    )

    return response
  }

  return {
    indexRequests,
    showRequest,
    createRequest,
    createRequestService,
    patchRequestStatus,
  }
}
