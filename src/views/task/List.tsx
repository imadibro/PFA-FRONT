import useSweetAlert from '@/@core/hooks/useSweetAlert'
import type { SystemMode } from '@/@core/types'
import exportData from '@/@core/utils/exportData'
import { formatDateFR, stringToDate } from '@/@core/utils/format'
import { TOAST_ACTIONS, TOAST_COMPONENTS, toastMessageSuccess } from '@/@core/utils/toast-message'
import type { ITask } from '@/@core/utils/types'
import { GetColumns, renderTypographyCell } from '@/components/common/GridColumns'
import QuickSearchToolbar from '@/components/common/QuickSearchToolbar'
import { useToastComponante } from '@/components/common/ToastComponante'
import { useDeleteTaskMutation, useGetTasksQuery } from '@/store/features/task/taskApi'
import { isRTKQueryError } from '@/utils/functions'
import { Alert, Drawer } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import TaskForm from './TaskForm'

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
  }
]

const TaskList = ({ mode }: { mode: SystemMode }) => {
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<ITask[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [taskToEdit, setTaskToEdit] = useState<ITask | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const { showAlert } = useSweetAlert()
  const { confirmDelete, showDeletToast, showUnauthorizedToast } = useToastComponante()

  const { data, error, isLoading, refetch } = useGetTasksQuery()

  const [deleteTask, { isLoading: deleteTaskIsLoading }] = useDeleteTaskMutation()

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

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')

    const filteredRows = data.filter((row: ITask) => {
      return Object.keys(row).some(field => {
        if (row[field as keyof ITask] !== null && row[field as keyof ITask] !== undefined) {
          return searchRegex.test(row[field as keyof ITask]!.toString())
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

  const toggleEditMode = (task: ITask) => {
    setIsEditMode(true)
    setTaskToEdit(task)
    toggleForm()
  }

  const onCloseForm = () => {
    setTaskToEdit(null)
    toggleForm()
  }

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDelete('cette tâche?')

    if (confirmed) {
      try {
        await deleteTask({ taskId: id }).unwrap()
        toast.success(toastMessageSuccess(TOAST_COMPONENTS.TASK, TOAST_ACTIONS.DELETE))
        showDeletToast('Carte')
        refetch()
      } catch (err) {
        if (isRTKQueryError(err) && err.status === 403) {
          await showUnauthorizedToast()
        } else {
          showAlert('Error', "Une erreur s'est produite lors de la tentative de suppression de la tâche", 'error')
        }
      }
    }
  }

  const handleDateFilter = (start: Date, end: Date) => {
    const filteredRows = data.filter((row: ITask) => {
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
    title: 'Taches',
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
      <div className='flex justify-between items-center'></div>
      <DataGrid
        rowHeight={35}
        loading={isLoading || deleteTaskIsLoading}
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

      {/* Task Form */}
      <Drawer open={isOpen} onClose={onCloseForm} anchor={'right'}>
        <TaskForm mode={mode} taskToEdit={taskToEdit} onClose={onCloseForm} isEditMode={isEditMode} />
      </Drawer>
    </div>
  )
}

export default TaskList
