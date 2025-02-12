import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'
import { useDeleteOperationMutation, useGetOperationsQuery } from '@/store/features/operation/operationApi'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { ChangeEvent, MouseEvent, useState } from 'react'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import { formatDateFR } from '@/@core/utils/format'
import { Chip, IconButton, Menu, MenuItem, Skeleton } from '@mui/material'
import CustomModal from '@/@core/components/mui/Modal'
import CreateOperation from './Create'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { useGetNotAssignedTasksQuery } from '@/store/features/task/taskApi'
import useSweetAlert from '@/@core/hooks/useSweetAlert'

interface CellType {
  row: any
}

interface RowOptionProps {
  row: IOperation
  toggleEditMode: (object: IOperation) => void
  deleteObject: (id: string) => void
}

interface ColumnsProps {
  toggleEditMode: (site: IOperation) => void
  deleteObject: (id: string) => void
}

const RowOptions = ({ row, toggleEditMode, deleteObject }: RowOptionProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const rowOptionsOpen = Boolean(anchorEl)

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleRowOptionsClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    toggleEditMode(row)
    setAnchorEl(null)
  }

  const handleDelete = () => {
    if (row?.id) {
      deleteObject(row.id)
    }
    handleRowOptionsClose()
  }

  return (
    <>
      <IconButton size='small' onClick={handleRowOptionsClick}>
        <i className='tabler-dots-vertical' />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{ style: { minWidth: '8rem' } }}
      >
        <MenuItem onClick={handleEdit} sx={{ '& i, & svg': { mr: 2 } }}>
          <i className='tabler-edit text-green-500' />
          Modifier
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ '& svg': { mr: 2 } }}>
          <i className='tabler-trash text-red-500' />
          Supprimer
        </MenuItem>
      </Menu>
    </>
  )
}

const columns = ({ toggleEditMode, deleteObject }: ColumnsProps): GridColDef[] => {
  return [
    {
      flex: 1,
      minWidth: 180,
      field: 'label',
      headerName: 'Label',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }} title={row.label}>
          {row.label}
        </Typography>
      )
    },
    {
      flex: 1,
      minWidth: 250,
      field: 'description',
      headerName: 'Description',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }} title={row.description}>
          {row.description}
        </Typography>
      )
    },
    {
      flex: 1,
      minWidth: 250,
      field: 'tasks',
      headerName: 'Taches',
      renderCell: ({ row }: CellType) => (
        <div className='text-center space-x-1' title='Taches'>
          {row.tasks?.map((task: ITask) => <Chip label={task.label} color='info' variant='outlined' />)}
        </div>
      )
    },
    {
      flex: 1,
      minWidth: 170,
      field: 'createdAt',
      headerName: 'Creation R',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {formatDateFR(new Date(row.createdAt))}
        </Typography>
      )
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: ({ row }: CellType) => (
        <RowOptions toggleEditMode={toggleEditMode} deleteObject={deleteObject} row={row} />
      )
    }
  ]
}

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
    const confirmed = await showConfirm('Are you sure?', "You won't be able to revert this!", 'Delete', 'Cancel')
    if (confirmed) {
      try {
        await deleteOperation({ operationId: id })
        showToast('Deleted successfully!', 'success')
      } catch (error) {
        showAlert('Error', 'Something wrong went happedn while trying to delete the operation', 'error')
      }
    }
  }
  return (
    <div className='bg-backgroundPaper p-6'>
      <div className='flex justify-between items-center'>
        <Typography variant='h2' className='my-2'>
          Operation List
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
              Add
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
        columns={columns({ toggleEditMode, deleteObject: handleDelete })}
        // slots={{ toolbar: QuickSearchToolbar }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            defaultValue: searchText,
            onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value),
            // toggleForm,
            title: 'Tasks'
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
    </div>
  )
}

export default OperationList
