import { useState, type Dispatch, type SetStateAction } from 'react'
import type {
  IndexRequestsQuery,
  Status,
  UserRequest,
} from '../../dtos/requests'
import type { CreateSessionAPIResponse } from '../../dtos/user'
import type { DialogActions, PaginationType } from '../../types/utils'
import { useRequestServices } from '../../services/requests'

interface UseRequestListLogicProps {
  session: CreateSessionAPIResponse
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  setCurrentAction: Dispatch<
    SetStateAction<{
      action: DialogActions
      title: string
      message?: string
      handleAction: (() => void) | ((payload: FormData) => void)
    } | null>
  >
  handleCloseDialog: () => void
}

export function useRequestListLogic({
  session,
  setCurrentAction,
  setOpenDialog,
  handleCloseDialog,
}: UseRequestListLogicProps) {
  const { indexRequests, patchRequestStatus } = useRequestServices()

  const [requests, setRequests] = useState<UserRequest[] | null>(null)
  const [pagination, setPagination] = useState<PaginationType | null>(null)

  const [technicianRequests, setTechnicianRequests] = useState<{
    opened?: UserRequest[]
    in_progress?: UserRequest[]
    closed?: UserRequest[]
  } | null>(null)
  const [technicianPagination, setTechnicianPagination] = useState<{
    opened?: PaginationType
    in_progress?: PaginationType
    closed?: PaginationType
  } | null>(null)

  const [areRequestCardLoading, setAreRequestCardLoading] = useState(false)

  async function fetchRequests({ query = {} }: { query?: IndexRequestsQuery }) {
    const isAdminUser = session?.user.role === 'admin'
    const isTechnicianUser = session?.user.role === 'technician'

    try {
      const response = await indexRequests({
        query,
        endpoint: isAdminUser
          ? '/requests'
          : `/users/${session?.user.id}/requests`,
      })

      if (isTechnicianUser && query?.status) {
        setTechnicianRequests((prev) => ({
          ...prev,
          [query.status as string]: response.data.requests,
        }))

        setTechnicianPagination((prev) => ({
          ...prev,
          [query.status as string]: response.data.pagination,
        }))
      } else {
        setRequests(response.data.requests)

        setPagination(response.data.pagination)
      }
    } catch (error: any) {
      setCurrentAction({
        action: 'failure',
        title: error?.response?.data?.message ?? error.message,
        handleAction: handleCloseDialog,
      })

      setOpenDialog(true)
    }
  }

  async function changeRequestStatus({
    id,
    status,
    callback,
  }: {
    id: number
    status: Status
    callback: () => void
  }) {
    setAreRequestCardLoading(true)
    try {
      const response = await patchRequestStatus({ id, body: { status } })

      if (response.status === 200) {
        callback()
      }
    } catch (error: any) {
      setCurrentAction({
        action: 'failure',
        title: 'Erro ao atualizar o status do chamado',
        message: error?.response?.data?.message ?? error.message,
        handleAction: handleCloseDialog,
      })

      setOpenDialog(true)
    }
  }

  return {
    requests,
    pagination,
    technicianRequests,
    technicianPagination,
    fetchRequests,
    changeRequestStatus,
    areRequestCardLoading,
    setAreRequestCardLoading,
  }
}
