import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import type { SystemMode } from '@core/types'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import { GetColumns, renderTypographyCell } from '@/components/common/GridColumns'
import QuickSearchToolbar from '@/components/common/QuickSearchToolbar'
import { Alert, Drawer, Skeleton, Typography } from '@mui/material'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import { formatDateFR, stringToDate } from '@/@core/utils/format'
import exportData from '@/@core/utils/exportData'
import { IClientOrder } from '@/@core/utils/types'
import { useGetClientOrdersQuery } from '@/store/features/clientOrder/clientOrderApi'
import { useGetSiteQuery } from '@/store/features/site/siteApi'
import CreateClientOrder from './Create'

const customColumns = () => [
  {
    flex: 1,
    field: 'clientOrderCode',
    headerName: 'Code du projet',
    minWidth: 180,
    renderCell: renderTypographyCell('clientOrderCode')
  },
  {
    flex: 1,
    field: 'activityLabel',
    headerName: "Libellé d'activité",
    minWidth: 180,
    renderCell: renderTypographyCell('activityLabel')
  },
  {
    flex: 1,
    minWidth: 250,
    field: 'clientAgencyLabel',
    headerName: "Libellé de l'agence",
    renderCell: renderTypographyCell('clientAgencyLabel')
  }
]

const ClientOrdersList = ({ mode }: { mode: SystemMode }) => {
  const [openModal, setOpenModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<IClientOrder[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [clientOrderToEdit, setClientOrderToEdit] = useState<IClientOrder | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = data.filter((row: IClientOrder) => {
      return Object.keys(row).some(field => {
        if (row[field as keyof IClientOrder] !== null && row[field as keyof IClientOrder] !== undefined) {
          return searchRegex.test(row[field as keyof IClientOrder]!.toString())
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

  const { data, error, isLoading } = useGetClientOrdersQuery()
  const { data: sites, error: siteErrors, isLoading: isSiteIsLoading } = useGetSiteQuery()
  const { data: clients, error: clientErrors, isLoading: isClientIsLoading } = useGetSiteQuery()
  const { data: projects, error: projectErrors, isLoading: isProjectIsLoading } = useGetSiteQuery()
  const { data: operations, error: operationErrors, isLoading: isOperationIsLoading } = useGetSiteQuery()

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

  const toggleEditMode = (clientOrder: IClientOrder) => {
    setIsEditMode(true)
    setClientOrderToEdit(clientOrder)
    setOpenUpdateModal(true)
  }

  const onCloseForm = () => {
    setClientOrderToEdit(null)
    toggleForm()
  }

  const handleDateFilter = (start: Date, end: Date) => {
    const filteredRows = data.filter((row: IClientOrder) => {
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
    deleteObject: () => {},
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
          Liste des commandes
        </Typography>
        {!isSiteIsLoading &&
          !siteErrors &&
          !isClientIsLoading &&
          !clientErrors &&
          !isOperationIsLoading &&
          !operationErrors &&
          !isProjectIsLoading &&
          !projectErrors && (
            <div>
              <Drawer onClose={() => setOpenModal(false)} open={openModal} anchor={'right'}>
                <CreateClientOrder
                  mode={mode}
                  sites={sites}
                  clients={clients}
                  operations={operations}
                  projects={projects}
                  close={() => setOpenModal(false)}
                />
              </Drawer>
            </div>
          )}
      </div>
      <DataGrid
        rowHeight={35}
        loading={isLoading}
        rows={isFiltering ? filteredData : data}
        localeText={{ noRowsLabel: 'Aucune donnes a afficher' }}
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
        {/* {!siteIsLoading && (
                <AbsenceForm
                  mode={mode}
                  absenceToEdit={absenceToEdit}
                  onClose={onCloseForm}
                  isEditMode={isEditMode}
                  employees={employeeData}
                />
              )} */}
      </Drawer>
    </div>
  )
}

export default ClientOrdersList
