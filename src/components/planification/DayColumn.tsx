import type { Day, Mission } from '@/app/(dashboard)/planification/page'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import MissionItem from './MissionItem'

// Day Column Component
const DayColumn = ({
  day,
  onResizeHandler,
  isDuplicated = false,
  removeMission,
  dndId
}: {
  day: Day
  onResizeHandler: (missionId: string, newEndDate: string) => void
  isDuplicated?: boolean
  removeMission: (missionId: string) => void
  dndId: string
}) => {
  // const dndId = !isDuplicated ? day.date : 'duplicated-' + generateUniqueId(day.date) + '-' + day.date
  const { setNodeRef, isOver } = useDroppable({
    id: dndId
  })
  // Get the day name from the date
  const dayName = new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'long' })
  const capitalizedDayName = dayName.charAt(0).toUpperCase() + dayName.slice(1)

  return (
    <div className='flex-1 pt-1 border border-spacing-0.5 max-w-[10.5rem]' ref={setNodeRef}>
      {!isDuplicated && (
        <div className='border-b'>
          <h3 className='font-semibold p-1 rounded text-center'>
            {capitalizedDayName} <br />
          </h3>
          <div className='p-2 pt-0 text-slate-400 dark:text-gray-600 text-center rounded-lg font-extralight'>
            {day.date}
          </div>
        </div>
      )}
      <div className='min-w-[10.5rem] max-w-[10.5rem] pt-2'>
        {day.missions.length ? (
          <SortableContext
            items={[...day.missions.map((mission: Mission) => mission.id)]}
            strategy={verticalListSortingStrategy}
          >
            {day.missions.map((mission: Mission) => (
              <MissionItem
                key={`mission-${mission.id}-${day.date}`}
                mission={mission}
                dayDate={day.date}
                isResizable={true}
                onResizeHandler={onResizeHandler}
                removeMission={removeMission}
                isOver={isOver}
              />
            ))}
          </SortableContext>
        ) : (
          <div className='p-2 py-5 text-slate-400 dark:text-gray-600 text-center rounded-lg font-extralight'></div>
        )}
      </div>
    </div>
  )
}

export default DayColumn
