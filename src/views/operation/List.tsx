import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'
import { useDeleteOperationMutation, useGetOperationsQuery } from '@/store/features/operation/operationApi'
import { DataGrid } from '@mui/x-data-grid'
import { ChangeEvent, useState } from 'react'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import { Alert, Drawer, Skeleton } from '@mui/material'
import CreateOperation from './Create'
import { useGetNotAssignedTasksQuery } from '@/store/features/task/taskApi'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import UpdateOperation from './Update'
import { GetColumns, renderTypographyCell } from '@/components/common/GridColumns'
import QuickSearchToolbar from '@/components/common/QuickSearchToolbar'
import { formatDateFR, stringToDate } from '@/@core/utils/format'
import exportData from '@/@core/utils/exportData'
import { IOperation, IRequirement } from '@/@core/utils/types'
import OperationDetails from './Details'

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
  }
]

const OperationList = ({ mode }: { mode: SystemMode }) => {
  const [openModal, setOpenModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<IRequirement[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)
  const [operationToEdit, setOperationToEdit] = useState<IOperation | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const { showAlert, showConfirm, showToast } = useSweetAlert()
  const [deleteOperation, { isLoading: deleteOperationIsLoading, isError, error: deleteOperationError, isSuccess }] =
    useDeleteOperationMutation()

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
  const { data, error, isLoading } = useGetOperationsQuery()
  const { data: taskData, error: taskError, isLoading: isLoadingTasks } = useGetNotAssignedTasksQuery()

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
  const toggleForm = () => {
    setOpenModal(true)
  }

  const toggleEditMode = (operation: IOperation) => {
    setIsEditMode(true)
    setOperationToEdit(operation)
    setOpenUpdateModal(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(
      '',
      'Etes-vous sûr de vouloir supprimer cette opération ?',
      'Supprimer',
      'Annuler'
    )
    if (confirmed) {
      try {
        await deleteOperation({ operationId: id })
        showToast('Supprimé avec succès !', 'success')
      } catch (error) {
        showAlert('Error', "Une erreur s'est produite lors de la tentative de suppression de l'opération", 'error')
      }
    }
  }

  const handleDateFilter = (start: Date, end: Date) => {
    const filteredRows = data.filter((row: IOperation) => {
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

  const handleCustomAction = (operation: IOperation) => {
    setOperationToEdit(operation)
    setIsDetailsOpen(true)
  }

  const columns = GetColumns({
    toggleEditMode,
    deleteObject: handleDelete,
    customColumns: customColumns(),
    includeActions: true,
    customAction: 'Détails',
    handleCustomAction
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
    title: 'Taches',
    checkBoxLabel: '',
    showCheckBox: false,
    showDateFilter: false,
    handleDateFilter,
    clearDateFilter,
    data: exportData(isFiltering ? filteredData : data, customColumns(), fieldHandlers),
    showExcel: true,
    hideAddButton: isLoadingTasks || taskError ? true : false
  }

  return (
    <div className='bg-backgroundPaper p-6'>
      <div className='flex justify-between items-center'>
        <Typography variant='h2' className='my-2'>
          Liste des opérations
        </Typography>
        {!isLoadingTasks && !taskError && (
          <div>
            <Drawer onClose={() => setOpenModal(false)} open={openModal} anchor={'right'}>
              <CreateOperation mode={mode} tasks={taskData} close={() => setOpenModal(false)} />
            </Drawer>
          </div>
        )}
      </div>
      <DataGrid
        rowHeight={35}
        loading={isLoading || deleteOperationIsLoading}
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

      {/* Update Operation */}
      <Drawer open={openUpdateModal} onClose={() => setOpenUpdateModal(false)} anchor={'right'}>
        <UpdateOperation
          mode={mode}
          operationToEdit={operationToEdit}
          tasks={taskData}
          onClose={() => setOpenUpdateModal(false)}
        />
      </Drawer>

      {/* details drawer */}
      <Drawer open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} anchor='right'>
        <OperationDetails mode={mode} close={() => setIsDetailsOpen(false)} operation={operationToEdit} />
      </Drawer>
    </div>
  )
}

export default OperationList
