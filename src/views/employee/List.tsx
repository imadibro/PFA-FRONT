import useSweetAlert from '@/@core/hooks/useSweetAlert'
import exportData from '@/@core/utils/exportData'
import { formatDateFR, stringToDate } from '@/@core/utils/format'
import type { IEmployee } from '@/@core/utils/types'
import {
  GetColumns,
  renderChipCell,
  renderConcatenatedTypographyCell,
  renderTypographyCell
} from '@/components/common/GridColumns'
import QuickSearchToolbar from '@/components/common/QuickSearchToolbar'
import { useDeleteEmployeeMutation, useGetEmployeesQuery } from '@/store/features/employee/employeeApi'
import { useGetRolesQuery } from '@/store/features/role/roleApi'
import type { SystemMode } from '@core/types'
import { Alert } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import type { ChangeEvent } from 'react'
import { useState } from 'react'
import EmployeeForm from './EmployeeForm'
import type { GridRenderCellParams } from '@mui/x-data-grid'

const customColumns = () => [
  {
    flex: 1,
    field: 'username',
    headerName: "Nom d'utilisateur",
    minWidth: 180,
    renderCell: renderTypographyCell('username')
  },
  {
    flex: 1,
    minWidth: 250,
    field: 'firstName',
    headerName: 'Nom complet',
    renderCell: renderConcatenatedTypographyCell(['lastName', 'firstName'])
  },
  {
    flex: 1,
    minWidth: 250,
    field: 'email',
    headerName: 'E-mail',
    renderCell: renderTypographyCell('email')
  },
  {
    field: 'role',
    headerName: 'Rôle',
    minWidth: 250,
    renderCell: renderChipCell(
      'role',
      [
        { value: 'conducteur travaux', chipProps: { color: 'error', size: 'small' } },
        { value: 'technicien', chipProps: { color: 'warning', size: 'small' } },
        { value: "chef d'équipe", chipProps: { color: 'success', size: 'small' } }
      ],
      { color: 'default', size: 'small' },
      undefined,
      'role'
    )
  },
  {
    flex: 1,
    minWidth: 250,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: GridRenderCellParams<any, any>) => (
      <span style={{ color: row.status ? 'green' : 'gray' }}>{row.status ? 'Actif' : 'Non actif'}</span>
    )
  }
]

const EmployeesList = ({ mode }: { mode: SystemMode }) => {
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<IEmployee[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [employeeToEdit, setEmployeeToEdit] = useState<IEmployee | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const { showAlert, showConfirm, showToast } = useSweetAlert()
  const [deleteEmployee, { isLoading: deleteEmployeeIsLoading, isError, error: deleteEmployeeError, isSuccess }] =
    useDeleteEmployeeMutation()

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = data.filter((row: IEmployee) => {
      return Object.keys(row).some(field => {
        if (row[field as keyof IEmployee] !== null && row[field as keyof IEmployee] !== undefined) {
          return searchRegex.test(row[field as keyof IEmployee]!.toString())
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

  const { data, error, isLoading } = useGetEmployeesQuery()
  const { data: rolesData, error: rolesError, isLoading: isLoadingRoles } = useGetRolesQuery()

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

  const toggleForm = () => setIsOpen(prevState => !prevState)

  const toggleEditMode = (employee: IEmployee) => {
    setIsEditMode(true)
    setEmployeeToEdit(employee)
    toggleForm()
  }

  const onCloseForm = () => {
    setEmployeeToEdit(null)
    toggleForm()
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm('', 'Etes-vous sûr de vouloir supprimer cet employé ?', 'Supprimer', 'Annuler')
    if (confirmed) {
      try {
        await deleteEmployee({ employeeId: id })
        showToast('Supprimé avec succès !', 'success')
      } catch (error) {
        showAlert('Error', "Une erreur s'est produite lors de la tentative de suppression de l'employé", 'error')
      }
    }
  }

  const handleDateFilter = (start: Date, end: Date) => {
    const filteredRows = data.filter((row: IEmployee) => {
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
        rowHeight={44}
        loading={isLoading || deleteEmployeeIsLoading}
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

      {/* Employee Form*/}
      {!isLoadingRoles && !rolesError && (
        <EmployeeForm
          key={isEditMode ? employeeToEdit?.id : 'new'}
          isOpen={isOpen}
          mode={mode}
          employeeToEdit={employeeToEdit}
          onClose={onCloseForm}
          isEditMode={isEditMode}
          roles={rolesData}
        />
      )}
    </div>
  )
}
export default EmployeesList
