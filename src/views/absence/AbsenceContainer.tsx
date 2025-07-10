import useSweetAlert from '@/@core/hooks/useSweetAlert'
import { stringToDate } from '@/@core/utils/format'
import type { IAbsence } from '@/@core/utils/types'
import {
  useCreateAbsenceMutation,
  useDeleteAbsenceMutation,
  useGetAbsencesQuery
} from '@/store/features/absence/absenceApi'
import { useGetAllEmployeesQuery, useLazyGetEmployeesByUsernamesQuery } from '@/store/features/employee/employeeApi'
import { getAbsencesFromDB, removeAbsenceFromDB } from '@/utils/idbUtils'
import type { SystemMode } from '@core/types'
import { Alert } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import AbsenceForm from './AbsenceForm'
import AbsenceView from './Absence.view'
import { useToastComponante } from '@/components/common/DeletedComponante'

const AbsencesContainer = ({ mode }: { mode: SystemMode }) => {
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<IAbsence[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [absenceToEdit, setAbsenceToEdit] = useState<IAbsence | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isProcessing, setIDBIsProcessing] = useState(false)
  const workerRef = useRef<Worker>()
  const { showAlert, showToast } = useSweetAlert()
  const { confirmDelete } = useToastComponante()

  const { data, error, isLoading } = useGetAbsencesQuery(
    {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      search: searchText
    },
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
      refetchOnFocus: true
    }
  )
  const { data: employeeData, isLoading: employeeIsLoading } = useGetAllEmployeesQuery()
  // Initialize the RTK Query hook
  const [triggerGetEmployees] = useLazyGetEmployeesByUsernamesQuery()

  const [deleteAbsence, { isLoading: deleteAbsenceIsLoading }] = useDeleteAbsenceMutation()
  const [createAbsence, { isLoading: isCreating, isError: createError, error: createErr }] = useCreateAbsenceMutation()

  const processAbsencesFromDB = async () => {
    setIDBIsProcessing(true)

    const absences = await getAbsencesFromDB()
    console.log('Processing absences from IndexedDB:', absences)
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

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
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
    const confirmed = await confirmDelete('cette absence ?')
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

  return (
    <div className='bg-backgroundPaper p-6'>
      <div className='flex justify-between items-center'></div>
      <AbsenceView
        isFiltering={isFiltering}
        filteredData={filteredData}
        data={data}
        isLoading={isLoading}
        deleteAbsenceIsLoading={deleteAbsenceIsLoading}
        paginationModel={paginationModel}
        setPaginationModel={setPaginationModel}
        handleDelete={handleDelete}
        toggleEditMode={toggleEditMode}
        searchText={searchText}
        handleSearch={handleSearch}
        toggleForm={toggleForm}
        handleDateFilter={handleDateFilter}
        clearDateFilter={clearDateFilter}
        hndleImport={handleImport}
        isProcessing={isProcessing}
      />

      {!employeeIsLoading && (
        <AbsenceForm
          isOpen={isOpen}
          mode={mode}
          absenceToEdit={absenceToEdit}
          onClose={onCloseForm}
          isEditMode={isEditMode}
          employees={employeeData}
        />
      )}
    </div>
  )
}

export default AbsencesContainer
