import type { ChangeEvent } from 'react'
import { useState } from 'react'
import Typography from '@mui/material/Typography'
import { Alert, Drawer, Skeleton } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import { useGetAbsencesQuery, useDeleteAbsenceMutation } from '@/store/features/absence/absenceApi'
import type { SystemMode } from '@core/types'
import QuickSearchToolbar from '@/components/common/QuickSearchToolbar'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import {
  GetColumns,
  renderConcatenatedTypographyCell,
  renderDateCell,
  renderTypographyCell
} from '@/components/common/GridColumns'
import { useGetEmployeesQuery } from '@/store/features/employee/employeeApi'
import { formatDateFR, stringToDate } from '@/@core/utils/format'
import exportData from '@/@core/utils/exportData'
import AbsenceForm from './AbsenceForm'
import type { IAbsence } from '@/@core/utils/types'

const customColumns = () => [
  {
    flex: 1,
    field: 'employee.firstName',
    headerName: 'Employé',
    minWidth: 180,
    renderCell: renderConcatenatedTypographyCell(['employee.firstName', 'employee.lastName'])
  },

  {
    flex: 1,
    field: 'absence.label',
    headerName: "Type d'absence/Motif",
    minWidth: 180,
    renderCell: renderConcatenatedTypographyCell(['absence', 'autre'])
  },
  {
    flex: 1,
    field: 'startDate',
    headerName: 'Date de début',
    minWidth: 180,
    renderCell: renderDateCell('startDate', true)
  },
  {
    flex: 1,
    minWidth: 180,
    field: 'endDate',
    headerName: 'Date de fin',
    renderCell: renderDateCell('endDate', true)
  },
  {
    flex: 1,
    minWidth: 250,
    field: 'notes',
    headerName: 'Notes supplémentaires',
    renderCell: renderTypographyCell('notes')
  }
]

const AbsencesList = ({ mode }: { mode: SystemMode }) => {
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<IAbsence[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [absenceToEdit, setAbsenceToEdit] = useState<IAbsence | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const { showAlert, showConfirm, showToast } = useSweetAlert()

  const { data, error, isLoading } = useGetAbsencesQuery()
  const { data: employeeData, error: employeeError, isLoading: employeeIsLoading } = useGetEmployeesQuery()

  const [deleteAbsence, { isLoading: deleteAbsenceIsLoading, isError, error: deleteAbsenceError, isSuccess }] =
    useDeleteAbsenceMutation()

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

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = data.filter((row: IAbsence) => {
      return Object.keys(row).some(field => {
        if (row[field as keyof IAbsence] !== null && row[field as keyof IAbsence] !== undefined) {
          return searchRegex.test(row[field as keyof IAbsence]!.toString())
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

  const toggleEditMode = (task: IAbsence) => {
    setIsEditMode(true)
    setAbsenceToEdit(task)
    toggleForm()
  }

  const onCloseForm = () => {
    setAbsenceToEdit(null)
    toggleForm()
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(
      '',
      'Etes-vous sûr de vouloir supprimer cette absence ?',
      'Supprimer',
      'Annuler'
    )
    if (confirmed) {
      try {
        await deleteAbsence({ absenceId: id })
        showToast('Supprimé avec succès!', 'success')
      } catch (error) {
        showAlert('Error', "Une erreur s'est produite lors de la tentative de suppression de l'absence", 'error')
      }
    }
  }

  const handleDateFilter = (start: Date, end: Date) => {
    const filteredRows = data.filter((row: IAbsence) => {
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
      <div className='flex justify-between items-center'>
        <Typography variant='h2' className='my-2'>
          Liste des absences
        </Typography>
      </div>
      <DataGrid
        rowHeight={62}
        loading={isLoading || deleteAbsenceIsLoading}
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

      {/* Update Absence */}
      <Drawer open={isOpen} onClose={onCloseForm} anchor={'right'}>
        {!employeeIsLoading && (
          <AbsenceForm
            mode={mode}
            absenceToEdit={absenceToEdit}
            onClose={onCloseForm}
            isEditMode={isEditMode}
            employees={employeeData}
          />
        )}
      </Drawer>
    </div>
  )
}

export default AbsencesList
