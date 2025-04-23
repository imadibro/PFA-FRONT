import type { IOperation } from '@/@core/utils/types'
import { Car, Fuel, MapPin, RouteIcon as Road, Users } from 'lucide-react'

export function CalendarCard({ operation }: { operation: IOperation }) {
  return (
    <div className='w-full max-w-3xl rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden'>
      <div className='p-4'>
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='font-bold text-lg'>{operation.project.projectCode}</h3>
            <p className='text-sm flex items-center gap-1 mt-1'>
              <MapPin size={14} />
              {operation.site.siteNbr}
            </p>
          </div>
          <span className='inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800'>
            {operation.operationTasks.operationTasksIds.length} tasks
          </span>
        </div>

        <div className='mt-3 flex flex-wrap gap-2'>
          {operation.team.map(member => (
            <span
              key={member.id}
              className='inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700'
            >
              <Users size={12} className='mr-1' />
              {member.name} ({member.role})
            </span>
          ))}
        </div>

        <div className='mt-3 flex gap-3 text-xs'>
          <span className='flex items-center gap-1'>
            <Car size={14} />
            {operation.vehicle.registrationId}
          </span>
          <span className='flex items-center gap-1'>
            <Fuel size={14} />
            {operation.fuelCard.matricule}
          </span>
          <span className='flex items-center gap-1'>
            <Road size={14} />
            {operation.highwayCard.matricule}
          </span>
        </div>
      </div>
    </div>
  )
}
