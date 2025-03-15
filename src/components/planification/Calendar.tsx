import { Week } from '@/app/(dashboard)/planification/page'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Button } from '@mui/material'
import DayColumn from './DayColumn'

// get week number
function getISOWeekNumber(date: any): number {
  const startOfYear: any = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date - startOfYear) / 86400000
  const weekNumber = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7)
  return weekNumber
}
// generateUniqueId function
const generateUniqueId = (originalId: string) => {
  return `${originalId}-${Date.now()}`
}

// Calendar Component
const Calendar = ({
  weeks,
  currentWeekIndex,
  onNextWeek,
  onPrevWeek,
  onResizeHandler,
  duplicateCurrentWeek,
  removeMission
}: {
  weeks: Week[]
  currentWeekIndex: number
  onNextWeek: () => void
  onPrevWeek: () => void
  onResizeHandler: (missionId: string, newEndDate: string) => void
  duplicateCurrentWeek: () => void
  removeMission: (missionId: string) => void
}) => {
  const currentWeek = weeks[currentWeekIndex]
  const duplicatedWeeks = currentWeek.duplicates || []

  // Get the current date of the first day of the current week
  const currentDate = new Date(currentWeek.days[0].date)

  // Get the week number
  const weekNumber = getISOWeekNumber(currentDate)
  // Format the current month and year
  const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(currentDate)
  const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1)
  const year = currentDate.getFullYear()

  const generateDndId = (day: any) => {
    return 'duplicated-' + generateUniqueId(day.date) + '-' + day.date
  }
  return (
    <div className='p-4 shadow rounded-lg  mx-auto' id='calendar'>
      <div className='flex justify-between mb-4'>
        <Button
          onClick={onPrevWeek}
          aria-label='Précédente'
          size='small'
          color='secondary'
          variant='text'
          className='transition-colors rounded-full p-2'
        >
          <i className='tabler-chevron-left' />
        </Button>
        <h2 className='text-xl font-semibold'>
          {`${capitalizedMonthName} ${year}`} - S{weekNumber}
        </h2>
        <Button
          onClick={onNextWeek}
          aria-label='Prochaine'
          size='small'
          color='secondary'
          variant='text'
          className='transition-colors rounded-full p-2'
        >
          <i className='tabler-chevron-right' />
        </Button>
      </div>
      <PerfectScrollbar
        options={{ suppressScrollX: false, suppressScrollY: false, useBothWheelAxes: true }}
        className=' mx-auto'
      >
        <div className='max-w-full max-h-[40rem]'>
          {/* Render the current week */}
          <div>
            <div className='flex'>
              {currentWeek.days.map(day => (
                <DayColumn
                  key={day.date}
                  day={day}
                  onResizeHandler={onResizeHandler}
                  removeMission={removeMission}
                  dndId={generateDndId(day)}
                />
              ))}
            </div>
          </div>

          {/* Render the duplicated weeks */}
          {duplicatedWeeks.map((week, index) => (
            <div key={`duplicated-week-${index}`}>
              <div className='flex'>
                {week.days.map(day => (
                  <DayColumn
                    key={day.date}
                    day={day}
                    onResizeHandler={onResizeHandler}
                    isDuplicated={true}
                    removeMission={removeMission}
                    dndId={generateDndId(day)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </PerfectScrollbar>
      <div className='flex justify-end mt-4'>
        <Button
          onClick={duplicateCurrentWeek}
          aria-label='Ajouter une ligne'
          size='small'
          color='secondary'
          variant='contained'
        >
          Ajouter une ligne
        </Button>
      </div>
    </div>
  )
}

export default Calendar
