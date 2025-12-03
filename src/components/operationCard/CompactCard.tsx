import { TOAST_ACTIONS, TOAST_COMPONENTS, toastMessageSuccess } from '@/@core/utils/toast-message'
import type { IEquipe, IOperation } from '@/@core/utils/types'
import { useToastComponante } from '@/components/common/ToastComponante'
import { useDeleteOperationMutation } from '@/store/features/operation/operationApi'
import { Icon } from '@iconify/react'
import { IconButton } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import {
  Car,
  CheckSquare,
  Fuel,
  MapPin,
  MessageSquareTextIcon,
  RefreshCcw,
  RouteIcon as Road,
  Users
} from 'lucide-react'
import toast from 'react-hot-toast'

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
  const { showDeletToast, showErrorToast, confirmDelete } = useToastComponante()
  const [deleteOperation] = useDeleteOperationMutation()

  const handleDelete = async (id: string) => {
    if (!id) return
    const confirm = await confirmDelete('cette operation')
    try {
      if (!confirm) return
      await deleteOperation({ id }).unwrap()
      toast.success(toastMessageSuccess(TOAST_COMPONENTS.OPERATION, TOAST_ACTIONS.DELETE))
      showDeletToast('Operation')
    } catch (error) {
      showErrorToast(error)
    }
  }
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
        <Tooltip title={operation?.project?.projectCode} arrow>
          <h3 className='font-semibold text-sm truncate'>{operation?.clientAbri || operation?.project?.projectCode}</h3>
        </Tooltip>

        <div className='mt-2 text-xs'>
          <div className='flex items-center flex-nowrap gap-3 min-w-0'>
            <span className='flex items-center gap-1 text-slate-600 min-w-0'>
              <MapPin size={12} />
              <span className='truncate min-w-0'>{operation?.site?.map(s => s.siteNbr)}</span>
            </span>

            <span className='flex items-center gap-1 text-slate-600'>
              <CheckSquare size={12} />
              {`${operation?.gabarit} jrs`}
            </span>
          </div>
        </div>

        {(operation?.comment || operation?.isRecursive) && (
          <div className='flex items-center justify-between border-t border-slate-200 pt-2 gap-2'>
            <span className='flex items-center gap-2 text-slate-600 min-w-0'>
              {operation?.comment && <MessageSquareTextIcon size={12} />}
              {operation?.comment ? (
                <div className='truncate min-w-0' dangerouslySetInnerHTML={{ __html: operation?.comment || '' }} />
              ) : (
                <span className='text-xs text-slate-400'>—</span>
              )}
            </span>

            <span className='flex items-center gap-2 text-slate-500 shrink-0'>
              {/* {operation?.isRecursive ? <RefreshCcw size={12} /> : <RefreshCwOff size={12} />} */}
              {operation?.isRecursive && <RefreshCcw size={12} />}

              <IconButton size='small' color='error' title='Supprimer' onClick={() => handleDelete(operation.id!)}>
                <Icon icon='tabler:trash-x' />
              </IconButton>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
