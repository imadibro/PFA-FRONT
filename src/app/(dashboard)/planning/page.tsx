'use client'

import type { IEquipe } from '@/@core/utils/types'
import { CalendarCard } from '@/components/operationCard/CalendarCard'
import { CompactCard } from '@/components/operationCard/CompactCard'
import { useGetEquipesQuery } from '@/store/features/equipe/equipeApi'
import { useGetOperationsQuery } from '@/store/features/operation/operationApi'
// import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
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

interface CalendarEvent {
  id: string
  title: string
  resourceId: string
  start: string
  end: string
  extendedProps: {
    operation?: any
    assignedEquipe?: any
  }
}

interface CalendarResource {
  id: string
  title: string
  day: string
  row: number
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
    console.log('info ===>', info)
    // Only allow operations to be dropped in the calendar
    if (info.draggedEl.dataset.type !== 'operation') {
      if (info.revert) info.revert()
      if (info.draggedEl.parentNode) {
        info.draggedEl.parentNode.removeChild(info.draggedEl)
      }
      return
    }
    const resourceId = info.resource?.id || info.event?.getResources?.()[0]?.id
    const dateStr = info.dateStr || info.event?.startStr
    const start = `${dateStr}T09:00:00`
    const end = `${dateStr}T10:00:00`

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
        date: info.dateStr,
        // start: info.event?.startStr,
        // end: info.event?.endStr,
        resourceId
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

  // Generate resources for each day and row combination
  const generateResources = (): CalendarResource[] => {
    const resources: CalendarResource[] = []

    // Create resources for rows only (days will be handled by timeline columns)
    equipes?.map((equipe, index) => {
      resources.push({
        // id: String(index + 1),
        id: equipe.id,
        title: equipe.name,
        day: '',
        row: index + 1
      })
    })

    return resources
  }

  const resources = generateResources()

  console.log('resources ===>', resources)

  console.log('events ===>', events)

  console.log('operations', operations?.data)

  return (
    <div className='flex h-full'>
      <DndProvider backend={HTML5Backend}>
        <div ref={externalEventsRef} className='w-64 p-4 h-full overflow-y-auto border-r border-slate-200'>
          <h2 className='text-lg font-semibold mb-4 text-gray-700'>Operations</h2>
          <div className='space-y-3 mb-8 overflow-y-scroll max-h-[400px]'>
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
          <div className='space-y-3 overflow-y-scroll max-h-[400px]'>
            {equipes?.map(equipe => <DraggableEquipeCard key={equipe.id} equipe={equipe} />)}
          </div>
        </div>

        <div className='flex-1 p-6 overflow-auto'>
          <div className='mx-auto'>
            {/* <FullCalendar
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
              eventContent={renderEventContentWithDrop(setEvents, calendarRef, equipes)}
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
            /> */}
            <FullCalendar
              ref={calendarRef}
              plugins={[resourceTimelinePlugin, interactionPlugin]}
              initialView='resourceTimelineWeek'
              headerToolbar={{
                left: 'prev today',
                center: 'title',
                right: 'next'
              }}
              resources={resources}
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
              editable={true}
              droppable={true}
              drop={handleEventReceive}
              // eventReceive={handleEventReceive}
              // eventDrop={handleEventDrop}
              // eventClick={handleEventClick}
              eventContent={renderEventContentWithDrop(setEvents, calendarRef, equipes)}
              resourceAreaHeaderContent=''
              resourceAreaWidth='60px'
              slotMinWidth={200}
              height='auto'
              aspectRatio={2.5}
              slotMinTime='09:00:00'
              slotMaxTime='10:00:00'
              resourceOrder='id'
              // resourceLabelContent={arg => {
              //   const resource = arg.resource
              //   const rowNumber = resource.title.split(' ')[1]
              //   return `${rowNumber}`
              // }}
              // slotLabelFormat={[{ weekday: 'short' }, { month: 'numeric', day: 'numeric' }]}
              eventOverlap={false}
              selectOverlap={false}
              weekends={false}
              // slotDuration='1 day'
              // slotLabelInterval='1 day'
              // nowIndicator={false}
              // scrollTime='00:00:00'
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
function renderEventContentWithDrop(setEvents: any, calendarRef: React.RefObject<any>, equipes: IEquipe[] | undefined) {
  return (eventInfo: { event: any }) => {
    console.log('eventInfo ===>', eventInfo)
    const operation = eventInfo.event.extendedProps.operation
      ? JSON.parse(eventInfo.event.extendedProps.operation)
      : undefined

    let equipe = undefined

    if (eventInfo.event.extendedProps.resourceId) {
      console.log('equipes ===>', equipes)
      console.log('eventInfo.event.extendedProps.resourceId ===>', eventInfo.event.extendedProps.resourceId)
      equipe = equipes?.find(equipe => equipe.id === eventInfo.event.extendedProps.resourceId)
    }

    console.log('equipe resourceId ===>', equipe)
    equipe = eventInfo.event.extendedProps.assignedEquipe
      ? JSON.parse(eventInfo.event.extendedProps.assignedEquipe)
      : undefined

    console.log('equipe assignedEquipe ===>', equipe)
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
