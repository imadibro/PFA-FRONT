import type { IEquipe, IOperation } from '@/@core/utils/types'
import { Car, Fuel, RouteIcon as Road, Users } from 'lucide-react'
import React, { useState } from 'react'

// Define ExternalEvent type if not already imported
type ExternalEvent = {
  id: string
  [key: string]: any
}

import { useDrop } from 'react-dnd'
import OperationHeader from './OperationHeader'

export function CalendarCard({
  operation,
  equipe,
  onEquipeDrop,
  calendarRef,
  setEvents
}: {
  operation: IOperation
  equipe?: IEquipe
  onEquipeDrop?: (equipe: IEquipe) => void
  calendarRef: React.RefObject<any>
  setEvents: React.Dispatch<React.SetStateAction<ExternalEvent[]>>
}) {
  // State for action menu visibility
  const [showMenu, setShowMenu] = useState(false)

  // Always call useDrop (never conditionally)
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'EQUIPE',
      drop: (item: { equipe: IEquipe }) => {
        if (onEquipeDrop) onEquipeDrop(item.equipe)
      },
      canDrop: () => Boolean(onEquipeDrop),
      collect: monitor => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
      })
    }),
    [onEquipeDrop]
  )

  // Always call useRef and useEffect
  const divRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (onEquipeDrop && divRef.current) {
      drop(divRef)
    }
  }, [onEquipeDrop, drop])

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node) && showMenu) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  if (!operation) return null

  const handleDeleteOperation = (operationId: string) => {
    // Supprime l'événement du calendrier FullCalendar
    if (calendarRef.current && typeof calendarRef.current.getApi === 'function') {
      const event = calendarRef.current.getApi().getEventById(operationId)
      if (event) event.remove()
    }
    // Supprime l'événement du state React
    setEvents(prev => prev.filter(ev => ev.id !== operationId))
  }

  return (
    <div
      ref={divRef}
      className={`w-full rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden ${isOver && canDrop ? 'ring-2 ring-blue-400' : ''}`}
      style={{ position: 'relative' }} /* Ensure proper positioning context */
    >
      <div className='p-4'>
        {/* <div className='flex justify-between items-start'>
          <div>
            <h3 className='font-bold text-lg'>{operation?.project?.projectCode}</h3>
            <p className='text-sm flex items-center gap-1 mt-1'>
              <MapPin size={14} />
              {operation?.site?.siteNbr}
            </p>
          </div>
          <span className='inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800'>
            {operation?.operationTasks?.operationTasksIds?.length} tasks
          </span>
        </div> */}
        <OperationHeader operation={operation} onDelete={handleDeleteOperation} />

        {/* Team/Members */}
        <div className='mt-3 flex flex-wrap gap-2 overflow-hidden'>
          {operation?.equipe?.members && Array.isArray(operation?.equipe?.members) ? (
            operation?.equipe?.members.map((member: { id: string; name: string; role: string }) => (
              <span
                key={member.id}
                className='inline-flex items-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700 whitespace-nowrap'
              >
                <Users size={12} className='mr-1 flex-shrink-0' />
                <span className='truncate'>{member.name}</span> <span className='truncate'>({member.role})</span>
              </span>
            ))
          ) : equipe?.members && Array.isArray(equipe.members) ? (
            <span
              key={equipe.id}
              className='inline-flex items-center rounded-full border border-green-200 px-2.5 py-0.5 text-xs font-medium text-green-700 bg-green-50 whitespace-nowrap'
            >
              <Users size={12} className='mr-1 flex-shrink-0' />
              <span className='truncate'>{equipe.name}</span>{' '}
              <span className='truncate'>({equipe.members.length} members)</span>
            </span>
          ) : null}
        </div>

        {/* Vehicle */}
        {(operation?.equipe?.vehicule?.registrationId || equipe?.vehicule?.registrationId) && (
          <div className='mt-3 flex gap-3 text-xs'>
            <span className='flex items-center gap-1 overflow-hidden'>
              <Car size={14} className='flex-shrink-0' />
              <span className='truncate'>
                {operation?.equipe?.vehicule?.registrationId || equipe?.vehicule?.registrationId}
              </span>
            </span>
          </div>
        )}

        {/* Fuel Card */}
        {(operation?.equipe?.fuelCard?.matricule || equipe?.fuelCard?.matricule) && (
          <div className='mt-3 flex gap-3 text-xs'>
            <span className='flex items-center gap-1 overflow-hidden'>
              <Fuel size={14} className='flex-shrink-0' />
              <span className='truncate'>{operation?.equipe?.fuelCard?.matricule || equipe?.fuelCard?.matricule}</span>
            </span>
          </div>
        )}

        {/* Highway Card */}
        {(operation?.equipe?.highwayCard?.matricule || equipe?.highwayCard?.matricule) && (
          <div className='mt-3 flex gap-3 text-xs'>
            <span className='flex items-center gap-1 overflow-hidden'>
              <Road size={14} className='flex-shrink-0' />
              <span className='truncate'>
                {operation?.equipe?.highwayCard?.matricule || equipe?.highwayCard?.matricule}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
