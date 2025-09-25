'use client'

import type { IEquipe, IOperation, IOperationRequest, IPlanning, IPlanningRequest } from '@/@core/utils/types'
import { CalendarCard } from '@/components/operationCard/CalendarCard'
import { CompactCard } from '@/components/operationCard/CompactCard'
import { useGetEquipesQuery } from '@/store/features/equipe/equipeApi'
import { useCreateOperationMutation, useGetAllOperationsQuery } from '@/store/features/operation/operationApi'
import OperationForm from '@/views/operation/Operation.form'
import frLocale from '@fullcalendar/core/locales/fr'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// import ExcelComponent, { prepareCalendarExportData } from '@/@core/components/excel/ExcelComponent'
import { ExportPlanningButton } from '@/@core/components/excel/ExcelBack'
import { useToastComponante } from '@/components/common/DeletedComponante'
import { useCreatePlaningMutation, useLazyGetPlaningQuery } from '@/store/features/planing/planingApi'
import { Icon } from '@iconify/react'
import { Car, Fuel, RouteIcon as Road, Users } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  resourceId?: string
  start: string
  end: string
  extendedProps: {
    operation?: any
    equipe?: any
    assignedEquipe?: any
  }
  color?: string
  date: string
  originalId?: string
  planningId?: string
  create?: boolean
}

interface CalendarResource {
  id: string
  title: string
  day: string
  row: number
}

const toYmdLocal = (d: Date) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const getCurrentWeek = (view: any) => {
  const start = new Date(view.currentStart) // lundi affiché par FullCalendar
  const end = new Date(view.currentEnd)
  end.setDate(end.getDate() - 1) // vendredi
  end.setHours(23, 59, 59, 999)

  return {
    startDate: toYmdLocal(start), // ✅ plus de toISOString()
    endDate: toYmdLocal(end)
  }
}

function Page() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const externalEventsRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<any>(null)
  const [formDialogOpen, setFormDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null)
  const [operationsList, setOperationsList] = useState<IOperation[]>([])
  const [week, setWeek] = useState<{ startDate?: string; endDate?: string }>({})
  const [placedOperationIds, setPlacedOperationIds] = useState<Set<string>>(new Set())

  const { data: operations, isLoading: isFetchingOperations } = useGetAllOperationsQuery()
  const [createOperation] = useCreateOperationMutation()
  const { data: equipes } = useGetEquipesQuery()
  const [createPlanning] = useCreatePlaningMutation()
  const [getPlannings, { data: plannings, isLoading: isFetchingPlanning }] = useLazyGetPlaningQuery()
  const { confirmSave } = useToastComponante()

  const isLoading = isFetchingOperations || isFetchingPlanning

  useEffect(() => {
    if (operations) {
      setOperationsList(operations)
    }
  }, [operations])

  const visibleOperations = useMemo(
    () => operationsList.filter(op => !placedOperationIds.has(op.id)),
    [operationsList, placedOperationIds]
  )

  useEffect(() => {
    const mapped: CalendarEvent[] = (plannings ?? []).map(p => {
      const dateISO = p.startDate
      const endISO = p.endDate
      const startTime = p.startDate.split('T')[1]?.slice(0, 8) || '09:00:00'
      const endTime = p.endDate.split('T')[1]?.slice(0, 8) || '10:00:00'

      return {
        ...makeCalendarEvent({
          operation: p.operation,
          dateISO,
          endISO,
          resourceId: p.equipe?.id,
          equipe: p.equipe,
          startTime,
          endTime,
          planningId: p.id
        }),
        editable: true
      }
    })

    setEvents(mapped)

    setPlacedOperationIds(new Set((plannings ?? []).map(p => p.operation.id)))
  }, [plannings])

  useEffect(() => {
    if (externalEventsRef.current) {
      new Draggable(externalEventsRef.current, {
        itemSelector: '.external-operation',
        eventData: function (eventEl: any) {
          return {
            ...eventEl.dataset
          }
        }
      })
    }
  }, [])

  const addDays = (d: Date, n: number) => {
    const x = new Date(d)
    x.setDate(x.getDate() + n)
    return x
  }

  const handleEventReceive = (info: any) => {
    const resourceId = info.event.getResources?.()[0]?.id || info.resource?.id
    const dateStr = info.event.startStr?.split('T')[0] || info.dateStr
    const rawOperation = info.draggedEl?.dataset?.operation
    const operation: IOperation | null = rawOperation ? JSON.parse(rawOperation) : null

    if (!operation || !resourceId || !dateStr) {
      console.warn('[receive] missing data', { operation, resourceId, dateStr })
      info.event.remove()
      return
    }
    const gabarit = Math.max(1, Number(operation.gabarit) || 1)

    const endDate = addDays(new Date(dateStr), gabarit - 1)
    const endISO = `${toYmdLocal(endDate)}T10:00:00`
    const id = `${operation.id}-${dateStr}`
    if (events.some(ev => ev.id === id)) {
      console.warn('[receive] duplicate -> ignore', id)
      info.event.remove()
      return
    }
    const equipe = equipes?.find(eq => eq.id === resourceId) ?? null
    const newEvent = makeCalendarEvent({
      operation,
      dateISO: dateStr, // debut,
      endISO, // fin
      resourceId,
      equipe,
      startTime: '09:00:00',
      endTime: '10:00:00'
    })
    info.event.remove()
    setEvents(prev => [...prev, { ...newEvent, id }])
    setPlacedOperationIds(prev => new Set(prev).add(operation.id))
  }

  const resources: CalendarResource[] = useMemo(() => {
    return (equipes ?? []).map((e, i) => ({
      id: e.id,
      title: e.members.map(m => `${m.name} ${m.role}`).join('\n'),
      day: '',
      row: i + 1,
      extendedProps: {
        equipe: e
      }
    }))
  }, [equipes])

  const handleDateClick = (arg: any) => {
    setSelectedDate(arg.dateStr)
    setSelectedResourceId(arg.resource?.id || null)
    setFormDialogOpen(true)
  }

  const handleEventChange = (changeInfo: any) => {
    const updatedEvent = changeInfo.event
    const oldEvent = changeInfo.oldEvent
    const newResourceId = updatedEvent._def.resourceIds?.[0]
    const oldResourceId = oldEvent?._def.resourceIds?.[0]

    // Si la ressource a changé (ligne déplacée)
    const hasEquipeChanged = newResourceId && oldResourceId && newResourceId !== oldResourceId

    const newEquipe = equipes?.find(e => e.id === newResourceId) || null

    setEvents(prev =>
      prev.map(ev =>
        ev.id === updatedEvent.id
          ? {
              ...ev,
              start: updatedEvent.startStr,
              end: updatedEvent.endStr,
              resourceId: newResourceId || ev.resourceId,
              date: updatedEvent.startStr.split('T')[0],
              planningId: ev.planningId,
              extendedProps: {
                ...ev.extendedProps,
                operation: {
                  ...ev.extendedProps?.operation
                },
                equipeId: newEquipe?.id,
                equipe: hasEquipeChanged ? newEquipe : ev.extendedProps?.equipe
              }
            }
          : ev
      )
    )
  }

  const handleAddOperation = async (op: IOperationRequest) => {
    try {
      const added = await createOperation(op).unwrap()

      if (selectedDate && selectedResourceId) {
        const dateOnly = new Date(selectedDate).toISOString().split('T')[0]
        const equipe = equipes?.find(e => e.id === selectedResourceId) || null

        const newEvent = makeCalendarEvent({
          operation: added,
          dateISO: dateOnly,
          resourceId: selectedResourceId,
          equipe
        })

        setEvents(prev => [...prev, newEvent])
        setPlacedOperationIds(prev => new Set(prev).add(added.id))
        setOperationsList(prev => prev.filter(o => o.id !== added.id))
      }

      setFormDialogOpen(false)
    } catch (err) {
      console.error('Erreur création:', err)
    }
  }

  const handleSavePlanning = async () => {
    const planningRequests: IPlanningRequest[] = events.map(mapEventToPlanningRequest)
    try {
      const savedPlanning = await createPlanning({ plannings: planningRequests }).unwrap()
      confirmSave('Planning')
      const mappedEvents = savedPlanning.map(planning => {
        // const dateOnly = new Date(planning.startDate).toISOString().split('T')[0]
        const dateOnly = toYmdLocal(new Date(planning.startDate))
        return {
          id: `${planning.operation.id}-${dateOnly}`,
          planningId: planning.id,
          title: '',
          start: planning.startDate,
          end: planning.endDate,
          resourceId: planning.equipe.id,
          date: dateOnly,
          originalId: planning.operation.id,
          extendedProps: {
            operation: {
              ...planning.operation
            },
            equipe: planning.equipe
          }
        }
      })
      return setEvents(mappedEvents)
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du planning', err)
    }
  }

  const handleMembersChange = async (eventId: string, newMembers: { id: string; name: string; role: string }[]) => {
    setEvents(prev => {
      const next = prev.map(ev => {
        if (ev.id !== eventId) return ev
        const equipe = { ...(ev.extendedProps?.equipe ?? {}), members: newMembers }
        return { ...ev, extendedProps: { ...ev.extendedProps, equipe } }
      })
      // Après la mise à jour, retrouve l'événement
      const updatedEvent = next.find(ev => ev.id === eventId)
      if (updatedEvent?.planningId) {
        const req = mapEventToPlanningRequest(updatedEvent)
        createPlanning({ plannings: [req] }).unwrap()
      } else {
        console.log('[planning] no planningId yet: will be saved on global save')
      }
      return next
    })
  }

  const lastRangeRef = useRef<string>('')

  const handelDataSet = (arg: any) => {
    const { startDate, endDate } = getCurrentWeek(arg.view)
    const key = `${startDate}|${endDate}`
    if (key === lastRangeRef.current) return
    lastRangeRef.current = key
    setWeek({ startDate, endDate })
    getPlannings({ startDate, endDate })
  }

  return (
    <div className='flex h-full'>
      {isLoading && (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'>
          <CircularProgress />
        </div>
      )}
      <DndProvider backend={HTML5Backend}>
        <div ref={externalEventsRef} className='w-64 p-4 h-full overflow-y-auto border-r border-slate-200'>
          <h2 className='text-lg font-semibold mb-4 text-gray-700'>Operations</h2>
          <div className='space-y-3 mb-8 overflow-y-scroll h-[70vh]'>
            {visibleOperations?.map((operation, index) => (
              <CompactCard
                key={operation.id ?? index}
                operation={operation}
                classNameProps='external-operation cursor-pointer select-none'
                data-id={operation.id}
                // data-type='operation'
                draggable={true}
                data-operation={JSON.stringify(operation)}
                onDragStart={(e: DragEvent) => {
                  e.dataTransfer?.setData('type', 'operation')
                  e.dataTransfer?.setData('operation', JSON.stringify(operation))
                }}
              />
            ))}
          </div>

          {/* <h2 className='text-lg font-semibold mb-4 text-gray-700'>Equipes</h2>
          <div className='space-y-3 overflow-y-scroll max-h-[400px]'>
            {equipes?.map(equipe => <DraggableEquipeCard key={equipe.id} equipe={equipe} />)}
          </div> */}
        </div>

        <div className='flex-1 p-6 overflow-auto'>
          <div className='flex justify-end items-center gap-4 mb-5'>
            {/* Bouton Sauvegarder */}
            <Button
              disabled={events.length === 0}
              variant='contained'
              color='primary'
              startIcon={<Icon icon='tabler-device-floppy' />}
              onClick={handleSavePlanning}
            >
              Sauvegarder le planning
            </Button>

            {/* Bouton Exporter */}
            <ExportPlanningButton startDate={week.startDate} endDate={week.endDate} />
            {/* <ExcelComponent data={preparedData} fileName='calendrier-operations.xlsx' /> */}
          </div>

          <div className='mx-auto'>
            <FullCalendar
              locale='fr'
              locales={[frLocale]}
              dateClick={handleDateClick}
              ref={calendarRef}
              plugins={[resourceTimelinePlugin, interactionPlugin]}
              initialView='resourceTimelineWeek'
              initialDate={new Date().toISOString().split('T')[0]}
              firstDay={1}
              headerToolbar={{
                left: 'prev today',
                center: 'title',
                right: 'next'
              }}
              resources={resources}
              // resourceLabelContent={arg => <span style={{ whiteSpace: 'pre-line' }}>{arg.resource.title}</span>}
              resourceLabelContent={renderTeam}
              events={events.map(ev => ({
                ...ev,
                extendedProps: {
                  ...ev.extendedProps,
                  eventId: ev.id
                },
                id: ev.id
              }))}
              editable={true}
              droppable={true}
              // drop={handleEventReceive}
              eventReceive={handleEventReceive}
              // eventDrop={handleEventDrop}
              // eventClick={handleEventClick}
              eventChange={handleEventChange}
              eventContent={renderEventContentWithDrop(
                setEvents,
                calendarRef,
                equipes,
                setOperationsList,
                setPlacedOperationIds,
                handleMembersChange,
                plannings
              )}
              resourceAreaHeaderContent=''
              resourceAreaWidth='220px'
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
              datesSet={handelDataSet}
              // eventDurationEditable={true}
              // eventResizableFromStart={true}

              // slotDuration='1 day'
              // slotLabelInterval='1 day'
              // nowIndicator={false}
              // scrollTime='00:00:00'
            />
          </div>
        </div>
      </DndProvider>

      <Dialog open={formDialogOpen} onClose={() => setFormDialogOpen(false)} maxWidth='md' fullWidth>
        <DialogTitle>Ajouter une opération</DialogTitle>
        <DialogContent>
          <OperationForm
            isOpen={true}
            toggle={() => setFormDialogOpen(false)}
            operationToEdit={null}
            isEditMode={false}
            handleAdd={handleAddOperation}
            handleEdit={() => {}}
            cancleEditMode={() => {}}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

function renderEventContentWithDrop(
  setEvents: any,
  calendarRef: React.RefObject<any>,
  equipes: IEquipe[] | undefined,
  setOperations: React.Dispatch<React.SetStateAction<IOperation[]>>,
  setPlacedOperationIds: React.Dispatch<React.SetStateAction<Set<string>>>,
  handleMembersChange: (eventId: string, newMembers: { id: string; name: string; role: string }[]) => void,
  planings: IPlanning[] | undefined
) {
  return (eventInfo: { event: any }) => {
    const ext = eventInfo.event.extendedProps || {}
    const rawOperation = ext.operation
    const operation: IOperation | null = typeof rawOperation === 'string' ? JSON.parse(rawOperation) : rawOperation

    if (!operation) {
      console.warn('Operation manquante pour l’événement', eventInfo)
      return null
    }

    const resourceId: string | undefined = eventInfo.event._def.resourceIds?.[0]
    const equipeFromResource = resourceId ? equipes?.find(e => e.id === resourceId) : undefined
    const equipe = ext.equipe ?? equipeFromResource

    const operationForUI = { ...operation, eventId: eventInfo.event.id, equipe }

    const operationId = eventInfo.event.extendedProps?.operation?.id

    const planningForOperation = planings?.find(p => p.operation?.id === operationId)

    const equipeChangedAt = planningForOperation?.equipeChangedAt

    return (
      <CalendarCard
        operation={operationForUI}
        equipe={equipe}
        calendarRef={calendarRef}
        onEquipeDrop={(droppedEquipe: IEquipe) => {
          setEvents((prev: any[]) =>
            prev.map(ev =>
              ev.id === eventInfo.event.id
                ? { ...ev, extendedProps: { ...ev.extendedProps, equipe: droppedEquipe } }
                : ev
            )
          )
        }}
        setEvents={setEvents}
        setOperations={setOperations}
        setPlacedOperationIds={setPlacedOperationIds}
        handleMembersChange={handleMembersChange}
        equipeChangedAt={equipeChangedAt}
      />
    )
  }
}

function mapEventToPlanningRequest(event: CalendarEvent): IPlanningRequest {
  const rawOp =
    typeof event.extendedProps.operation === 'string'
      ? JSON.parse(event.extendedProps.operation)
      : event.extendedProps.operation

  const eq = event.extendedProps.equipe

  return {
    id: event.planningId ?? undefined,
    startDate: event.start ?? `${event.date}`,
    endDate: event.end ?? `${event.date}`,
    operationId: rawOp.id,
    equipe: {
      id: eq?.id ?? '',
      members: eq?.members.map((m: any) => ({ id: m.id, name: m.name, role: m.role })) ?? [],
      fuelCard: { id: eq?.fuelCard?.id ?? null, matricule: eq?.fuelCard?.matricule ?? null },

      highwayCard: {
        id: eq?.highwayCard?.id ?? null,
        matricule: eq?.highwayCard?.matricule ?? null
      },
      vehicule: {
        id: eq?.vehicule?.id ?? null,
        registrationId: eq?.vehicule?.registrationId ?? null
      }
    }
  }
}

function makeCalendarEvent(params: {
  operation: IOperation
  dateISO: string // "2025-09-08" ou "2025-09-08T09:00:00"
  endISO?: string // "2025-09-08" ou "2025-09-08T10:00:00"
  resourceId: string
  equipe?: IEquipe | null
  startTime?: string // "09:00:00"
  endTime?: string // "10:00:00"
  planningId?: string
}): CalendarEvent {
  const {
    operation,
    dateISO,
    endISO,
    resourceId,
    equipe,
    startTime = '09:00:00',
    endTime = '10:00:00',
    planningId
  } = params

  // Si dateISO contient déjà un "T", c'est une date complète
  const start = dateISO.includes('T') ? dateISO : `${dateISO}T${startTime}`
  const end = endISO ? (endISO.includes('T') ? endISO : `${endISO}T${endTime}`) : `${dateISO}T${endTime}`

  return {
    id: `${operation.id}-${start.split('T')[0]}`,
    planningId,
    originalId: operation.id,
    title: operation.site?.label ?? '',
    start,
    end,
    date: start.split('T')[0],
    resourceId,
    extendedProps: {
      operation: { ...operation },
      equipe: equipe ?? null
    }
  }
}

function renderTeam(arg: any) {
  const equipe = arg.resource.extendedProps?.equipe
  return (
    <>
      {equipe?.members?.length ? (
        <div className='mt-1 -ml-1 pr-1 whitespace-nowrap flex flex-wrap'>
          {equipe.members.map((m: any) => (
            <span
              key={m.id}
              className='inline-flex items-center mx-1 my-0.5 rounded-full border border-white/20 py-[2px] text-[13px]'
              title={`${m.name} (${m.role})`}
            >
              <Users size={12} className='mr-1 flex-shrink-0 opacity-90' />
              <span className='truncate'>{m.name}</span>
              <span className='truncate ml-1 opacity-90'>({m.role})</span>
            </span>
          ))}
        </div>
      ) : null}

      {/* LIGNE COMPACTE: véhicule • carte carburant • télépéage */}

      {(equipe?.vehicule?.registrationId || equipe?.fuelCard?.matricule || equipe?.highwayCard?.matricule) && (
        <div className='mt-2 text-[11px] flex items-center flex-wrap gap-x-3 gap-y-1'>
          {equipe?.vehicule?.registrationId && (
            <span className='inline-flex items-center gap-1 min-w-0'>
              <Car size={14} className='flex-shrink-0 opacity-90' />
              <span className='truncate'>{equipe.vehicule.registrationId}</span>
            </span>
          )}

          {equipe?.fuelCard?.matricule && (
            <span className='inline-flex items-center gap-1 min-w-0'>
              <Fuel size={14} className='flex-shrink-0 opacity-90' />
              <span className='truncate'>{equipe.fuelCard.matricule}</span>
            </span>
          )}

          {equipe?.highwayCard?.matricule && (
            <span className='inline-flex items-center gap-1 min-w-0'>
              <Road size={14} className='flex-shrink-0 opacity-90' />
              <span className='truncate'>{equipe.highwayCard.matricule}</span>
            </span>
          )}
        </div>
      )}
    </>
  )
}

export default Page
