'use client'

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
  const [events, setEvents] = useState<ExternalEvent[]>([
    {
      id: '1',
      text: 'Existing Event',
      color: '#4F46E5',
      test: 'aaaaa',
      icon: 'tabler-users',
      date: new Date().toISOString().replace(/T.*$/, '')
    }
  ])
  const externalEventsRef = useRef<HTMLDivElement>(null)

  const externalEvents: ExternalEvent[] = [
    {
      id: '1',
      text: 'Team Meeting',
      color: '#4F46E5',
      test: 'aaaaa',
      icon: 'tabler-users',
      date: '',
      create: false
    },
    {
      id: '2',
      text: 'Project Review',
      color: '#059669',
      test: 'bbbb',
      icon: 'tabler-calendar-month',
      date: '',
      create: false
    },
    {
      id: '3',
      text: 'Client Call',
      color: '#DC2626',
      test: 'cccc',
      icon: 'tabler-phone',
      date: '',
      create: false
    },
    {
      id: '4',
      text: 'Office Visit',
      color: '#D97706',
      test: 'dddd',
      icon: 'tabler-map-pin',
      date: '',
      create: false
    }
  ]

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
      <div ref={externalEventsRef} className='w-64 bg-[#1e2130] border-r border-gray-700 p-4 h-full overflow-y-auto'>
        <h2 className='text-lg font-semibold mb-4 text-white'>Event Types</h2>
        <div className='space-y-3'>
          {externalEvents.map(event => (
            <div
              key={event.id}
              className='fc-event external-event cursor-pointer select-none'
              data-id={event.id}
              data-text={event.text}
              data-color={event.color}
              data-test={event.test}
              data-icon={event.icon}
              data-date={event.date}
              style={{
                backgroundColor: `${event.color}20`,
                borderLeft: `4px solid ${event.color}`
              }}
              draggable={true}
            >
              <div className='flex items-center gap-2 p-3'>
                <div style={{ color: event.color }}>
                  <i className={event.icon} />
                </div>
                <span className='text-sm font-medium text-gray-200'>{event.text}</span>
              </div>
            </div>
          ))}
        </div>
        <p className='text-xs mt-4 text-gray-400'>Drag and drop events to add them to the calendar</p>
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
            // weekends={false}
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
  console.log('event sssssssssss ===>', e.event.id)
  return (
    <div className='flex items-center gap-2 p-3'>
      <div style={{ color: e.event.extendedProps.color }}>
        <i className={e.event.extendedProps.icon} />
      </div>
      <span className='text-sm font-medium text-gray-700'>{e.event.extendedProps.text}</span>
    </div>
  )
}

export default Page
