// import useSweetAlert from '@/@core/hooks/useSweetAlert'
// import type { IRequirement, ISite } from '@/@core/utils/types'
// import SidebarDrawerForm from '@/components/layout/shared/DrawerForm'
// import {
//   useCreateSiteMutation,
//   useGetSiteOwnersQuery,
//   useGetSiteTypesQuery,
//   useUpdateSiteMutation
// } from '@/store/features/site/siteApi'
// import type { SystemMode } from '@core/types'
// import { Alert, Box, Button, TextField } from '@mui/material'
// import Autocomplete from '@mui/material/Autocomplete'
// import Checkbox from '@mui/material/Checkbox'
// import Chip from '@mui/material/Chip'
// import FormControl from '@mui/material/FormControl'
// import InputLabel from '@mui/material/InputLabel'
// import MenuItem from '@mui/material/MenuItem'
// import Select from '@mui/material/Select'
// import { styled } from '@mui/material/styles'
// import Tooltip from '@mui/material/Tooltip'
// import dynamic from 'next/dynamic'
// import draftToHtml from 'draftjs-to-html'
// import { convertFromHTML } from 'draft-convert'
// import { EditorState, convertToRaw } from 'draft-js'
// import { useForm, Controller } from 'react-hook-form'
// import { useEffect, useState } from 'react'
// import { useToastComponante } from '@/components/common/DeletedComponante'

// const RichTextEditor = dynamic(() => import('@/views/site/RichTextEditor'), { ssr: false })

// const StyledChip = styled(Chip)({
//   '&.MuiChip-root': { backgroundColor: 'rgb(var(--mui-palette-text-primaryChannel) / 0.08)', borderRadius: '16px' },
//   '.MuiChip-deleteIcon': { color: '#0363C4' }
// })

// const icon = <i className='tabler:circle-check' />
// const checkedIcon = <i className='tabler:checkbox' />

// type FormValues = {
//   siteNbr: string
//   label: string
//   siteOwnerId: string
//   siteTypeId: string
//   requirements: IRequirement[]
//   description: EditorState
// }

// const SiteForm = ({
//   mode,
//   isOpen,
//   siteToEdit,
//   requirements,
//   onClose,
//   isEditMode
// }: {
//   mode: SystemMode
//   isOpen: boolean
//   siteToEdit?: ISite | null
//   requirements: IRequirement[]
//   onClose: () => void
//   isEditMode: boolean
// }) => {
//   const { showAlert } = useSweetAlert()
//   const { confirmUpdate, confirmAdd } = useToastComponante()
//   const [updateSite, { isLoading: isUpdating, isError: updateError, error: updateErr }] = useUpdateSiteMutation()
//   const [createSite, { isLoading: isCreating, isError: createError, error: createErr }] = useCreateSiteMutation()

//   const [editorState, setEditorState] = useState<any>(EditorState.createEmpty())

//   if (isEditMode && siteToEdit?.description) {
//     const contentState = convertToRaw(editorState.getCurrentContent())
//     const htmlContent = siteToEdit.description || ''

//     if (contentState.blocks.length === 1 && contentState.blocks[0].text === '') {
//       const newContentState = convertFromHTML(htmlContent)
//       const newEditorState = EditorState.createWithContent(newContentState)
//       setEditorState(newEditorState)
//     }
//   }

//   const { data: siteOwners } = useGetSiteOwnersQuery()
//   const defaultSiteOwner = siteOwners?.find(owner => owner.name.toLowerCase() === 'autre')
//   const { data: siteTypes } = useGetSiteTypesQuery()
//   const defaultSiteType = siteTypes?.find(type => type.name.toLowerCase() === 'autre')

//   const isUpdatingSite = isEditMode && siteToEdit?.id
//   const isLoading = isUpdatingSite ? isUpdating : isCreating
//   const isError = isUpdatingSite ? updateError : createError
//   const error = isUpdatingSite ? updateErr : createErr

//   const {
//     control,
//     handleSubmit,
//     reset,
//     formState: { errors }
//   } = useForm<FormValues>({
//     defaultValues: {
//       siteNbr: '',
//       label: '',
//       siteOwnerId: '',
//       siteTypeId: '',
//       requirements: [],
//       description: EditorState.createEmpty()
//     }
//   })

//   // initialiser les valeurs pour le mode édition ou reset pour ajout
//   useEffect(() => {
//     if (isEditMode && siteToEdit) {
//       reset({
//         siteNbr: siteToEdit.siteNbr || '',
//         label: siteToEdit.label || '',
//         siteOwnerId: siteToEdit.siteOwnerId || '',
//         siteTypeId: siteToEdit.siteTypeId || '',
//         requirements: siteToEdit.requirements || [],
//         description: EditorState.createEmpty()
//       })
//     } else if (isOpen) {
//       reset({
//         siteNbr: '',
//         label: '',
//         siteOwnerId: '',
//         siteTypeId: '',
//         requirements: [],
//         description: EditorState.createEmpty()
//       })
//     }
//   }, [isEditMode, siteToEdit, isOpen, reset])

//   const onSubmit = async (data: FormValues) => {
//     const descriptionHtml = draftToHtml(convertToRaw(data.description.getCurrentContent()))
//     const ownerId = data.siteOwnerId || defaultSiteOwner?.id
//     const typeId = data.siteTypeId || defaultSiteType?.id
//     try {
//       if (isUpdatingSite) {
//         const initialRequirements = siteToEdit?.requirements || []
//         const reqToAdd = data.requirements.filter(req => !initialRequirements.some(t => t.id === req.id)).map(r => r.id)
//         const reqToRemove = initialRequirements
//           .filter(req => !data.requirements.some(t => t.id === req.id))
//           .map(r => r.id)

//         await updateSite({
//           id: siteToEdit!.id,
//           label: data.label,
//           siteNbr: data.siteNbr,
//           description: descriptionHtml,
//           siteOwnerId: ownerId,
//           siteTypeId: typeId,
//           requirementsToAdd: reqToAdd,
//           requirementsToRemove: reqToRemove
//         }).unwrap()
//         await confirmUpdate('Site')
//       } else {
//         await createSite({
//           label: data.label,
//           siteNbr: data.siteNbr,
//           description: descriptionHtml,
//           siteOwnerId: ownerId,
//           siteTypeId: typeId,
//           requirementsIds: data.requirements.map(r => r.id)
//         }).unwrap()
//         await confirmAdd('Site')
//       }
//       reset()
//       onClose()
//     } catch (err) {
//       console.error('Erreur site submit:', err)
//       showAlert(
//         'Erreur',
//         `Une erreur est survenue lors de la ${isUpdatingSite ? 'mise à jour' : 'création'} du site`,
//         'error'
//       )
//     }
//   }

//   return (
//     <SidebarDrawerForm headerTitle={`${isEditMode ? 'Modifier' : 'Ajouter'} site`} open={isOpen} toggle={onClose}>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         {isError && (
//           <Alert severity='error'>
//             {(error as any)?.data?.message || `Échec de la ${isUpdatingSite ? 'mise à jour' : 'création'} du site`}
//           </Alert>
//         )}

//         <div className='mb-4 mt-5'>
//           <Controller
//             name='siteNbr'
//             control={control}
//             rules={{ required: 'Numéro requis' }}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 size='small'
//                 label='Numéro de site'
//                 placeholder='Numéro de site'
//                 fullWidth
//                 error={!!errors.siteNbr}
//                 helperText={errors.siteNbr?.message}
//               />
//             )}
//           />
//         </div>

//         <div className='mb-4'>
//           <Controller
//             name='label'
//             control={control}
//             rules={{ required: 'Libellé requis' }}
//             render={({ field }) => (
//               <TextField
//                 {...field}
//                 size='small'
//                 label='Libellé'
//                 placeholder='Libellé'
//                 fullWidth
//                 error={!!errors.label}
//                 helperText={errors.label?.message}
//               />
//             )}
//           />
//         </div>

//         <div className='mb-4'>
//           <FormControl fullWidth>
//             <InputLabel>Propriétaire du site</InputLabel>
//             <Controller
//               name='siteOwnerId'
//               control={control}
//               render={({ field }) => (
//                 <Select {...field} label='Propriétaire' size='small' >
//                   {siteOwners?.map(owner => (
//                     <MenuItem key={owner.id} value={owner.id}>
//                       {owner.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               )}
//             />
//           </FormControl>
//         </div>

//         <div className='mb-4'>
//           <FormControl fullWidth>
//             <InputLabel>Type de site</InputLabel>
//             <Controller
//               name='siteTypeId'
//               control={control}
//               render={({ field }) => (
//                 <Select {...field} label='Type' size='small'>
//                   {siteTypes?.map(type => (
//                     <MenuItem key={type.id} value={type.id}>
//                       {type.name}
//                     </MenuItem>
//                   ))}
//                 </Select>
//               )}
//             />
//           </FormControl>
//         </div>

//         <div className='mb-4'>
//           <Controller
//             name='requirements'
//             control={control}
//             render={({ field: { value, onChange } }) => (
//               <Autocomplete
//                 multiple
//                 options={requirements || []}
//                 disableCloseOnSelect
//                 getOptionLabel={option => option.label}
//                 value={value}
//                 onChange={(_, newValue) => onChange(newValue)}
//                 renderOption={(props, option, { selected }) => (
//                   <li {...props} key={option.id}>
//                     <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
//                     {option.label}
//                   </li>
//                 )}
//                 limitTags={5}
//                 renderInput={params => <TextField {...params} fullWidth label="Contraintes d'accès" size='small' />}
//                 renderTags={(value, getTagProps) =>
//                   value.map((option, index) => (
//                     <Tooltip title={option.label} key={option.id}>
//                       <StyledChip {...getTagProps({ index })} label={option.label} />
//                     </Tooltip>
//                   ))
//                 }
//               />
//             )}
//           />
//         </div>

//         <div className='mb-4'>
//           <Controller
//             name='description'
//             control={control}
//             render={({ field: { value, onChange } }) => (
//               <RichTextEditor mode={mode} editorState={value} setEditorState={onChange} />
//             )}
//           />
//         </div>

//         <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-between', gap: 2 }}>
//           <Button
//             type='submit'
//             color='primary'
//             variant='contained'
//             size='small'
//             className='h-10 mt-4 w-full'
//             disabled={isLoading}
//           >
//             {isLoading ? (isUpdatingSite ? 'Mise à jour...' : 'Création...') : isUpdatingSite ? 'Modifier' : 'Ajouter'}
//           </Button>
//           <Button variant='outlined' color='error' size='small' onClick={onClose} className='h-10 mt-4 w-full'>
//             Annuler
//           </Button>
//         </Box>
//       </form>
//     </SidebarDrawerForm>
//   )
// }

// export default SiteForm

import useSweetAlert from '@/@core/hooks/useSweetAlert'
import type { IRequirement, ISite } from '@/@core/utils/types'
import SidebarDrawerForm from '@/components/layout/shared/DrawerForm'
import {
  useCreateSiteMutation,
  useGetSiteOwnersQuery,
  useGetSiteTypesQuery,
  useUpdateSiteMutation
} from '@/store/features/site/siteApi'
import type { SystemMode } from '@core/types'
import { Alert, Box, Button, TextField } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import Chip from '@mui/material/Chip'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'

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
const SiteForm = ({
  mode,
  isOpen,
  siteToEdit,
  requirements,
  onClose,
  isEditMode
}: {
  mode: SystemMode
  isOpen: boolean
  siteToEdit?: ISite | null
  requirements: IRequirement[]
  onClose: () => void
  isEditMode: boolean
}) => {
  const [selectedRequirements, setSelectedRequirements] = useState<IRequirement[]>(
    isEditMode ? requirements.filter(req => siteToEdit?.requirements?.some(siteReq => siteReq.id === req.id)) : []
  )
  const { showAlert, showToast } = useSweetAlert()
  const [updateSite, { isLoading: isUpdating, isError: updateError, error: updateErr }] = useUpdateSiteMutation()
  const [createSite, { isLoading: isCreating, isError: createError, error: createErr }] = useCreateSiteMutation()
  const { data: siteOwners } = useGetSiteOwnersQuery()
  const defaultSiteOwner = siteOwners?.find(owner => owner.name.toLowerCase() === 'autre')
  const { data: siteTypes } = useGetSiteTypesQuery()
  const defaultSiteType = siteTypes?.find(type => type.name.toLowerCase() === 'autre')
  const isUpdatingSite = isEditMode && siteToEdit?.id
  const isLoading = isUpdatingSite ? isUpdating : isCreating
  const isError = isUpdatingSite ? updateError : createError
  const error = isUpdatingSite ? updateErr : createErr
  const handleUpdateSiteSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const siteNbr = formData.get('siteNbr') as string
    const description = formData.get('description') as string
    const rawSiteOwnerId = formData.get('siteOwnerId')?.toString().trim()
    const rawSiteTypeId = formData.get('siteTypeId')?.toString().trim()
    const siteOwnerId = rawSiteOwnerId || defaultSiteOwner?.id
    const siteTypeId = rawSiteTypeId || defaultSiteType?.id
    try {
      if (isUpdatingSite) {
        const initialRequirements = siteToEdit?.requirements || []
        const requirementsToAdd = selectedRequirements
          .filter(req => !initialRequirements.some(t => t.id === req.id))
          .map(req => req.id)
        const requirementsToRemove = initialRequirements
          .filter(req => !selectedRequirements.some(t => t.id === req.id))
          .map(req => req.id)
        await updateSite({
          id: siteToEdit.id,
          label,
          siteNbr,
          description,
          siteOwnerId,
          siteTypeId,
          requirementsToAdd,
          requirementsToRemove
        }).unwrap()
        showToast('Site mis à jour avec succès!', 'success')
      } else {
        await createSite({
          label,
          siteNbr,
          description,
          siteOwnerId,
          siteTypeId,
          requirementsIds: selectedRequirements.map(item => item.id)
        }).unwrap()
        showToast('Site créé avec succès!', 'success')
      }
    } catch (err) {
      console.error('Erreur site submit:', err)
      showAlert(
        'Erreur',
        `Une erreur est survenue lors de la ${isUpdatingSite ? 'mise à jour' : 'création'} du site`,
        'error'
      )
    } finally {
      onClose()
    }
  }
  return (
    <SidebarDrawerForm headerTitle={`${isEditMode ? 'Modifier' : 'Ajouter'} site`} open={isOpen} toggle={onClose}>
      <form onSubmit={handleUpdateSiteSubmit}>
        {isError && (
          <Alert severity='error'>
            {(error as any)?.data?.message || `Échec de la ${isUpdatingSite ? 'mise à jour' : 'création'} du site`}
          </Alert>
        )}
        <div className='mb-4 mt-5'>
          <TextField
            size='small'
            name='siteNbr'
            label='Numéro de site'
            placeholder='Numéro de site'
            defaultValue={siteToEdit?.siteNbr}
            required
            fullWidth
          />
        </div>
        <div className='mb-4'>
          <TextField
            size='small'
            name='label'
            label='Libellé'
            placeholder='Libellé'
            defaultValue={siteToEdit?.label}
            required
            fullWidth
          />
        </div>
        <div className='my-8'>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Propriétaire du site</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='siteOwnerId'
              name='siteOwnerId'
              defaultValue={siteToEdit?.siteOwnerId || ''}
              // value={siteToEdit?.siteOwnerId}
              label='Propriétaire'
            >
              {siteOwners &&
                siteOwners.map(siteOwner => (
                  <MenuItem key={siteOwner.id} value={siteOwner.id}>
                    {siteOwner.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div className='my-8'>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Type de site</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='siteType'
              name='siteTypeId'
              defaultValue={siteToEdit?.siteTypeId || ''}
              // value={siteToEdit?.siteTypeId}
              label='Type'
            >
              {siteTypes &&
                siteTypes.map(siteType => (
                  <MenuItem key={siteType.id} value={siteType.id}>
                    {siteType.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div className='my-8'>
          <Autocomplete
            multiple
            id='checkboxes-requirements'
            options={requirements || []}
            disableCloseOnSelect
            getOptionLabel={option => option.label}
            value={selectedRequirements}
            onChange={(event, newValue) => setSelectedRequirements(newValue)}
            ChipProps={{ color: 'warning' }}
            renderOption={(props, option, { selected }) => (
              <li {...props} key={option.id}>
                <Checkbox icon={icon} checkedIcon={checkedIcon} style={{ marginRight: 8 }} checked={selected} />
                {option.label}
              </li>
            )}
            limitTags={5}
            renderInput={params => <TextField {...params} fullWidth label="contraintes d'accès" size='small' />}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Tooltip title={`${option.label}`} key={option.id}>
                  <StyledChip {...getTagProps({ index })} label={`${option.label}`} />
                </Tooltip>
              ))
            }
          />
        </div>
        <div className='mb-4'>
          <TextField
            size='small'
            name='description'
            label='Commentaire'
            placeholder='Description'
            defaultValue={siteToEdit?.description}
            rows={4}
            fullWidth
            multiline
          />
        </div>
        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-between', gap: 2 }}>
          <Button
            type='submit'
            color='primary'
            variant='contained'
            size='small'
            className='h-10 mt-4 w-full'
            disabled={isLoading}
          >
            {isLoading ? (isUpdatingSite ? 'Mise à jour...' : 'Création...') : isUpdatingSite ? 'Modifier' : 'Ajouter'}
          </Button>
          <Button variant='outlined' color='error' size='small' onClick={onClose} className='h-10 mt-4 w-full'>
            Annuler
          </Button>
        </Box>
      </form>
    </SidebarDrawerForm>
  )
}
export default SiteForm
