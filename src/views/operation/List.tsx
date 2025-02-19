import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'
import { useDeleteOperationMutation, useGetOperationsQuery } from '@/store/features/operation/operationApi'
import { DataGrid } from '@mui/x-data-grid'
import { ChangeEvent, useState } from 'react'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import { Drawer, Skeleton } from '@mui/material'
import CustomModal from '@/@core/components/mui/Modal'
import CreateOperation from './Create'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { useGetNotAssignedTasksQuery } from '@/store/features/task/taskApi'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import UpdateOperation from './Update'
import { GetColumns, renderChipsCell, renderDateCell, renderTypographyCell } from '@/components/common/GridColumns'

const customColumns = () => [
  {
    flex: 1,
    field: 'label',
    headerName: 'Label',
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
    flex: 1,
    minWidth: 250,
    field: 'tasks',
    headerName: 'Taches',
    renderCell: renderChipsCell({
      field: 'tasks',
      chipProps: { variant: 'filled', color: 'primary' }
    })
  },
  {
    flex: 1,
    minWidth: 170,
    field: 'createdAt',
    headerName: 'Creation O',
    renderCell: renderDateCell('createdAt')
  }
]

const OperationList = ({ mode }: { mode: SystemMode }) => {
  const [openModal, setOpenModal] = useState(false)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<IRequirement[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [isOpen, setIsOpen] = useState<boolean>(false)
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

    return <div>Error: {errorMessage}</div>
  }

  if (isLoading)
    return (
      <div>
        <Skeleton variant='rounded' width={'100%'} height={50} className='my-2' />
        <Skeleton variant='rectangular' width={'100%'} height={50} />
        <Skeleton variant='rounded' width={'100%'} height={50} className='my-2' />
      </div>
    )
  const toggleForm = () => setIsOpen(prevState => !prevState)

  const toggleEditMode = (operation: IOperation) => {
    setIsEditMode(true)
    setOperationToEdit(operation)
    toggleForm()
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(
      'Es-tu sûr?',
      'Vous ne pourrez pas annuler cette action',
      'Supprimer',
      'Annuler'
    )
    if (confirmed) {
      try {
        await deleteOperation({ operationId: id })
        showToast('Deleted successfully!', 'success')
      } catch (error) {
        showAlert('Error', 'Something wrong went happedn while trying to delete the operation', 'error')
      }
    }
  }

  const columns = GetColumns({
    toggleEditMode,
    deleteObject: handleDelete,
    customColumns: customColumns(),
    includeActions: true
  })
  return (
    <div className='bg-backgroundPaper p-6'>
      <div className='flex justify-between items-center'>
        <Typography variant='h2' className='my-2'>
          Liste des opérations
        </Typography>
        {!isLoadingTasks && !taskError && (
          <div>
            <CustomIconButton
              onClick={() => setOpenModal(true)}
              color='primary'
              variant='tonal'
              size='small'
              className='h-10'
            >
              <span className='tabler-plus w-5 h-5 mr-2' />
              Ajouter
            </CustomIconButton>
            <CustomModal onClose={() => setOpenModal(false)} open={openModal}>
              <CreateOperation mode={mode} tasks={taskData} close={() => setOpenModal(false)} />
            </CustomModal>
          </div>
        )}
      </div>
      <DataGrid
        rowHeight={62}
        loading={isLoading}
        rows={data}
        localeText={{ noRowsLabel: 'Aucune donnes a afficher' }}
        columns={columns}
        // slots={{ toolbar: QuickSearchToolbar }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            defaultValue: searchText,
            onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value),
            title: 'Operations'
            // handleDateFilter,
            // clearDateFilter,
            // data: dataToExport(),
            // showExcel: true
          }
        }}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      {/* Update Operation */}
      <Drawer open={isOpen} onClose={toggleForm} anchor={'right'}>
        <UpdateOperation mode={mode} operationToEdit={operationToEdit} tasks={taskData} onClose={toggleForm} />
      </Drawer>
    </div>
  )
}

export default OperationList
