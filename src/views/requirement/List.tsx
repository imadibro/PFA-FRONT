import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { ChangeEvent, useState } from 'react'
import CustomModal from '@/@core/components/mui/Modal'
import CreateRequirement from './Create'
import { Drawer, Skeleton } from '@mui/material'
import { useDeleteRequirementMutation, useGetRequirementQuery } from '@/store/features/requirement/requirementApi'
import { DataGrid } from '@mui/x-data-grid'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import QuickSearchToolbar from '@/components/common/QuickSearchToolbar'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import UpdateRequirement from './Update'
import { GetColumns, renderChipCell, renderDateCell, renderTypographyCell } from '@/components/common/GridColumns'

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
  },
  {
    field: 'priority',
    headerName: 'Priorité',
    renderCell: renderChipCell(
      'priority',
      [
        { value: 'Élevé', chipProps: { color: 'error', size: 'small' } },
        { value: 'Moyen', chipProps: { color: 'warning', size: 'small' } },
        { value: 'Faible', chipProps: { color: 'success', size: 'small' } }
      ],
      { color: 'default', size: 'small' }
    )
  },
  {
    flex: 1,
    minWidth: 170,
    field: 'createdAt',
    headerName: 'Creation E',
    renderCell: renderDateCell('createdAt')
  }
]
const RequirementList = ({ mode }: { mode: SystemMode }) => {
  const [openModal, setOpenModal] = useState(false)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<IRequirement[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [requirementToEdit, setRequirementToEdit] = useState<IRequirement | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const { showAlert, showConfirm, showToast } = useSweetAlert()
  const [
    deleteRequirement,
    { isLoading: deleteRequirementIsLoading, isError, error: deleteRequirementError, isSuccess }
  ] = useDeleteRequirementMutation()

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

  const toggleForm = () => setIsOpen(prevState => !prevState)

  const toggleEditMode = (requirement: IRequirement) => {
    setIsEditMode(true)
    setRequirementToEdit(requirement)
    toggleForm()
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(
      'Es-tu sûr?',
      'Vous ne pourrez pas annuler cette action',
      'Supprimer',
      'Annuler'
    )
    if (confirmed) {
      try {
        await deleteRequirement({ requirementId: id })
        showToast('Supprimé avec succès!', 'success')
      } catch (error) {
        showAlert('Error', 'Something wrong went happedn while trying to delete the task', 'error')
      }
    }
  }

  const { data, error, isLoading } = useGetRequirementQuery()

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

  const columns = GetColumns({
    toggleEditMode,
    deleteObject: handleDelete,
    customColumns: customColumns(),
    includeActions: true
  })

  return (
    <div className='bg-backgroundPaper p-6'>
      <div className='flex justify-between items-center'>
        <Typography variant='h2' className='my-2'>
          Liste des exigences
        </Typography>
        <CustomIconButton
          onClick={() => setOpenModal(true)}
          color='primary'
          variant='tonal'
          size='small'
          className='h-10'
        >
          <span className='tabler-plus w-5 h-5 mr-2' />
          Ajouter
        </CustomIconButton>
        <CustomModal onClose={() => setOpenModal(false)} open={openModal}>
          <CreateRequirement mode={mode} onClose={() => setOpenModal(false)} />
        </CustomModal>
      </div>
      {/* <Table data={data} /> */}
      <DataGrid
        rowHeight={62}
        loading={isLoading}
        rows={data}
        localeText={{ noRowsLabel: 'Aucune donnes a afficher' }}
        columns={columns}
        // slots={{ toolbar: QuickSearchToolbar }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            defaultValue: searchText,
            onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value),
            title: 'Exigences'
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
      {/* Update Task */}
      <Drawer open={isOpen} onClose={toggleForm} anchor={'right'}>
        <UpdateRequirement mode={mode} requirementToEdit={requirementToEdit} onClose={toggleForm} />
      </Drawer>
    </div>
  )
}

export default RequirementList
