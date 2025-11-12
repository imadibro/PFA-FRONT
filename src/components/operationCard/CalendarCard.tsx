import { TOAST_ACTIONS, TOAST_COMPONENTS, toastMessageSuccess } from '@/@core/utils/toast-message'
import type { IEquipe, IOperation } from '@/@core/utils/types'
import { useToastComponante } from '@/components/common/ToastComponante'
import { useDeleteOperationMutation } from '@/store/features/operation/operationApi'
import { useDeletePlaningMutation } from '@/store/features/planing/planingApi'
import Tooltip from '@mui/material/Tooltip'
import { InfoIcon, MessageSquareTextIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useDrop } from 'react-dnd'
import toast from 'react-hot-toast'
import OperationHeader from './OperationHeader'

// Define ExternalEvent type if not already imported
type ExternalEvent = {
  id: string
  [key: string]: any
}

export function CalendarCard({
  operation,
  equipe,
  onEquipeDrop,
  calendarRef,
  setEvents,
  setOperations,
  setPlacedOperationIds,
  handleMembersChange,
  equipeChangedAt
}: {
  operation: IOperation & { eventId?: string }
  equipe?: IEquipe
  onEquipeDrop?: (equipe: IEquipe) => void
  calendarRef: React.RefObject<any>
  setEvents: React.Dispatch<React.SetStateAction<ExternalEvent[]>>
  setOperations: React.Dispatch<React.SetStateAction<IOperation[]>>
  setPlacedOperationIds: React.Dispatch<React.SetStateAction<Set<string>>>
  handleMembersChange?: (eventId: string, newMembers: { id: string; name: string; role: string }[]) => void
  equipeChangedAt?: Date | null | undefined
}) {
  const divRef = React.useRef<HTMLDivElement>(null)

  // State for action menu visibility
  const [showMenu, setShowMenu] = useState(false)

  const [deletePlanning] = useDeletePlaningMutation()

  const [deleteOperation] = useDeleteOperationMutation()

  // Use the custom hook for toast notifications
  const { showDeletToast, confirmDeleteWithCheckbox, showErrorToast } = useToastComponante()

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

  // const handleDeleteOperation = async (eventId: string, operationId: string) => {
  //   const ok = await confirmDeleteWithCheckbox(
  //     'cette opération',
  //     'Je comprends que cette action est irréversible et je souhaite supprimer cette opération.'
  //   )
  //   if (!ok) return

  //   const api = calendarRef.current?.getApi()
  //   const fullEvent = api?.getEventById?.(eventId)
  //   if (!fullEvent) {
  //     console.error("Événement non trouvé pour l'ID:", eventId)
  //     return
  //   }

  //   // lire l'op avant remove()
  //   const raw = fullEvent.extendedProps?.operation
  //   const op: IOperation | null = typeof raw === 'string' ? JSON.parse(raw) : raw

  //   const planningId = fullEvent.extendedProps?.planningId

  //   if (planningId) {
  //     try {
  //       const ok = await deletePlanning({ id: planningId }).unwrap()
  //       if (ok) {
  //         showDeletToast('Planning')
  //       }
  //     } catch (err) {
  //       //toast.error(err)
  //       // optionnel: resync UI si tu veux rollback visuel
  //       // refetchPlaning?.(); refetchOperations?.();
  //       return
  //     }
  //   }

  //   // 1) supprimer UNIQUEMENT l'event courant
  //   fullEvent.remove()
  //   setEvents(prev => prev.filter(ev => ev.id !== eventId))

  //   // y a-t-il d'autres events de la même opération encore présents ?
  //   const hasOtherInstances = api
  //     ?.getEvents()
  //     ?.some((e: any) => e.extendedProps?.operation?.id === operationId && e.id !== eventId)

  //   // 2) ne l’enlever de placedOperationIds que s’il n’en reste plus
  //   setPlacedOperationIds(prev => {
  //     if (hasOtherInstances) return prev
  //     const next = new Set(prev)
  //     next.delete(operationId)
  //     return next
  //   })

  //   // 3) réinjecter à gauche (une seule fois), marqué isPlanified=false
  //   if (!hasOtherInstances && op) {
  //     const opBack = { ...op, isPlanified: false }
  //     setOperations(prev => {
  //       if (prev.some(o => o.id === operationId)) return prev
  //       return [opBack, ...prev]
  //     })
  //   }
  // }

  const handleDeleteOperation = async (eventId: string, operationId: string) => {
    // Destructurer le résultat pour obtenir isConfirmed et checkboxChecked
    const { isConfirmed, checkboxChecked } = await confirmDeleteWithCheckbox(
      'cette opération',
      'Voulez-vous supprimer cette operation de facon difinitive.'
    )

    // Si l'utilisateur annule
    if (!isConfirmed) return

    const api = calendarRef.current?.getApi()
    const fullEvent = api?.getEventById?.(eventId)
    if (!fullEvent) {
      console.error("Événement non trouvé pour l'ID:", eventId)
      return
    }

    const raw = fullEvent.extendedProps?.operation
    const op: IOperation | null = typeof raw === 'string' ? JSON.parse(raw) : raw
    const planningId = fullEvent.extendedProps?.planningId

    // CAS 1: Checkbox coché = Suppression définitive via API
    if (checkboxChecked) {
      try {
        if (planningId) {
          await deletePlanning({ id: planningId }).unwrap()
        }

        await deleteOperation({ id: operationId }).unwrap()

        fullEvent.remove()
        setEvents(prev => prev.filter(ev => ev.id !== eventId))

        setPlacedOperationIds(prev => {
          const next = new Set(prev)
          next.delete(operationId)
          return next
        })

        toast.success(toastMessageSuccess(TOAST_COMPONENTS.OPERATION, TOAST_ACTIONS.DELETE))
        showDeletToast('Operation')
      } catch (error) {
        showErrorToast(error)
      }
      return
    }

    // CAS 2: Checkbox non coché = Retirer du planning et remettre à gauche
    if (planningId) {
      try {
        await deletePlanning({ id: planningId }).unwrap()
        showDeletToast('Planning')
      } catch (err) {
        showErrorToast(err)
        return
      }
    }

    // Remove the event from calendar
    fullEvent.remove()
    setEvents(prev => prev.filter(ev => ev.id !== eventId))

    // Remove from placed operations and add back to sidebar
    setPlacedOperationIds(prev => {
      const next = new Set(prev)
      next.delete(operationId)
      return next
    })

    // Re-add operation to sidebar
    if (op) {
      const opBack = { ...op, isPlanified: false }
      setOperations(prev => {
        if (prev.some(o => o.id === operationId)) return prev
        return [opBack, ...prev]
      })
    }
  }

  const handleMembersSave = (members: { id: string; name: string; role: string }[]) => {
    if (!operation.eventId) return
    // 1) maj locale minimale (pour retour visuel instantané)
    setEvents(prev =>
      prev.map(ev =>
        ev.id === operation.eventId
          ? { ...ev, extendedProps: { ...ev.extendedProps, equipe: { ...(ev.extendedProps?.equipe ?? {}), members } } }
          : ev
      )
    )
    // 2) push au parent => qui déclenchera le call API si planningId existe
    handleMembersChange?.(operation.eventId, members)
  }

  const handleOpenCommentModal = () => {
    alert(1)
  }

  const getTextClassFromHex = (hex?: string) => {
    if (!hex) return 'text-white'
    try {
      const c = hex.replace('#', '')
      const r = parseInt(c.substring(0, 2), 16)
      const g = parseInt(c.substring(2, 4), 16)
      const b = parseInt(c.substring(4, 6), 16)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      return luminance > 0.6 ? 'text-black' : 'text-white'
    } catch {
      return 'text-white'
    }
  }

  const textColorClass = getTextClassFromHex(operation?.color)

  return (
    <div
      ref={divRef}
      className={`w-full rounded-md shadow hover:shadow-md transition-shadow overflow-hidden ${
        isOver && canDrop ? 'ring-2 ring-blue-400' : ''
      }`}
      style={{
        position: 'relative',
        backgroundColor: operation?.color ? operation.color : undefined
      }}
    >
      {/* <div className='p-2 sm:p-3 leading-tight text-white'> */}
      <div className={`p-2 sm:p-3 leading-tight ${textColorClass}`}>
        {/* Titre + menu (tu gardes ton OperationHeader tel quel) */}
        <OperationHeader
          operation={operation}
          equipe={equipe}
          onDelete={handleDeleteOperation}
          onMembersSave={handleMembersSave}
        />

        {/* Membres — puces fines, sur une seule ligne scrollable */}
        {/* {equipe?.members?.length ? (
          <div className='mt-1 pr-1 flex flex-wrap'>
            {equipe.members.map(m => (
              <span
                key={m.id}
                className='inline-flex items-center my-0.5 rounded-full border border-white/20 px-2 py-[2px] text-[11px] font-medium'
                title={`${m.name} (${m.role})`}
              >
                <Users size={12} className='mr-1 flex-shrink-0 opacity-90' />
                <span className='truncate'>{m.name}</span>
                <span className='truncate ml-1 opacity-90'>({m.role})</span>
              </span>
            ))}
          </div>
        ) : null} */}

        {/* LIGNE COMPACTE: véhicule • carte carburant • télépéage */}

        {/* {(equipe?.vehicule?.registrationId || equipe?.fuelCard?.matricule || equipe?.highwayCard?.matricule) && (
          <div className='mt-2 text-[12px] flex items-center flex-wrap gap-x-3 gap-y-1'>
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
        )} */}

        {operation?.comment && (
          <div className='border-t border-white/10 mt-2 pt-2'>
            <div className='flex items-center gap-2 text-[12px]'>
              <div className='flex items-start gap-1' onClick={handleOpenCommentModal}>
                <MessageSquareTextIcon size={14} className='mt-[1px] opacity-90' />
                <div className='truncate opacity-95' dangerouslySetInnerHTML={{ __html: operation.comment || '' }} />
              </div>

              {equipeChangedAt && (
                <Tooltip
                  title={`Équipe modifiée le ${new Date(equipeChangedAt).toLocaleString('fr-FR')}`}
                  arrow
                  placement='top'
                >
                  <div className='flex items-center gap-1 text-yellow-200 cursor-help'>
                    <InfoIcon size={16} className='text-yellow-400' />
                    {/* <span className='truncate'>Équipe modifiée</span> */}
                  </div>
                </Tooltip>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
