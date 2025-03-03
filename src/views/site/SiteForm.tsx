import type { SystemMode } from '@core/types'
import { Alert, Box, Button, IconButton } from '@mui/material'
import { useState } from 'react'
import { TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import { useCreateSiteMutation, useUpdateSiteMutation } from '@/store/features/site/siteApi'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import { IRequirement, ISite } from '@/@core/utils/types'

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
  siteToEdit,
  requirements,
  onClose,
  isEditMode
}: {
  mode: SystemMode
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

    try {
      if (isUpdatingSite) {
        const initialRequirements = siteToEdit?.requirements || []
        const requirementsToAdd = selectedRequirements
          .filter(requirement => !initialRequirements.some(t => t.id === requirement.id))
          ?.map((item: IRequirement) => item.id)
        const requirementsToRemove = initialRequirements
          .filter(requirement => !selectedRequirements.some(t => t.id === requirement.id))
          ?.map((item: IRequirement) => item.id)

        await updateSite({
          id: siteToEdit.id,
          label,
          siteNbr,
          description,
          requirementsToAdd,
          requirementsToRemove
        }).unwrap()
        showToast('Site mis à jour avec succès!', 'success')
      } else {
        const response = await createSite({
          label,
          siteNbr,
          description,
          requirementsIds: selectedRequirements?.map(item => item.id)
        }).unwrap()
        showToast('Site créé avec succès!', 'success')
      }
      onClose()
    } catch (err) {
      showAlert(
        'Erreur',
        `Une erreur est survenue lors de la ${isUpdatingSite ? 'mise à jour' : 'création'} du site`,
        'error'
      )
    }
  }

  return (
    <div className='bg-backgroundPaper p-4' style={{ minWidth: 450 }}>
      <Box sx={{ width: '100%' }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, left: 8 }}>
          <i className='tabler-x' />
        </IconButton>
        <Typography variant='h4' className='my-4  mt-10'>
          {isUpdatingSite ? 'Mettre à jour le site' : 'Créer un site'}
        </Typography>
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
              renderInput={params => <TextField {...params} fullWidth label='Prérequis ciblées' size='small' />}
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
              label='Description'
              placeholder='Description'
              defaultValue={siteToEdit?.description}
              rows={4}
              fullWidth
              multiline
            />
          </div>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, justifyContent: 'space-between', gap: 2 }}>
            <Button variant='outlined' size='small' onClick={onClose} className='h-10 mt-4 w-full'>
              Annuler
            </Button>
            <Button
              type='submit'
              color='primary'
              variant='contained'
              size='small'
              className='h-10 mt-4 w-full'
              disabled={isLoading}
            >
              {isLoading ? (isUpdatingSite ? 'Mise à jour...' : 'Création...') : isUpdatingSite ? 'Modifier' : 'Créer'}
            </Button>
          </Box>
        </form>
      </Box>
    </div>
  )
}

export default SiteForm
