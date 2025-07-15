'use client'

import { CalendarCard } from '@/components/operationCard/CalendarCard'
import { CompactCard } from '@/components/operationCard/CompactCard'
import { useGetEquipesQuery } from '@/store/features/equipe/equipeApi'
import { useGetOperationsQuery } from '@/store/features/operation/operationApi'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import { useEffect, useRef, useState } from 'react'
import { DndProvider, useDrag } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

interface ExternalEvent {
  id: string
  text: string
  color: string
  test: string
  icon: string
  date: string
  originalId?: string
  create?: boolean
}

function Page() {
  const [events, setEvents] = useState<ExternalEvent[]>([])
  const externalEventsRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<any>(null)

  const { data: operations } = useGetOperationsQuery({
    limit: 20,
    page: 1,
    search: ''
  })

  const { data: equipes } = useGetEquipesQuery()

  useEffect(() => {
    if (externalEventsRef.current) {
      new Draggable(externalEventsRef.current, {
        itemSelector: '.fc-event',
        eventData: function (eventEl: any) {
          return {
            ...eventEl.dataset
          }
        }
      })
    }
  }, [])

  // Handle dropping an operation card into the calendar
  const handleEventReceive = (info: any) => {
    // console.log('info ===>', info)
    // Only allow operations to be dropped in the calendar
    if (info.draggedEl.dataset.type !== 'operation') {
      if (info.revert) info.revert()
      if (info.draggedEl.parentNode) {
        info.draggedEl.parentNode.removeChild(info.draggedEl)
      }
      return
    }

    setEvents(prev => {
      // Prevent operation duplication: don't add if operation (by originalId) is already scheduled for this date
      const alreadyExists = prev.some(
        event => event.originalId === info.draggedEl.dataset.id && event.date === info.dateStr
      )
      if (alreadyExists) {
        console.warn('Operation already exists for this date in this row, not adding duplicate.')
        return prev
      }

      // Generate a unique ID for each event instance
      const uniqueId = `${info.draggedEl.dataset.id}-${info.dateStr}`
      const newEvent: ExternalEvent = {
        ...(info.draggedEl.dataset as any),
        id: uniqueId, // Use the unique ID for this instance
        originalId: info.draggedEl.dataset.id, // Keep track of the original ID
        date: info.dateStr
      }
      return [...prev, newEvent]
    })

    if (info.draggedEl.parentNode) {
      info.draggedEl.parentNode.removeChild(info.draggedEl)
    }
  }

  // const handleEvents = (events: any) => {
  //   console.log('handleEvents events ===>', events)
  //   setEvents(events)
  // }

  // const handleEventClick = (clickInfo: any) => {
  //   if (confirm(`Are you sure you want to delete the event '${clickInfo.event.extendedProps.text}'`)) {
  //     clickInfo.event.remove()
  //   }
  // }

  console.log('events ===>', events)

  return (
    <div className='flex h-full'>
      <DndProvider backend={HTML5Backend}>
        <div ref={externalEventsRef} className='w-64 p-4 h-full overflow-y-auto border-r border-slate-200'>
          <h2 className='text-lg font-semibold mb-4 text-gray-700'>Operations</h2>
          <div className='space-y-3 mb-8'>
            {operations?.data?.map(operation => (
              <CompactCard
                key={operation.id}
                operation={operation}
                classNameProps='fc-event external-event operation-draggable cursor-pointer select-none'
                data-id={operation.id}
                data-type='operation'
                draggable={true}
                data-operation={JSON.stringify(operation)}
                onDragStart={(e: DragEvent) => {
                  e.dataTransfer?.setData('type', 'operation')
                  e.dataTransfer?.setData('operation', JSON.stringify(operation))
                }}
              />
            ))}
          </div>

          <h2 className='text-lg font-semibold mb-4 text-gray-700'>Equipes</h2>
          <div className='space-y-3'>
            {equipes?.map(equipe => <DraggableEquipeCard key={equipe.id} equipe={equipe} />)}
          </div>
        </div>

        <div className='flex-1 p-6 overflow-auto'>
          <div className='mx-auto'>
            <FullCalendar
              ref={calendarRef}
              initialView='dayGridWeek'
              plugins={[dayGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: 'prev today',
                center: 'title',
                right: 'next'
              }}
              events={events.map(ev => ({
                ...ev,
                // Set a unique data-event-id for drop targeting
                extendedProps: {
                  ...ev,
                  eventId: ev.id
                },
                // Set id for DOM
                id: ev.id
              }))}
              // eventsSet={handleEvents}
              // eventClick={handleEventClick}
              editable={true}
              droppable={true}
              selectable={true}
              // selectMirror={true}
              weekends={false}
              drop={handleEventReceive}
              eventContent={renderEventContentWithDrop(setEvents, calendarRef)}
              dayMaxEventRows={true}
              eventChange={function (changeInfo: any) {
                console.log('changeInfo ===>', changeInfo)
                // setEvents(prev =>
                //   prev.map(ev =>
                //     ev.id === changeInfo.event.id
                //       ? {
                //           ...ev,
                //           date: changeInfo.event.startStr,
                //           start: changeInfo.event.startStr,
                //           end: changeInfo.event.endStr
                //           // rowIndex is preserved from the existing event 'ev' by spreading it
                //         }
                //       : ev
                //   )
                // )
              }}
              eventRemove={function (e: any) {
                console.log('event remove ===>', e)
                setEvents(prev => prev.filter(event => event.id !== e.event.id))
              }}
              // eventDragStart={function (e: any) {
              //   console.log('e ------------------------', e)
              // }}
            />
          </div>
        </div>
      </DndProvider>
    </div>
  )
}

// Draggable Equipe card using react-dnd
function DraggableEquipeCard({ equipe }: { equipe: any }) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'EQUIPE',
      item: { equipe },
      collect: monitor => ({
        isDragging: monitor.isDragging()
      })
    }),
    [equipe]
  )
  const ref = useRef<HTMLDivElement>(null)
  drag(ref)

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <CompactCard equipe={equipe} classNameProps='equipe-draggable cursor-pointer select-none' />
    </div>
  )
}

// Render event content with drop target for equipe assignment
function renderEventContentWithDrop(setEvents: any, calendarRef: React.RefObject<any>) {
  return (eventInfo: { event: any }) => {
    const operation = eventInfo.event.extendedProps.operation
      ? JSON.parse(eventInfo.event.extendedProps.operation)
      : undefined
    const equipe = eventInfo.event.extendedProps.assignedEquipe
      ? JSON.parse(eventInfo.event.extendedProps.assignedEquipe)
      : undefined
    if (operation && equipe) operation.equipe = equipe

    return (
      <CalendarCard
        operation={operation}
        equipe={equipe}
        calendarRef={calendarRef}
        onEquipeDrop={(droppedEquipe: any) => {
          setEvents((prev: any[]) =>
            prev.map(ev =>
              ev.id === eventInfo.event.id ? { ...ev, assignedEquipe: JSON.stringify(droppedEquipe) } : ev
            )
          )
        }}
        setEvents={setEvents}
      />
    )
  }
}

export default Page
