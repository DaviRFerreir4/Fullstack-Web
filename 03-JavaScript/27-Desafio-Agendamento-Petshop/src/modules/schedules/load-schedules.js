import { createScheduleElements } from './create-schedule-elements'
import { schedulesFilteredByDay } from '../../services/schedules-filtered-by-day'

export async function loadSchedules(dateFilter) {
  const schedules = await schedulesFilteredByDay(dateFilter)

  // console.log(schedules)

  createScheduleElements(schedules)
}
