import type { ChangeEvent } from 'react'
import { useState } from 'react'
import Typography from '@mui/material/Typography'
import { Alert, Drawer, Skeleton } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import { useDeleteRequirementMutation, useGetRequirementQuery } from '@/store/features/requirement/requirementApi'
import type { SystemMode } from '@core/types'
import QuickSearchToolbar from '@/components/common/QuickSearchToolbar'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import { GetColumns, renderChipCell, renderDateCell, renderTypographyCell } from '@/components/common/GridColumns'
import exportData from '@/@core/utils/exportData'
import { formatDateFR, stringToDate } from '@/@core/utils/format'
import RequirementForm from './RequirementForm'
import type { IRequirement } from '@/@core/utils/types'

const customColumns = () => [
  {
    flex: 1,
    field: 'label',
    headerName: 'Libellé',
    minWidth: 180,
    renderCell: renderTypographyCell('label')
  },
  {
    flex: 1,
    minWidth: 250,
    field: 'description',
    headerName: 'Description',
    renderCell: renderTypographyCell('description')
  },
  {
    field: 'priority',
    headerName: 'Priorité',
    renderCell: renderChipCell(
      'priority',
      [
        { value: 'Élevé', chipProps: { color: 'error', size: 'small' } },
        { value: 'Moyen', chipProps: { color: 'warning', size: 'small' } },
        { value: 'Faible', chipProps: { color: 'success', size: 'small' } }
      ],
      { color: 'default', size: 'small' }
    )
  }
]
const RequirementList = ({ mode }: { mode: SystemMode }) => {
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<IRequirement[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [requirementToEdit, setRequirementToEdit] = useState<IRequirement | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const { showAlert, showConfirm, showToast } = useSweetAlert()
  const [
    deleteRequirement,
    { isLoading: deleteRequirementIsLoading, isError, error: deleteRequirementError, isSuccess }
  ] = useDeleteRequirementMutation()

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = data.filter((row: IRequirement) => {
      return Object.keys(row).some(field => {
        if (row[field as keyof IRequirement] !== null && row[field as keyof IRequirement] !== undefined) {
          return searchRegex.test(row[field as keyof IRequirement]!.toString())
        }
      })
    })
    if (searchValue.length) {
      setIsFiltering(true)
      setFilteredData(filteredRows)
    } else {
      setIsFiltering(false)
      setFilteredData([])
    }
  }

  const toggleForm = () => setIsOpen(prevState => !prevState)

  const toggleEditMode = (requirement: IRequirement) => {
    setIsEditMode(true)
    setRequirementToEdit(requirement)
    toggleForm()
  }

  const onCloseForm = () => {
    setRequirementToEdit(null)
    toggleForm()
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(
      'Es-tu sûr?',
      'Etes-vous sûr de vouloir supprimer ce prérequis ?',
      'Supprimer',
      'Annuler'
    )
    if (confirmed) {
      try {
        await deleteRequirement({ requirementId: id })
        showToast('Supprimé avec succès!', 'success')
      } catch (error) {
        showAlert('Error', "Une erreur s'est produite lors de la tentative de suppression de prérequis", 'error')
      }
    }
  }

  const { data, error, isLoading } = useGetRequirementQuery()

  if (error) {
    const errorMessage =
      'status' in error
        ? `Error ${error.status}: ${(error.data as any)?.message || 'Unknown error'}`
        : error.message || 'An unknown error occurred'

    return (
      <Alert severity='error' sx={{ margin: '16px 0' }}>
        {errorMessage}
      </Alert>
    )
  }

  if (isLoading)
    return (
      <div>
        <Skeleton variant='rounded' width={'100%'} height={50} className='my-2' />
        <Skeleton variant='rectangular' width={'100%'} height={50} />
        <Skeleton variant='rounded' width={'100%'} height={50} className='my-2' />
      </div>
    )

  const handleDateFilter = (start: Date, end: Date) => {
    const filteredRows = data.filter((row: IRequirement) => {
      const formattedCreatedAt = stringToDate(row?.createdAt || '')

      if (!formattedCreatedAt || isNaN(formattedCreatedAt.getTime())) {
        return false
      }

      return formattedCreatedAt >= start && formattedCreatedAt <= end
    })
    setIsFiltering(true)
    setFilteredData(filteredRows)
  }

  const clearDateFilter = () => {
    setIsFiltering(false)
    setFilteredData([])
  }

  const columns = GetColumns({
    toggleEditMode,
    deleteObject: handleDelete,
    customColumns: customColumns(),
    includeActions: true
  })

  const fieldHandlers = {
    createdAt: (value: string) => formatDateFR(new Date(value)),
    updatedAt: (value: string) => formatDateFR(new Date(value))
  }

  const toolbarProps = {
    value: searchText,
    clearSearch: () => handleSearch(''),
    onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value),
    handleChecked: () => {},
    toggleForm,
    title: 'Exigences',
    checkBoxLabel: '',
    showCheckBox: false,
    showDateFilter: false,
    handleDateFilter,
    clearDateFilter,
    data: exportData(isFiltering ? filteredData : data, customColumns(), fieldHandlers),
    showExcel: true,
    hideAddButton: false
  }

  return (
    <div className='bg-backgroundPaper p-6'>
      <div className='flex justify-between items-center'>
        <Typography variant='h2' className='my-2'>
          Liste des prérequis
        </Typography>
      </div>
      <DataGrid
        rowHeight={44}
        loading={isLoading || deleteRequirementIsLoading}
        rows={isFiltering ? filteredData : data}
        localeText={{ noRowsLabel: 'Aucune données a afficher' }}
        columns={columns}
        slots={{ toolbar: () => <QuickSearchToolbar {...toolbarProps} /> }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          pagination: {
            labelRowsPerPage: 'Lignes par page'
          }
        }}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      {/* Update Requirement */}
      <Drawer open={isOpen} onClose={onCloseForm} anchor={'right'}>
        <RequirementForm
          mode={mode}
          requirementToEdit={requirementToEdit}
          onClose={onCloseForm}
          isEditMode={isEditMode}
        />
      </Drawer>
    </div>
  )
}

export default RequirementList
