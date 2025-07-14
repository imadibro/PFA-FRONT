import type { IOperation } from '@/@core/utils/types'
import { CheckSquare, MapPin } from 'lucide-react'

// Detailed Card Component
export default function DetailedCard({ operation }: { operation: IOperation }) {
  return (
    <div className='w-full max-w-3xl rounded-lg border border-slate-200 shadow-md hover:shadow-lg transition-shadow overflow-hidden'>
      <div className='bg-slate-50 p-6 pb-2'>
        <div className='flex justify-between items-center'>
          <h3 className='text-xl font-bold'>{operation.project.projectCode}</h3>
          {/* <span className='inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700'>
            {operation.equipe?.members.length} team members
          </span> */}
        </div>
      </div>
      <div className='p-6 pt-4'>
        <div className='grid gap-4'>
          {/* Team Section */}
          {/* <div className='space-y-2'>
            <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
              <Users size={18} className='text-slate-500' />
              <span>Team</span>
            </div>
            <div className='grid gap-2 pl-6'>
              {operation.equipe?.members.map(member => (
                <div key={member.id} className='flex items-center gap-2'>
                  <div className='h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium'>
                    {member.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className='text-sm font-medium'>{member.name}</p>
                    <p className='text-xs text-slate-500'>{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          {/* <hr className='border-t border-slate-200 my-1' /> */}

          {/* Site, Tasks, Vehicle Section */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='space-y-1'>
              <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
                <MapPin size={18} className='text-slate-500' />
                <span>Site</span>
              </div>
              <p className='text-sm pl-6'>{operation.site.siteNbr}</p>
              <p className='text-xs text-slate-500 pl-6'>{operation.site.label}</p>
            </div>

            {/* <div className='space-y-1'>
              <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
                <CheckSquare size={18} className='text-slate-500' />
                <span>Tasks</span>
              </div>
              <p className='text-sm pl-6'>{operation.operationTasks.operationTasksIds.length} tasks</p>
            </div> */}

            {/* <div className='space-y-1'>
              <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
                <Car size={18} className='text-slate-500' />
                <span>Vehicle</span>
              </div>
              <p className='text-sm pl-6'>{operation.equipe?.vehicule?.registrationId}</p>
            </div> */}
          </div>

          {/* <hr className='border-t border-slate-200 my-1' /> */}

          {/* Cards Section */}
          {/* <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-1'>
              <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
                <Fuel size={18} className='text-slate-500' />
                <span>Fuel Card</span>
              </div>
              <p className='text-sm pl-6'>{operation.equipe?.fuelCard?.matricule}</p>
              <p className='text-xs text-slate-500 pl-6'>
                Expires:{' '}
                {operation.equipe?.fuelCard?.expireDate &&
                  new Date(operation.equipe.fuelCard.expireDate).toLocaleDateString()}
              </p>
            </div>

            <div className='space-y-1'>
              <div className='flex items-center gap-2 text-sm font-medium text-slate-700'>
                <Road size={18} className='text-slate-500' />
                <span>Highway Card</span>
              </div>
              <p className='text-sm pl-6'>{operation.equipe?.highwayCard?.matricule}</p>
              <p className='text-xs text-slate-500 pl-6'>
                Expires:{' '}
                {operation.equipe?.highwayCard?.expireDate &&
                  new Date(operation.equipe.highwayCard.expireDate).toLocaleDateString()}
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  )
}
