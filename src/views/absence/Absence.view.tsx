import React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import QuickSearchToolbar from '@/components/common/QuickSearchToolbar'
import type { ChangeEvent } from 'react'
import exportData from '@/@core/utils/exportData'
import {
  GetColumns,
  renderConcatenatedTypographyCell,
  renderDateCell,
  renderTypographyCell
} from '@/components/common/GridColumns'
// import type { IAbsence } from '@/@core/utils/types'
import { formatDateFR /* stringToDate*/ } from '@/@core/utils/format'

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

const AbsenceView = (props: any) => {
  // const [isOpen, setIsOpen] = useState<boolean>(false)
  const {
    data,
    isLoading,
    deleteAbsenceIsLoading,
    isFiltering,
    filteredData,
    paginationModel,
    setPaginationModel,
    handleDelete,
    toggleEditMode,
    searchText,
    handleSearch,
    toggleForm,
    handleDateFilter,
    clearDateFilter,
    handleImport,
    isProcessing
  } = props

  const fieldHandlers = {
    createdAt: (value: string) => formatDateFR(new Date(value)),
    updatedAt: (value: string) => formatDateFR(new Date(value))
  }

  const columns = GetColumns({
    toggleEditMode,
    deleteObject: handleDelete,
    customColumns: customColumns(),
    includeActions: true
  })

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
    data: exportData(isFiltering ? filteredData : data?.data, customColumns(), fieldHandlers),
    showExcel: true,
    hideAddButton: false,
    handleImport: !isProcessing ? handleImport : undefined
  }

  return (
    <DataGrid
      rowHeight={35}
      loading={isLoading || deleteAbsenceIsLoading}
      rows={isFiltering ? filteredData : data?.data || []}
      rowCount={data?.total || 0}
      paginationMode='server'
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
  )
}

export default AbsenceView
