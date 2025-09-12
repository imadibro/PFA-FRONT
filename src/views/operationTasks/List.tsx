import useSweetAlert from '@/@core/hooks/useSweetAlert'
import exportData from '@/@core/utils/exportData'
import { formatDateFR, stringToDate } from '@/@core/utils/format'
import type { IOperationTask } from '@/@core/utils/types'
import { useToastComponante } from '@/components/common/DeletedComponante'
import { GetColumns, renderTypographyCell } from '@/components/common/GridColumns'
import QuickSearchToolbar from '@/components/common/QuickSearchToolbar'
import {
  useDeleteOperationTasksMutation,
  useGetOperationsTasksQuery
} from '@/store/features/operation/operationTasksApi'
import { useGetTasksQuery } from '@/store/features/task/taskApi'
import type { SystemMode } from '@core/types'
import { Alert, Drawer } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import type { ChangeEvent } from 'react'
import { useCallback, useState } from 'react'
import CreateOperation from './Create'
import UpdateOperation from './Update'

const customColumns = () => [
  {
    flex: 1,
    field: 'operationType',
    headerName: 'Opération Type',
    minWidth: 180,
    renderCell: renderTypographyCell('operationType.label')
  },
  {
    flex: 1,
    field: 'operationZone',
    headerName: 'Operation Zone',
    minWidth: 180,
    renderCell: renderTypographyCell('operationZone.label')
  },
  {
    flex: 1,
    minWidth: 180,
    field: 'operationTrans',
    headerName: 'Operation Trans',
    renderCell: renderTypographyCell('operationTrans.label')
  }
]

const OperationTasksList = ({} /*mode*/ : { mode: SystemMode }) => {
  const [openModal, setOpenModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<IOperationTask[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  // const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)
  const [operationToEdit, setOperationToEdit] = useState<IOperationTask | null>(null)
  const [, /*isEditMode*/ setIsEditMode] = useState<boolean>(false)

  const { showAlert } = useSweetAlert()
  const { confirmDelete, showDeletToast } = useToastComponante()
  const [deleteOperation, { isLoading: deleteOperationIsLoading }] = useDeleteOperationTasksMutation()

  const { data, error, isLoading } = useGetOperationsTasksQuery()
  const { data: taskData, error: taskError, isLoading: isLoadingTasks } = useGetTasksQuery()

  const handleSearch = useCallback(
    (searchValue: string) => {
      setSearchText(searchValue)
      const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
      const filteredRows = data?.filter((row: IOperationTask) => {
        return Object.keys(row).some(field => {
          if (row[field as keyof IOperationTask] !== null && row[field as keyof IOperationTask] !== undefined) {
            return searchRegex.test(row[field as keyof IOperationTask]!.toString())
          }
        })
      })
      if (searchValue.length) {
        setIsFiltering(true)
        setFilteredData(filteredRows || [])
      } else {
        setIsFiltering(false)
        setFilteredData([])
      }
    },
    [data]
  )

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

  const toggleForm = () => {
    setOpenModal(true)
  }

  const toggleEditMode = (operation: IOperationTask) => {
    setIsEditMode(true)
    setOperationToEdit(operation)
    setOpenUpdateModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error('Operation ID manquant pour la suppression.')
      showAlert('Erreur', 'Impossible de supprimer : ID introuvable.', 'error')
      return
    }
    const confirmed = await confirmDelete('cette contrainte')

    if (confirmed) {
      try {
        await deleteOperation({ operationId: id }).unwrap()
        await showDeletToast('Contraint')
      } catch (error) {
        showAlert('Erreur', "Une erreur s'est produite lors de la tentative de suppression de l'opération", 'error')
      }
    }
  }

  const handleDateFilter = (start: Date, end: Date) => {
    const filteredRows = data?.filter((row: IOperationTask) => {
      const formattedCreatedAt = stringToDate(row?.createdAt.toDateString() || '')

      if (!formattedCreatedAt || isNaN(formattedCreatedAt.getTime())) {
        return false
      }

      return formattedCreatedAt >= start && formattedCreatedAt <= end
    })
    setIsFiltering(true)
    setFilteredData(filteredRows || [])
  }

  const clearDateFilter = () => {
    setIsFiltering(false)
    setFilteredData([])
  }

  const handleCustomAction = (operation: IOperationTask) => {
    setOperationToEdit(operation)
    // setIsDetailsOpen(true)
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
    onChange: (event: ChangeEvent<HTMLInputElement>) => {
      handleSearch(event.target.value)
    },
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
        {!isLoadingTasks && !taskError && (
          <div>
            <Drawer onClose={() => setOpenModal(false)} open={openModal} anchor={'right'}>
              <CreateOperation close={() => setOpenModal(false)} />
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
        slots={{
          toolbar: () => <QuickSearchToolbar {...toolbarProps} />
        }}
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
          operationToEdit={operationToEdit!}
          tasks={taskData}
          onClose={() => setOpenUpdateModal(false)}
        />
      </Drawer>
    </div>
  )
}

export default OperationTasksList
