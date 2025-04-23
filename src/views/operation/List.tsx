'use client'

import useSweetAlert from '@/@core/hooks/useSweetAlert'
import { formatDateFR } from '@/@core/utils/format'
import type { IOperation, IRequirement } from '@/@core/utils/types'
import OperationCard from '@/components/operationCard/DetailedCard'
import { useDeleteOperationMutation, useGetOperationsQuery } from '@/store/features/operation/operationApi'
import type { SystemMode } from '@core/types'
import { Alert, Drawer } from '@mui/material'
import { useState } from 'react'
import CreateOperation from './Create'
import OperationDetails from './Details'

const OperationList = ({ mode }: { mode: SystemMode }) => {
  const [openModal, setOpenModal] = useState(false)
  const [openUpdateModal, setOpenUpdateModal] = useState(false)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<IRequirement[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)
  const [operationToEdit, setOperationToEdit] = useState<IOperation | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const { showAlert, showConfirm, showToast } = useSweetAlert()
  const [deleteOperation, { isLoading: deleteOperationIsLoading, isError, error: deleteOperationError, isSuccess }] =
    useDeleteOperationMutation()

  const { data, error, isLoading } = useGetOperationsQuery()

  // const handleSearch = useCallback(
  //   (searchValue: string) => {
  //     setSearchText(searchValue)
  //     const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
  //     const filteredRows = data.filter((row: IRequirement) => {
  //       return Object.keys(row).some(field => {
  //         if (row[field as keyof IRequirement] !== null && row[field as keyof IRequirement] !== undefined) {
  //           return searchRegex.test(row[field as keyof IRequirement]!.toString())
  //         }
  //       })
  //     })
  //     if (searchValue.length) {
  //       setIsFiltering(true)
  //       setFilteredData(filteredRows )
  //     } else {
  //       setIsFiltering(false)
  //       setFilteredData([])
  //     }
  //   },
  //   [data]
  // )

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

  const toggleEditMode = (operation: IOperation) => {
    setIsEditMode(true)
    setOperationToEdit(operation)
    setOpenUpdateModal(true)
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(
      '',
      'Etes-vous sûr de vouloir supprimer cette opération ?',
      'Supprimer',
      'Annuler'
    )
    if (confirmed) {
      try {
        await deleteOperation({ operationId: id })
        showToast('Supprimé avec succès !', 'success')
      } catch (error) {
        showAlert('Error', "Une erreur s'est produite lors de la tentative de suppression de l'opération", 'error')
      }
    }
  }

  // const handleDateFilter = (start: Date, end: Date) => {
  //   const filteredRows = data.filter((row: IOperation) => {
  //     const formattedCreatedAt = stringToDate(row?.createdAt.toDateString() || '')

  //     if (!formattedCreatedAt || isNaN(formattedCreatedAt.getTime())) {
  //       return false
  //     }

  //     return formattedCreatedAt >= start && formattedCreatedAt <= end
  //   })
  //   setIsFiltering(true)
  //   setFilteredData(filteredRows)
  // }

  const clearDateFilter = () => {
    setIsFiltering(false)
    setFilteredData([])
  }

  const fieldHandlers = {
    createdAt: (value: string) => formatDateFR(new Date(value)),
    updatedAt: (value: string) => formatDateFR(new Date(value))
  }

  // const toolbarProps = {
  //   value: searchText,
  //   clearSearch: () => handleSearch(''),
  //   onChange: (event: ChangeEvent<HTMLInputElement>) => {
  //     handleSearch(event.target.value)
  //   },
  //   handleChecked: () => {},
  //   toggleForm,
  //   title: 'Taches',
  //   checkBoxLabel: '',
  //   showCheckBox: false,
  //   showDateFilter: false,
  //   handleDateFilter,
  //   clearDateFilter,
  //   data: exportData(isFiltering ? filteredData : data, customColumns(), fieldHandlers),
  //   showExcel: true,
  //   hideAddButton: isLoadingTasks || taskError ? true : false
  // }

  return (
    <div className='bg-backgroundPaper container mx-auto py-8 px-4'>
      {/* <div className='flex justify-between items-center'>
        {!isLoadingTasks && !taskError && (
          <div>
            <Drawer onClose={() => setOpenModal(false)} open={openModal} anchor={'right'}>
              <CreateOperation mode={mode} close={() => setOpenModal(false)} />
            </Drawer>
          </div>
        )}
      </div> */}

      {/* add a header */}
      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-2xl font-bold'>Liste des Opérations</h2>
        <button className='bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90' onClick={toggleForm}>
          Ajouter une opération
        </button>
      </div>

      {/* cards grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {data?.map((operation: IOperation) => <OperationCard key={operation.id} operation={operation} />)}
      </div>

      <Drawer onClose={() => setOpenModal(false)} open={openModal} anchor={'right'}>
        <CreateOperation close={() => setOpenModal(false)} />
      </Drawer>

      {/* Update Operation */}
      {/* <Drawer open={openUpdateModal} onClose={() => setOpenUpdateModal(false)} anchor={'right'}>
        <UpdateOperation mode={mode} operationToEdit={operationToEdit} onClose={() => setOpenUpdateModal(false)} />
      </Drawer> */}

      {/* details drawer */}
      <Drawer open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} anchor='right'>
        <OperationDetails mode={mode} close={() => setIsDetailsOpen(false)} operation={operationToEdit} />
      </Drawer>
    </div>
  )
}

export default OperationList
