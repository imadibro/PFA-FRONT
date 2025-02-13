import type { SystemMode } from '@core/types'
import { Box } from '@mui/material'
import { TabContext, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import CustomTabList from '@/@core/components/mui/TabList'
import { useState } from 'react'
import { TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import Checkbox from '@mui/material/Checkbox'
import CustomIconButton from '@/@core/components/mui/IconButton'
import {
  useDetachRequirementsFromSiteMutation,
  useMapRequirementsToSiteMutation,
  useUpdateSiteMutation
} from '@/store/features/site/siteApi'

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

const UpdateSite = ({
  mode,
  siteToEdit,
  requirements,
  onClose
}: {
  mode: SystemMode
  siteToEdit: ISite | null
  requirements: IRequirement[]
  onClose: () => void
}) => {
  const [tabValue, setTabValue] = useState('1')

  const [combinedRequirements, setCombinedRequirements] = useState<IRequirement[] | null>([
    ...requirements,
    ...(siteToEdit?.requirements || [])
  ])

  const [selectedRequirements, setSelectedRequirements] = useState<IRequirement[]>([
    ...(siteToEdit?.requirements || [])
  ])
  const [updateSite, { isLoading, isError, error, isSuccess }] = useUpdateSiteMutation()

  const handleUpdateSiteSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const label = formData.get('label') as string
    const siteNbr = formData.get('siteNbr') as string
    const description = formData.get('description') as string
    if (!siteToEdit?.id) return
    try {
      await updateSite({ id: siteToEdit.id, label, siteNbr, description }).unwrap()
      onClose()
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }
  const [
    mapRequirementsToSite,
    {
      isLoading: mapRequirementsToSiteIsLoading,
      isError: mapRequirementsToSiteIsError,
      error: mapRequirementsToSiteError,
      isSuccess: mapRequirementsToSiteIsSuccess
    }
  ] = useMapRequirementsToSiteMutation()

  const [
    detachRequirementsFromSite,
    {
      isLoading: detachRequirementsFromSiteIsLoading,
      isError: detachRequirementsFromSiteIsError,
      error: detachRequirementsFromSiteError,
      isSuccess: detachRequirementsFromSiteSuccess
    }
  ] = useDetachRequirementsFromSiteMutation()

  const handleUpdateSiteRequirementsSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // new Requirements => requirements that present in selectedRequirements but not in the siteToEdit?.requirements
    // removed Requirements => requirements not present in selectedRequirements but were in the initial siteToEdit?.requirements

    const initialRequirements = siteToEdit?.requirements || []
    const newRequirements = selectedRequirements.filter(
      requirement => !initialRequirements.some(t => t.id === requirement.id)
    )
    const removedRequirements = initialRequirements.filter(
      requirement => !selectedRequirements.some(t => t.id === requirement.id)
    )

    try {
      if (!siteToEdit?.id) return

      const requests = []

      if (newRequirements?.length) {
        const requirementsIds = newRequirements.map((requirement: IRequirement) => requirement.id)
        requests.push(mapRequirementsToSite({ siteId: siteToEdit?.id, requirementsIds }))
      }
      if (removedRequirements?.length) {
        const requirementsIds = removedRequirements.map((requirement: IRequirement) => requirement.id)
        requests.push(detachRequirementsFromSite({ siteId: siteToEdit?.id, requirementsIds }))
      }
      if (requests.length) {
        await Promise.all(requests)
      }
      onClose()
    } catch (err) {
      console.error('Failed to create task:', err)
    }
  }
  return (
    <div className='bg-backgroundPaper p-4'>
      <Box sx={{ width: '100%' }}>
        <TabContext value={tabValue}>
          <CustomTabList onChange={(_, newValue) => setTabValue(newValue)} color='primary'>
            <Tab label='Site' value='1' />
            <Tab label='Requirements' value='2' />
          </CustomTabList>

          <TabPanel value='1'>
            <form onSubmit={handleUpdateSiteSubmit}>
              <div className='mb-4'>
                <TextField
                  size='small'
                  name='label'
                  label='label'
                  placeholder='label'
                  defaultValue={siteToEdit?.label}
                  required
                  fullWidth
                />
                <Typography variant='body2' color='textSecondary'>
                  Give your site a clear and concise name.
                </Typography>
              </div>
              <div className='mb-4'>
                <TextField
                  size='small'
                  name='siteNbr'
                  label='site Number'
                  placeholder='site Number'
                  defaultValue={siteToEdit?.siteNbr}
                  required
                  fullWidth
                />
                <Typography variant='body2' color='textSecondary'>
                  Give your Site Number a clear and concise Number.
                </Typography>
              </div>
              <div className='mb-4'>
                <TextField
                  size='small'
                  name='description'
                  label='description'
                  placeholder='description'
                  defaultValue={siteToEdit?.description}
                  required
                  rows={4}
                  fullWidth
                  multiline
                />
                <Typography variant='body2' color='textSecondary'>
                  Give your site a clear and concise description.
                </Typography>
              </div>
              <CustomIconButton
                type='submit'
                color='primary'
                variant='tonal'
                size='small'
                className='h-10 mt-4'
                disabled={isLoading || mapRequirementsToSiteIsLoading || detachRequirementsFromSiteIsLoading}
              >
                <span className='tabler-edit w-5 h-5 mr-2' />
                {isLoading || mapRequirementsToSiteIsLoading || detachRequirementsFromSiteIsLoading
                  ? 'Updating...'
                  : 'Update'}
              </CustomIconButton>
            </form>
          </TabPanel>
          <TabPanel value='2'>
            <form onSubmit={handleUpdateSiteRequirementsSubmit}>
              <div className='my-8'>
                <Autocomplete
                  multiple
                  id='checkboxes-requirements'
                  options={combinedRequirements || []}
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
                  renderInput={params => (
                    <TextField
                      {...params}
                      fullWidth
                      label='Targeted Requirements'
                      helperText='All the requirements that will be part of this site.'
                    />
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Tooltip title={`${option.label}`} key={option.id}>
                        <StyledChip
                          {...getTagProps({ index })}
                          variant='filled'
                          label={`${option.label}`}
                          deleteIcon={<i className='tabler:trash' />}
                        />
                      </Tooltip>
                    ))
                  }
                />
              </div>
              <CustomIconButton
                type='submit'
                color='primary'
                variant='tonal'
                size='small'
                className='h-10 mt-4'
                disabled={isLoading || mapRequirementsToSiteIsLoading || detachRequirementsFromSiteIsLoading}
              >
                <span className='tabler-edit w-5 h-5 mr-2' />
                {isLoading || mapRequirementsToSiteIsLoading || detachRequirementsFromSiteIsLoading
                  ? 'Updating...'
                  : 'Update'}
              </CustomIconButton>
            </form>
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  )
}

export default UpdateSite
