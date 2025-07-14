import type { IEquipe, IOperation } from '@/@core/utils/types'
import { Typography } from '@mui/material'
import { Car, CheckSquare, Fuel, MapPin, RouteIcon as Road, Users } from 'lucide-react'

export function CompactCard({
  operation,
  classNameProps,
  draggable,
  equipe,
  ...props
}: {
  operation?: IOperation
  equipe?: IEquipe
  classNameProps?: string
  draggable?: boolean
  [key: string]: any
}) {
  if (equipe) {
    return (
      <div
        className={`${classNameProps} w-full max-w-xs rounded-lg border border-slate-200 shadow-sm hover:shadow transition-shadow overflow-hidden`}
        draggable={draggable}
        {...props}
      >
        <div className='p-3'>
          <h3 className='font-semibold text-sm truncate'>{equipe?.name}</h3>

          <div className='mt-2 space-y-1 text-xs'>
            <div className='flex items-center gap-1 text-slate-600'>
              <Users size={12} />
              {equipe?.members?.length} members
            </div>

            <div className='flex items-center justify-between'>
              <span className='flex items-center gap-1 text-slate-600'>
                <Car size={12} />
                {equipe?.vehicule?.registrationId}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='flex items-center gap-1 text-slate-600'>
                <Fuel size={12} />
                {equipe?.fuelCard?.matricule}
              </span>
              <span className='flex items-center gap-1 text-slate-600'>
                <Road size={12} />
                {equipe?.highwayCard?.matricule}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${classNameProps} w-full max-w-xs rounded-lg border border-slate-200 shadow-sm hover:shadow transition-shadow overflow-hidden`}
      draggable={draggable}
      {...props}
    >
      <div className='p-3'>
        <h3 className='font-semibold text-sm truncate'>{operation?.project.projectCode}</h3>

        <div className='mt-2 space-y-1 text-xs'>
          <div className='flex items-center justify-between'>
            <span className='flex items-center gap-1 text-slate-600'>
              <MapPin size={12} />
              {operation?.site?.siteNbr}
            </span>
            <span className='flex items-center gap-1 text-slate-600'>
              <CheckSquare size={12} />
              {operation?.operationTasks?.operationTasksIds?.length}
            </span>
          </div>

          {/* <div className='flex items-center gap-1 text-slate-600'>
            <Users size={12} />
            {operation?.equipe?.members.length} members
          </div>

          <div className='flex items-center justify-between'>
            <span className='flex items-center gap-1 text-slate-600'>
              <Car size={12} />
              {operation?.equipe?.vehicule?.registrationId}
            </span>
          </div>

          <div className='flex items-center justify-between'>
            <span className='flex items-center gap-1 text-slate-600'>
              <Fuel size={12} />
              {operation?.equipe?.fuelCard?.matricule}
            </span>
            <span className='flex items-center gap-1 text-slate-600'>
              <Road size={12} />
              {operation?.equipe?.highwayCard?.matricule}
            </span>
          </div> */}
        </div>
      </div>
    </div>
  )
}
