// import { useState } from 'react'
// import { Alert, Box, FormControlLabel, IconButton, Switch, TextField } from '@mui/material'
// import Typography from '@mui/material/Typography'
// import Autocomplete from '@mui/material/Autocomplete'
// import Chip from '@mui/material/Chip'
// import { styled } from '@mui/material/styles'
// import Tooltip from '@mui/material/Tooltip'
// import Checkbox from '@mui/material/Checkbox'
// import type { SystemMode } from '@core/types'
// import CustomIconButton from '@/@core/components/mui/IconButton'
// import useSweetAlert from '@/@core/hooks/useSweetAlert'
// import type { IOperation, ITask } from '@/@core/utils/types'
// import { useUpdateOperationMutation } from '@/store/features/operation/operationApi'

// const StyledChip = styled(Chip)({
//   '&.MuiChip-root': {
//     backgroundColor: 'rgb(var(--mui-palette-text-primaryChannel) / 0.08)',
//     borderRadius: '16px'
//   },
//   '.MuiChip-deleteIcon': {
//     color: '#0363C4'
//   }
// })

// const icon = <i className='tabler:circle-check' />
// const checkedIcon = <i className='tabler:checkbox' />

// const UpdateOperation = ({
//   mode,
//   operationToEdit,
//   tasks,
//   onClose
// }: {
//   mode: SystemMode
//   operationToEdit: IOperation | null
//   tasks: ITask[]
//   onClose: () => void
// }) => {
//   const [combinedTasks, setCombinedTasks] = useState<ITask[] | null>([...tasks, ...(operationToEdit?.tasks || [])])
//   const [durationMode, setDurationMode] = useState(operationToEdit?.durationMode === 'h' ? true : false)

//   const [selectedTasks, setSelectedTasks] = useState<ITask[]>([...(operationToEdit?.tasks || [])])

//   const { showAlert, showToast } = useSweetAlert()

//   const [updateOperation, { isLoading, isError, error, isSuccess }] = useUpdateOperationMutation()

//   const handleUpdateOperationSubmit = async (event: React.FormEvent) => {
//     event.preventDefault()
//     const formData = new FormData(event.currentTarget as HTMLFormElement)
//     const label = formData.get('label') as string
//     const duration = formData.get('duration') as string
//     const durationModeChar = durationMode ? 'h' : 'j'
//     const description = formData.get('description') as string

//     const initialTasks = operationToEdit?.tasks || []
//     const tasksToAdd = selectedTasks.filter(task => !initialTasks.some(t => t.id === task.id))?.map(item => item.id)
//     const tasksToRemove = initialTasks.filter(task => !selectedTasks.some(t => t.id === task.id))?.map(item => item.id)

//     if (!operationToEdit?.id) return
//     try {
//       await updateOperation({
//         id: operationToEdit.id,
//         label,
//         duration: Number(duration),
//         durationMode: durationModeChar,
//         description,
//         tasksToAdd,
//         tasksToRemove
//       }).unwrap()
//       onClose()
//       showToast('Opération modifiée avec succès!', 'success')
//     } catch (err) {
//       showAlert('Error', "Une erreur s'est produite lors de la tentative de mise à jour de l'opération", 'error')
//     }
//   }

//   return (
//     <div className='bg-backgroundPaper p-4' style={{ minWidth: 450 }}>
//       <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, left: 8 }}>
//         <i className='tabler-x' />
//       </IconButton>
//       <Typography variant='h4' className='my-4  mt-10'>
//         Mise à jour de l'opération
//       </Typography>
//       <Box sx={{ width: '100%' }}>
//         <form onSubmit={handleUpdateOperationSubmit}>
//           {isError && (
//             <Alert severity='error'>{(error as any)?.data?.message || "Échec de la mise à jour de l'opération"}</Alert>
//           )}
//           <div className='mb-4'>
//             <TextField
//               size='small'
//               name='label'
//               label='Libellé'
//               placeholder='Libellé'
//               defaultValue={operationToEdit?.label}
//               required
//               fullWidth
//             />
//           </div>
//           <div className='mb-4'>
//             <TextField
//               type='number'
//               size='small'
//               name='duration'
//               label={`durée ${durationMode ? 'en heures' : 'en jours'}`}
//               placeholder='Durée'
//               required
//               fullWidth
//               defaultValue={operationToEdit?.duration}
//               inputProps={{
//                 inputMode: 'numeric',
//                 pattern: '[0-9]*'
//               }}
//               onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
//                 e.target.value = e.target.value.replace(/[^0-9]/g, '')
//               }}
//             />
//             <FormControlLabel
//               control={
//                 <Switch
//                   size='small'
//                   checked={durationMode}
//                   onChange={(event: React.ChangeEvent<HTMLInputElement>) => setDurationMode(!durationMode)}
//                 />
//               }
//               label='en heure'
//               className='float-end mb-3'
//             />
//           </div>
//           <div className='mb-4'>
//             <TextField
//               size='small'
//               name='description'
//               label='description'
//               placeholder='description'
//               defaultValue={operationToEdit?.description}
//               rows={4}
//               fullWidth
//               multiline
//             />
//           </div>

//           <div className='my-8'>
//             <Autocomplete
//               multiple
//               id='checkboxes-tasks'
//               options={combinedTasks || []}
//               disableCloseOnSelect
//               getOptionLabel={option => option.label}
//               value={selectedTasks}
//               onChange={(event, newValue) => setSelectedTasks(newValue)}
//               ChipProps={{ color: 'warning' }}
//               renderOption={(props, option, { selected }) => (
//                 <li {...props} key={option.id}>
//                   <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
//                   {option.label}
//                 </li>
//               )}
//               limitTags={5}
//               renderInput={params => <TextField {...params} fullWidth label='Tâches ciblées' />}
//               renderTags={(value, getTagProps) =>
//                 value.map((option, index) => (
//                   <Tooltip title={`${option.label}`} key={option.id}>
//                     <StyledChip {...getTagProps({ index })} label={`${option.label}`} />
//                   </Tooltip>
//                 ))
//               }
//             />
//           </div>
//           <CustomIconButton
//             type='submit'
//             color='primary'
//             variant='contained'
//             size='small'
//             className='h-10 mt-4'
//             disabled={isLoading}
//           >
//             <span className='tabler-edit w-5 h-5 mr-2' />
//             {isLoading ? 'Mise à jour...' : 'Modifier'}
//           </CustomIconButton>
//         </form>
//       </Box>
//     </div>
//   )
// }

// export default UpdateOperation

'use client'

import { useState } from 'react'
import { Box, IconButton, TextField, Button, Checkbox, Tooltip, Typography, Grid } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import {
  useGetOperationsTypesQuery,
  useGetOperationsZonesQuery,
  useGetOperationsTransQuery,
  useUpdateOperationTasksMutation
} from '@/store/features/operation/operationTasksApi'
import type {
  IOperation,
  IOperationTask,
  IOperationTrans,
  IOperationType,
  IOperationZone,
  ITask
} from '@/@core/utils/types'

const StyledChip = styled(Chip)({
  '&.MuiChip-root': {
    backgroundColor: 'rgb(var(--mui-palette-text-primaryChannel) / 0.08)',
    borderRadius: '16px'
  },
  '.MuiChip-deleteIcon': {
    color: '#0363C4'
  }
})

const icon = <i className='tabler:circle-check' />
const checkedIcon = <i className='tabler:checkbox' />

const UpdateOperation = ({
  operationToEdit,
  tasks,
  onClose
}: {
  operationToEdit: IOperationTask
  tasks: ITask[]
  onClose: () => void
}) => {
  const { showAlert, showToast } = useSweetAlert()
  const [updateOperation, { isLoading }] = useUpdateOperationTasksMutation()

  const [selectedType, setSelectedType] = useState<IOperationType | null>(operationToEdit?.operationType || null)
  const [selectedZone, setSelectedZone] = useState<IOperationZone | null>(operationToEdit?.operationZone || null)
  const [selectedTrans, setSelectedTrans] = useState<IOperationTrans | null>(operationToEdit?.operationTrans || null)
  const [selectedTasks, setSelectedTasks] = useState<ITask[]>(operationToEdit?.tasks || [])

  const { data: operationTypes } = useGetOperationsTypesQuery()
  const { data: operationZones } = useGetOperationsZonesQuery()
  const { data: operationTrans } = useGetOperationsTransQuery()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedType || !selectedZone || !selectedTrans || selectedTasks.length === 0) {
      showAlert('Erreur', 'Veuillez remplir tous les champs', 'error')
      return
    }

    const form = new FormData(e.currentTarget as HTMLFormElement)

    const initialTasks = operationToEdit?.tasks || []
    const tasksToAdd = selectedTasks.filter(t => !initialTasks.some(init => init.id === t.id)).map(t => t.id)
    // const tasksToRemove = initialTasks.filter(t => !selectedTasks.some(sel => sel.id === t.id)).map(t => t.id)
    const newTasks = selectedTasks.map(t => t.id)

    try {
      await updateOperation({
        id: operationToEdit.id,
        // label,
        operationTypeId: selectedType.id,
        operationZoneId: selectedZone.id,
        operationTransId: selectedTrans.id,
        tasksToAdd: newTasks
        // tasksToRemove
      }).unwrap()
      showToast('Opération modifiée avec succès', 'success')
      onClose()
    } catch (err) {
      showAlert('Erreur', "La mise à jour de l'opération a échoué", 'error')
    }
  }

  return (
    <Box sx={{ width: '100%', position: 'relative', p: 4, minWidth: 450 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant='h6' sx={{ fontWeight: 600 }}>
          Modifier type d'opération
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'grey.600' }}>
          <i className='tabler-x' />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <Autocomplete
            options={operationTypes || []}
            getOptionLabel={option => option.label}
            value={selectedType}
            onChange={(e, val) => setSelectedType(val)}
            renderInput={params => <TextField {...params} fullWidth label='Opération' size='small' />}
          />
        </div>

        <div className='mb-4'>
          <Autocomplete
            options={operationZones || []}
            getOptionLabel={option => option.label}
            value={selectedZone}
            onChange={(e, val) => setSelectedZone(val)}
            renderInput={params => <TextField {...params} fullWidth label='Zone' size='small' />}
          />
        </div>

        <div className='mb-4'>
          <Autocomplete
            options={operationTrans || []}
            getOptionLabel={option => option.label}
            value={selectedTrans}
            onChange={(e, val) => setSelectedTrans(val)}
            renderInput={params => <TextField {...params} fullWidth label='Trans' size='small' />}
          />
        </div>

        <div className='mb-4'>
          <Autocomplete
            multiple
            options={tasks}
            getOptionLabel={option => option.label}
            value={selectedTasks}
            onChange={(event, newValue) => setSelectedTasks(newValue)}
            renderInput={params => <TextField {...params} fullWidth label='Tâches ciblées' size='small' />}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option.id}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {option.label}
              </li>
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Tooltip title={`${option.label}`} key={option.id}>
                  <StyledChip
                    {...getTagProps({ index })}
                    variant='filled'
                    deleteIcon={<i className='tabler:trash' />}
                    label={`${option.label}`}
                    onAbort={() => setSelectedTasks(selectedTasks.filter(t => t.id !== option.id))}
                  />
                </Tooltip>
              ))
            }
          />
        </div>
        <Grid item xs={12} sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            type='submit'
            variant='contained'
            fullWidth
            sx={{ fontWeight: 600, bgcolor: '#7C5CFA', '&:hover': { bgcolor: '#6c4edb' } }}
            disabled={isLoading}
          >
            {isLoading ? 'Modifier...' : 'Modifier'}
          </Button>

          <Button
            fullWidth
            disabled={isLoading}
            onClick={onClose}
            style={{ marginLeft: 3 }}
            variant='outlined'
            color='error'
          >
            Annuler
          </Button>
        </Grid>
      </form>
    </Box>
  )
}

export default UpdateOperation
