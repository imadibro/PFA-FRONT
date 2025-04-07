import useSweetAlert from '@/@core/hooks/useSweetAlert'
import exportData from '@/@core/utils/exportData'
import { formatDateFR, stringToDate } from '@/@core/utils/format'
import type { IAbsence } from '@/@core/utils/types'
import {
  GetColumns,
  renderConcatenatedTypographyCell,
  renderDateCell,
  renderTypographyCell
} from '@/components/common/GridColumns'
import QuickSearchToolbar from '@/components/common/QuickSearchToolbar'
import { useDeleteAbsenceMutation, useGetAbsencesQuery , useCreateAbsenceMutation } from '@/store/features/absence/absenceApi'
import { useGetEmployeesQuery, useLazyGetEmployeesByUsernamesQuery } from '@/store/features/employee/employeeApi'
import type { SystemMode } from '@core/types'
import { Alert, Drawer, Skeleton } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import type { ChangeEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import AbsenceForm from './AbsenceForm'
import { getAbsencesFromDB, removeAbsenceFromDB } from '@/utils/idbUtils'

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
  const [isProcessing, setIDBIsProcessing] = useState(false)
  const workerRef = useRef<Worker>()
  const { showAlert, showConfirm, showToast } = useSweetAlert()

  const { data, error, isLoading } = useGetAbsencesQuery()
  const { data: employeeData, isLoading: employeeIsLoading } = useGetEmployeesQuery()
  // Initialize the RTK Query hook
  const [triggerGetEmployees] = useLazyGetEmployeesByUsernamesQuery()

  const [deleteAbsence, { isLoading: deleteAbsenceIsLoading }] = useDeleteAbsenceMutation()
  const [createAbsence, { isLoading: isCreating, isError: createError, error: createErr }] = useCreateAbsenceMutation()

  const processAbsencesFromDB = async () => {
    setIDBIsProcessing(true)

    const absences = await getAbsencesFromDB()
    if (!absences.length) {
      setIDBIsProcessing(false)
      return
    }
    // Extract unique usernames first to minimize API calls
    const uniqueUsernames = [...new Set(absences.map(a => a['username']))]
    try {
      // Fetch all wanted employees in one batch
      const { data: employees } = await triggerGetEmployees(uniqueUsernames)
      const employeeMap = new Map(employees?.map(emp => [emp.username, emp]) || [])
      for (const absence of absences) {
        try {
          if (absence['motif'] && absence['Date de dÃ©but'] && absence['Date de fin'] && absence['username']) {
            const employee = employeeMap.get(absence['username'])

            if (!employee) {
              console.warn(`Employee not found: ${absence['username']}`)
              continue
            }

            const absenceObj: any = {
              startDate: new Date(absence['Date de dÃ©but']).toISOString(),
              endDate: new Date(absence['Date de fin']).toISOString(),
              notes: absence['notes'],
              absence: absence['motif'],
              employee
            }
            await createAbsence(absenceObj)
              .unwrap()
              .then(async () => {
                await removeAbsenceFromDB(absence.id)
              })
              .finally(async () => {
                await new Promise(resolve => setTimeout(resolve, 800))
              })
          } else {
            showToast("Le format des données n'est pas correct !", 'error')
          }
        } catch (error) {
          console.error('Error inserting absence:', error)
        }
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      showToast('Erreur lors de la récupération des employés', 'error')
    } finally {
      setIDBIsProcessing(false)
    }
  }

  useEffect(() => {
    workerRef.current = new Worker(new URL('@/utils/excelWorker.ts', import.meta.url))
    workerRef.current.onmessage = async event => {
      if (event.data.status === 'success') {
        showToast(
          'Les données ont été stockées avec succès. Vous êtes libre de faire autre chose maintenant',
          'success'
        )
        processAbsencesFromDB()
      }
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  useEffect(() => {
    processAbsencesFromDB() // Start processing absences from IndexedDB
  }, [createAbsence])

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

  const handleImport = (file: File) => {
    if (workerRef.current) {
      workerRef.current.postMessage({ file, type: 'absence' })
    }
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
    hideAddButton: false,
    handleImport: !isProcessing ? handleImport : undefined
  }

  return (
    <div className='bg-backgroundPaper p-6'>
      <div className='flex justify-between items-center'></div>
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
