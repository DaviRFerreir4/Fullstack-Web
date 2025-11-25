import dayjs from 'dayjs'
import { api } from './api-config'

export async function schedulesFilteredByDay(dateFilter) {
  try {
    const schedulesResponse = await api.get('/schedules')

    // console.log(schedulesResponse)

    return schedulesResponse.data
      .filter((schedule) => {
        return (
          dayjs(schedule.date).hour(0).format() === dayjs(dateFilter).format()
        )
      })
      .sort((schedule, nextSchedule) => {
        if (dayjs(schedule.date).isBefore(dayjs(nextSchedule.date))) {
          return -1
        } else if (dayjs(schedule.date).isAfter(dayjs(nextSchedule.date))) {
          return 1
        }
        return 0
      })
  } catch (error) {
    alert(error)
  }
}
