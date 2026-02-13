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
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Tooltip } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// import ExcelComponent, { prepareCalendarExportData } from '@/@core/components/excel/ExcelComponent'
import { ExportPlanningButton } from '@/@core/components/excel/ExcelBack'
import { formatToFrDate, parseLocalYmd } from '@/@core/utils/format'
import { useToastComponante } from '@/components/common/ToastComponante'
import { useGetAllAbsencesQuery } from '@/store/features/absence/absenceApi'
import { useCreatePlaningMutation, useLazyGetPlaningQuery } from '@/store/features/planing/planingApi'
import { Icon } from '@iconify/react'
import { Car, ChevronLeft, Fuel, List, RouteIcon as Road, Users, UserX } from 'lucide-react'

export interface CalendarEvent {
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
  isSiteDone?: boolean
  siteId?: string
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

const utcIsoToLocalYmd = (iso: string) => {
  const d = new Date(iso)
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

// les absences des membres d'une équipe pour la semaine courante
function getAbsencesForEquipe(equipe: IEquipe, absences: any[] | undefined): Record<string, string[]> {
  if (!absences || !equipe.members) return {}

  const absencesMap: Record<string, string[]> = {}

  equipe.members.forEach(member => {
    const memberAbsences = absences.filter(abs => abs.employee?.id === member.id)

    if (memberAbsences.length > 0) {
      absencesMap[member.id] = memberAbsences
        .map(abs => {
          const start = formatToFrDate(abs.startDate?.split('T')[0]) ?? ''
          const end = formatToFrDate(abs.endDate?.split('T')[0]) ?? start

          if (!start) return ''
          if (start === end) {
            return `${abs.absence} le ${start}`
          }
          return `${abs.absence} du ${start} au ${end}`
        })
        .filter(Boolean)
    }
  })

  return absencesMap
}

function resolveOperationColor(operation: any): string {
  return operation?.color || operation?.project?.clientAgency?.client?.color || '#408eceff'
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const { data: operations, isLoading: isFetchingOperations } = useGetAllOperationsQuery()
  const [createOperation] = useCreateOperationMutation()
  const { data: equipes } = useGetEquipesQuery()
  const [createPlanning] = useCreatePlaningMutation()
  const [getPlannings, { data: plannings, isLoading: isFetchingPlanning }] = useLazyGetPlaningQuery()
  const { data: abssences } = useGetAllAbsencesQuery({ startDate: week.startDate, endDate: week.endDate })

  const { confirmSave } = useToastComponante()

  const isLoading = isFetchingOperations || isFetchingPlanning

  const absenceEvents = useMemo(() => {
    if (!abssences || !equipes) return []

    return abssences.flatMap((abs: any) => {
      const equipe = equipes.find(eq => eq.members?.some(m => m.id === abs.employee.id))
      if (!equipe) return []

      // const startDay = toLocalYmdFromApi(abs.startDate)
      // const endDay = toLocalYmdFromApi(abs.endDate)
      const startDay = utcIsoToLocalYmd(abs.startDate)
      const endDay = utcIsoToLocalYmd(abs.endDate)

      const endPlusOne = parseLocalYmd(endDay)
      endPlusOne.setDate(endPlusOne.getDate() + 1)

      return {
        id: `absence-${abs.id}`,
        title: `${abs.employee.firstName} ${abs.employee.lastName} – ${abs.absence !== '' && abs.absence !== 'Autre' ? abs.absence : abs.autre} - ${abs.notes || ''}`,
        start: `${startDay}T09:00:00`,
        end: `${toYmdLocal(endPlusOne)}T10:00:00`,
        resourceId: equipe.id,
        editable: false,
        allDay: true,
        display: 'auto',
        classNames: ['fc-absence-event'],
        extendedProps: {
          type: 'absence',
          employee: abs.employee,
          absenceType: abs.absence
        }
      }
    })
  }, [abssences, equipes])

  // const absenceEvents = useMemo(() => {
  //   if (!abssences || !equipes) return []

  //   return abssences.flatMap((abs: any) => {
  //     const equipesConcernées = equipes.filter(eq => eq.members?.some(m => m.id === abs.employee.id))

  //     if (!equipesConcernées.length) return []

  //     const startDay = toLocalYmdFromApi(abs.startDate)
  //     const endDay = toLocalYmdFromApi(abs.endDate)

  //     const endPlusOne = parseLocalYmd(endDay)
  //     endPlusOne.setDate(endPlusOne.getDate() + 1)

  //     return equipesConcernées.map(equipe => ({
  //       id: `absence-${abs.id}-${equipe.id}`,
  //       title: `${abs.employee.firstName} ${abs.employee.lastName} – ${
  //         abs.absence || abs.autre
  //       }${abs.notes ? ` - ${abs.notes}` : ''}`,
  //       start: `${startDay}T09:00:00`,
  //       end: `${toYmdLocal(endPlusOne)}T10:00:00`,
  //       resourceId: equipe.id,
  //       editable: false,
  //       display: 'auto',
  //       classNames: ['fc-absence-event'],
  //       extendedProps: {
  //         type: 'absence',
  //         employee: abs.employee,
  //         absenceType: abs.absence
  //       }
  //     }))
  //   })
  // }, [abssences, equipes])

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
      const apiColor = resolveOperationColor(p.operation)

      const apiClientName =
        p.clientName || p.operation?.clientName || p.operation?.project?.clientAgency?.client?.clientName || ''

      const operationWithFlatColor = {
        ...p.operation,
        color: apiColor,
        clientName: apiClientName
      }

      return {
        ...makeCalendarEvent({
          operation: operationWithFlatColor,
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

    // const endDate = addDays(new Date(dateStr), gabarit - 1)
    const endDate = addDays(parseLocalYmd(dateStr), gabarit - 1)

    const endISO = `${toYmdLocal(endDate)}T10:00:00`
    const id = `${operation.id}-${dateStr}-${Date.now()}`

    // Check if this operation is already placed anywhere on the calendar
    if (placedOperationIds.has(operation.id)) {
      console.warn('[receive] operation already placed -> ignore', operation.id)
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
    // mark as unsaved (local change)
    setHasUnsavedChanges(true)
    setEvents(prev => [...prev, { ...newEvent, id }])
    setPlacedOperationIds(prev => new Set(prev).add(operation.id))
  }

  const resources: CalendarResource[] = useMemo(() => {
    return (equipes ?? []).map((e, i) => {
      const absencesThisWeek = getAbsencesForEquipe(e, abssences)
      const hasAbsenceInEquipe = Object.values(absencesThisWeek).some(
        (memberAbs: any) => (memberAbs as any[]).length > 0
      )

      return {
        id: e.id,
        title: e.members.map(m => `${m.name} ${m.role}`).join('\n'),
        day: '',
        row: i + 1,
        extendedProps: {
          equipe: e,
          absencesThisWeek,
          hasAbsenceInEquipe
        }
      }
    })
  }, [equipes, abssences])

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
    setHasUnsavedChanges(true)
  }

  const handleAddOperation = async (op: IOperationRequest) => {
    try {
      const added = await createOperation(op).unwrap()

      if (selectedDate && selectedResourceId) {
        const dateOnly = new Date(selectedDate).toISOString().split('T')[0]
        const equipe = equipes?.find(e => e.id === selectedResourceId) || null
        let endISO = dateOnly

        if (added.gabarit && added.gabarit > 1) {
          const endDate = addDays(new Date(dateOnly), added.gabarit - 1)
          endISO = endDate.toISOString().split('T')[0]
        }

        const newEvent = makeCalendarEvent({
          operation: added,
          dateISO: dateOnly,
          endISO,
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
    // adding operation to calendar is an unsaved local change
    setHasUnsavedChanges(true)
  }

  const handleSavePlanning = async () => {
    const planningRequests: IPlanningRequest[] = events.map(mapEventToPlanningRequest)
    try {
      const savedPlanning = await createPlanning({ plannings: planningRequests }).unwrap()
      confirmSave('Planning')
      const mappedEvents = savedPlanning.map(planning => {
        // const dateOnly = new Date(planning.startDate).toISOString().split('T')[0]
        const dateOnly = toYmdLocal(new Date(planning.startDate))
        const color = resolveOperationColor(planning.operation)
        return {
          id: `${planning.operation.id}-${dateOnly}`,
          planningId: planning.id,
          title: '',
          start: planning.startDate,
          end: planning.endDate,
          resourceId: planning.equipe.id,
          date: dateOnly,
          originalId: planning.operation.id,
          color,
          extendedProps: {
            operation: {
              ...planning.operation,
              color
            },
            equipe: planning.equipe
          }
        }
      })
      setEvents(mappedEvents)
      // after save, clear unsaved flag
      setHasUnsavedChanges(false)
      return
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du planning', err)
    }
  }

  const savePlanningAndUpdateSiteStatus = async (event: CalendarEvent) => {
    const planningRequest: IPlanningRequest = {
      ...mapEventToPlanningRequest(event)
    }
    const [savedPlanning] = await createPlanning({ plannings: [planningRequest] }).unwrap()
    const dateOnly = toYmdLocal(new Date(savedPlanning.startDate))
    const color = resolveOperationColor(savedPlanning.operation)

    const mapped: CalendarEvent = {
      id: `${savedPlanning.operation.id}-${dateOnly}`,
      planningId: savedPlanning.id,
      title: '',
      start: savedPlanning.startDate,
      end: savedPlanning.endDate,
      resourceId: savedPlanning.equipe.id,
      date: dateOnly,
      originalId: savedPlanning.operation.id,
      color,
      extendedProps: {
        operation: { ...savedPlanning.operation, color },
        equipe: savedPlanning.equipe
      },
      siteId: event.siteId,
      isSiteDone: event.isSiteDone || false
    }
    // setEvents(prev => prev.map(ev => (ev.id === mapped.id ? mapped : ev)))
    setEvents(prev =>
      prev.map(ev =>
        ev.id === event.id
          ? {
              ...ev,
              planningId: savedPlanning.id,
              siteId: event.siteId,
              isSiteDone: event.isSiteDone
            }
          : ev
      )
    )

    setHasUnsavedChanges(false)

    return mapped
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
      }
      return next
    })
  }

  const lastRangeRef = useRef<string>('')

  // Unsaved changes tracking for calendar edits
  const prevRangeRef = useRef<string>('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [unsavedDialogOpen, setUnsavedDialogOpen] = useState(false)
  const pendingDatesRef = useRef<{ startDate: string; endDate: string; key: string } | null>(null)

  const handelDataSet = (arg: any) => {
    const { startDate, endDate } = getCurrentWeek(arg.view)
    const key = `${startDate}|${endDate}`
    if (key === lastRangeRef.current) return

    if (hasUnsavedChanges) {
      // store pending navigation and show dialog
      pendingDatesRef.current = { startDate, endDate, key }
      prevRangeRef.current = lastRangeRef.current
      setUnsavedDialogOpen(true)
      return
    }

    lastRangeRef.current = key
    setWeek({ startDate, endDate })
    getPlannings({ startDate, endDate })
  }

  const allEvents = useMemo(() => {
    return events.map(ev => ({
      ...ev,
      extendedProps: {
        ...ev.extendedProps,
        eventId: ev.id
      },
      id: ev.id
    }))
  }, [events])

  const calendarEvents = useMemo(() => {
    return [...allEvents, ...absenceEvents]
  }, [allEvents, absenceEvents])

  const proceedToPendingDates = async (doSave: boolean) => {
    const pending = pendingDatesRef.current
    if (!pending) return

    if (doSave) await handleSavePlanning()

    lastRangeRef.current = pending.key
    setWeek({ startDate: pending.startDate, endDate: pending.endDate })
    getPlannings({ startDate: pending.startDate, endDate: pending.endDate })
    setUnsavedDialogOpen(false)
    pendingDatesRef.current = null
    setHasUnsavedChanges(false)
  }

  const cancelPendingNavigation = () => {
    // go back to previous range
    try {
      const api = calendarRef.current?.getApi()
      if (prevRangeRef.current) {
        const prevStart = prevRangeRef.current.split('|')[0]
        api?.gotoDate(prevStart)
      }
    } catch (err) {
      console.error('Failed to revert calendar date', err)
    }
    pendingDatesRef.current = null
    setUnsavedDialogOpen(false)
  }

  return (
    <div className='flex h-full'>
      {isLoading && (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50'>
          <CircularProgress />
        </div>
      )}
      <DndProvider backend={HTML5Backend}>
        <div
          ref={externalEventsRef}
          className={`transition-all duration-300 h-full overflow-y-auto border-r border-slate-200 ${
            isSidebarOpen ? 'w-64 p-4' : 'w-12 p-0'
          }`}
        >
          {isSidebarOpen ? (
            <>
              <div className='flex items-center justify-between mb-4'>
                <h2 className='text-lg font-semibold text-gray-700'>Operations</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className='p-1.5 hover:bg-slate-100 rounded-md transition-colors'
                  title='Masquer la liste des opérations'
                >
                  <ChevronLeft size={20} className='text-gray-600' />
                </button>
              </div>
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
            </>
          ) : (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className='mt-4 p-2 hover:bg-slate-100 rounded-md transition-colors flex items-center justify-center'
              title='Afficher la liste des opérations'
            >
              <List size={20} className='text-gray-600' />
            </button>
          )}

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
              events={calendarEvents}
              editable={true}
              droppable={true}
              // drop={handleEventReceive}
              eventReceive={handleEventReceive}
              // eventDrop={handleEventDrop}
              // eventClick={handleEventClick}
              eventChange={handleEventChange}
              // eventContent={renderEventContentWithDrop(
              //   setEvents,
              //   calendarRef,
              //   equipes,
              //   setOperationsList,
              //   setPlacedOperationIds,
              //   handleMembersChange,
              //   plannings
              // )}
              eventContent={arg => {
                if (arg.event.extendedProps?.type === 'absence') {
                  return <div className='fc-absence-content'>{arg.event.title}</div>
                }

                return renderEventContentWithDrop(
                  setEvents,
                  calendarRef,
                  equipes,
                  setOperationsList,
                  setPlacedOperationIds,
                  handleMembersChange,
                  plannings,
                  savePlanningAndUpdateSiteStatus
                )(arg)
              }}
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
              eventOverlap={true}
              selectOverlap={true}
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

      <Dialog open={unsavedDialogOpen} onClose={() => setUnsavedDialogOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Modifications non sauvegardées</DialogTitle>
        <DialogContent>
          <div>
            Vous avez des modifications non sauvegardées dans le planning. Si vous changez de semaine, ces modifications
            seront perdues.
          </div>
          <div className='mt-4'>Voulez-vous sauvegarder avant de changer de semaine ?</div>
          <div className='mt-4 flex gap-2 justify-end'>
            <button
              className='px-3 py-1 rounded bg-blue-600 text-white'
              onClick={async () => {
                await proceedToPendingDates(true)
              }}
            >
              Sauvegarder
            </button>
            <button
              className='px-3 py-1 rounded bg-red-600 text-white'
              onClick={async () => {
                await proceedToPendingDates(false)
              }}
            >
              Quitter (perdre)
            </button>
            <button className='px-3 py-1 rounded border' onClick={cancelPendingNavigation}>
              Annuler
            </button>
          </div>
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
  planings: IPlanning[] | undefined,
  savePlanningAndUpdateSiteStatus: (event: CalendarEvent) => Promise<CalendarEvent>
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
    const resource = resourceId ? eventInfo.event.getResources?.().find((r: any) => r.id === resourceId) : null

    const equipeFromResource = resourceId ? equipes?.find(e => e.id === resourceId) : undefined
    const equipe = ext.equipe ?? equipeFromResource

    const hasAbsenceInEquipe = resource?.extendedProps?.hasAbsenceInEquipe ?? ext.hasAbsenceInEquipe ?? false

    const absencesThisWeek = resource?.extendedProps?.absencesThisWeek ?? {}

    const operationForUI = {
      ...operation,
      eventId: eventInfo.event.id,
      equipe,
      hasAbsenceInEquipe,
      absencesThisWeek
    }

    const operationId = ext?.operation?.id
    const planningForOperation = planings?.find(p => p.operation?.id === operationId)
    const equipeChangedAt = planningForOperation?.equipeChangedAt

    const planningId = ext.planningId as string | undefined

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
        savePlanningAndUpdateSiteStatus={savePlanningAndUpdateSiteStatus}
        planningId={planningId}
        event={eventInfo.event}
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
    isSiteDone: event.isSiteDone,
    siteId: event.siteId,
    color: event.color || rawOp.color,
    clientName: rawOp.clientName,
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

  // const colors = operation?.project?.clientAgency?.client?.color
  const start = dateISO.includes('T') ? dateISO : `${dateISO}T${startTime}`
  const end = endISO ? (endISO.includes('T') ? endISO : `${endISO}T${endTime}`) : `${dateISO}T${endTime}`

  // Récupérer la couleur de l'opération
  const color = operation.color || operation?.project?.clientAgency?.client?.color || '#408eceff'

  return {
    id: `${operation.id}-${start.split('T')[0]}`,
    planningId,
    originalId: operation.id,
    title: operation.site?.map(s => s.label).join(', ') ?? '',
    start,
    end,
    date: start.split('T')[0],
    resourceId,
    color,
    extendedProps: {
      operation: { ...operation },
      equipe: equipe ?? null
    }
  }
}

function renderTeam(arg: any) {
  const equipe = arg.resource.extendedProps?.equipe
  const absencesThisWeek = arg.resource.extendedProps?.absencesThisWeek || {}

  return (
    <>
      {equipe?.members?.length ? (
        <div className='mt-1 -ml-1 pr-1 whitespace-nowrap flex flex-wrap'>
          {equipe.members.map((m: any) => {
            const memberAbsences = absencesThisWeek[m.id] || []
            const hasAbsence = memberAbsences.length > 0

            return (
              <span
                key={m.id}
                className='inline-flex items-center mx-1 my-0.5 rounded-full border border-white/20 py-[2px] text-[13px]'
                // title={`${m.name} (${m.role})${hasAbsence ? ` - Absent: ${memberAbsences.join(', ')}` : ''}`}
              >
                <Users size={12} className='mr-1 flex-shrink-0 opacity-90' />
                <span className='truncate'>{m.name}</span>
                <span className='truncate ml-1 opacity-90'>({m.role})</span>
                {hasAbsence && (
                  <Tooltip title={memberAbsences.join(' ; ')} arrow placement='top'>
                    <span className='ml-1 text-red-500 font-bold inline-flex'>
                      <UserX size={12} />
                    </span>
                  </Tooltip>
                )}
              </span>
            )
          })}
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
