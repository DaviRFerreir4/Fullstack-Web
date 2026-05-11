import { useState } from 'react'
import type { IndexRequestsQuery, UserRequest } from '../../dtos/requests'
import type { SessionAPIResponse } from '../../dtos/user'
import type { DialogActions, TPagination } from '../../types/utils'
import { useRequestServices } from '../../services/requests'

interface UseRequestListLogicProps {
  session: SessionAPIResponse
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>
  setCurrentAction: React.Dispatch<
    React.SetStateAction<{
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
  const { index } = useRequestServices()

  const [requests, setRequests] = useState<UserRequest[] | null>(null)
  const [pagination, setPagination] = useState<TPagination | null>(null)

  const [technicianRequests, setTechnicianRequests] = useState<{
    opened?: UserRequest[]
    in_progress?: UserRequest[]
    closed?: UserRequest[]
  } | null>(null)
  const [technicianPagination, setTechnicianPagination] = useState<{
    opened?: TPagination
    in_progress?: TPagination
    closed?: TPagination
  } | null>(null)

  async function fetchRequests({ query = {} }: { query?: IndexRequestsQuery }) {
    const isAdminUser = session?.user.role === 'admin'
    const isTechnicianUser = session?.user.role === 'technician'

    try {
      const response = await index({
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

  return {
    requests,
    pagination,
    technicianRequests,
    technicianPagination,
    fetchRequests,
  }
}
