'use client'

import { CalendarCard } from '@/components/operationCard/CalendarCard'
import { CompactCard } from '@/components/operationCard/CompactCard'
import { useGetOperationsQuery } from '@/store/features/operation/operationApi'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import { useEffect, useRef, useState } from 'react'

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

  const { data: operations, error: operationsError, isLoading: operationsLoading } = useGetOperationsQuery()

  useEffect(() => {
    if (externalEventsRef.current) {
      new Draggable(externalEventsRef.current, {
        itemSelector: '.fc-event',
        eventData: function (eventEl) {
          return {
            ...eventEl.dataset
          }
        }
      })
    }
  }, [])

  const handleEventReceive = (info: any) => {
    // console.log('info.draggedEl ===>', info)
    setEvents(prev => {
      // console.log('prev ===>', prev)
      // Generate a unique ID for each event instance
      const uniqueId = `${info.draggedEl.dataset.id}-${info.dateStr}-${Math.floor(Math.random() * 1000)}`
      // console.log('uniqueId ===>', uniqueId)

      // Check if there's already an event with the same ID and date
      const eventIndex = prev.findIndex(event => event.id === uniqueId && event.date === info.dateStr)
      // console.log('eventIndex ===>', eventIndex)
      if (eventIndex !== -1) {
        return [...prev]
      }

      const newEvent = {
        ...info.draggedEl.dataset,
        id: uniqueId, // Use the unique ID for this instance
        originalId: info.draggedEl.dataset.id, // Keep track of the original ID
        date: info.dateStr
      }
      // console.log('newEvent ===>', newEvent)

      // Add the new event with the unique ID
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

  const handleEventClick = (clickInfo: any) => {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.extendedProps.text}'`)) {
      clickInfo.event.remove()
    }
  }

  // console.log('events ===>', events)

  return (
    <div className='flex h-full'>
      <div ref={externalEventsRef} className='w-64 p-4 h-full overflow-y-auto border-r border-slate-200'>
        <h2 className='text-lg font-semibold mb-4 text-gray-700'>Operations</h2>
        <div className='space-y-3'>
          {operations?.map(operations => (
            <CompactCard
              key={operations.id}
              operation={operations}
              classNameProps='fc-event external-event cursor-pointer select-none'
              data-id={operations.id}
              draggable={true}
              data-operation={JSON.stringify(operations)}
            />
          ))}
        </div>
      </div>

      <div className='flex-1 p-6 overflow-auto'>
        <div className='mx-auto'>
          <FullCalendar
            initialView='dayGridWeek'
            plugins={[dayGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev today',
              center: 'title',
              right: 'next'
            }}
            events={events}
            // eventsSet={handleEvents}
            eventClick={handleEventClick}
            editable={true}
            droppable={true}
            selectable={true}
            // selectMirror={true}
            weekends={false}
            drop={handleEventReceive}
            eventContent={renderEventContent}
            dayMaxEventRows={true}
            eventChange={function (e: any) {
              // console.log('event change ===>', e)
              // setEvents(prev => prev.map(event => event.id === e.id ? e : event))
            }}
            eventRemove={function (e: any) {
              // console.log('event remove ===>', e)
              setEvents(prev => prev.filter(event => event.id !== e.event.id))
            }}
            // eventDragStart={function (e: any) {
            //   console.log('e ------------------------', e)
            // }}
          />
        </div>
      </div>
    </div>
  )
}

function renderEventContent(e: any) {
  return <CalendarCard operation={JSON.parse(e.event.extendedProps.operation)} />
}

export default Page
