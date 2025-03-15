import type { Mission } from '@/app/(dashboard)/planification/page'
import { Button } from '@mui/material'
import PerfectScrollbar from 'react-perfect-scrollbar'
import MissionItem from './MissionItem'

// Mission List Component
const MissionList = ({
  missions,
  removeMission,
  addMission
}: {
  missions: Mission[]
  removeMission: (missionId: string) => void
  addMission: () => void
}) => {
  return (
    <div className='p-4 px-1 shadow rounded-lg'>
      <div className='flex justify-between'>
        <h3 className='font-bold mb-4 px-2'>Missions</h3>
        <Button className='cursor-pointer float-right ' size='small' color='secondary' onClick={() => addMission()}>
          <span className='tabler-plus h-4 w-4'></span>
        </Button>
      </div>

      <PerfectScrollbar
        options={{ suppressScrollX: true, useBothWheelAxes: false, swipeEasing: true, wheelSpeed: 0.5 }}
        style={{ overflowY: 'visible' }}
      >
        <div className='max-h-60 p-4 flex flex-wrap gap-1'>
          {missions.map(mission => (
            <MissionItem
              key={mission.id}
              mission={mission}
              dayDate={'mission-list'}
              isResizable={false}
              onResizeHandler={() => {}}
              removeMission={removeMission}
              isOver={false}
            />
          ))}
        </div>
      </PerfectScrollbar>
    </div>
  )
}

export default MissionList
