import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'
import { useDeleteSiteMutation, useGetSiteQuery } from '@/store/features/site/siteApi'
import { DataGrid } from '@mui/x-data-grid'
import { ChangeEvent, useState } from 'react'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import { Drawer, Skeleton } from '@mui/material'
import CustomModal from '@/@core/components/mui/Modal'
import CustomIconButton from '@/@core/components/mui/IconButton'
import CreateSite from './Create'
import { useGetNotAssignedRequirementsQuery } from '@/store/features/requirement/requirementApi'
import useSweetAlert from '@/@core/hooks/useSweetAlert'
import UpdateSite from './Update'
import { GetColumns, renderChipsCell, renderDateCell, renderTypographyCell } from '@/components/common/GridColumns'

const customColumns = () => [
  {
    flex: 1,
    field: 'siteNbr',
    headerName: 'site Number',
    minWidth: 180,
    renderCell: renderTypographyCell('siteNbr')
  },
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
    flex: 1,
    minWidth: 250,
    field: 'requirements',
    headerName: 'Requirements',
    renderCell: renderChipsCell({
      field: 'requirements',
      chipProps: { variant: 'filled', color: 'primary' }
    })
  },
  {
    flex: 1,
    minWidth: 170,
    field: 'createdAt',
    headerName: 'Creation T',
    renderCell: renderDateCell('createdAt')
  }
]

const SiteList = ({ mode }: { mode: SystemMode }) => {
  const [openModal, setOpenModal] = useState(false)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<IRequirement[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [siteToEdit, setSiteToEdit] = useState<ISite | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)

  const { showAlert, showConfirm, showToast } = useSweetAlert()
  const [deleteSite, { isLoading: deleteSiteIsLoading, isError, error: deleteSiteError, isSuccess }] =
    useDeleteSiteMutation()

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

  const { data, error, isLoading } = useGetSiteQuery()
  const {
    data: requirementData,
    error: requirementError,
    isLoading: isLoadingRequirements
  } = useGetNotAssignedRequirementsQuery()

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

  const toggleForm = () => setIsOpen(prevState => !prevState)

  const toggleEditMode = (site: ISite) => {
    setIsEditMode(true)
    setSiteToEdit(site)
    toggleForm()
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm('Are you sure?', "You won't be able to revert this!", 'Delete', 'Cancel')
    if (confirmed) {
      try {
        await deleteSite({ siteId: id })
        showToast('Deleted successfully!', 'success')
      } catch (error) {
        showAlert('Error', 'Something wrong went happedn while trying to delete the site', 'error')
      }
    }
  }

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
          Site List
        </Typography>
        {!isLoadingRequirements && !requirementError && (
          <div>
            <CustomIconButton
              onClick={() => setOpenModal(true)}
              color='primary'
              variant='tonal'
              size='small'
              className='h-10'
            >
              <span className='tabler-plus w-5 h-5 mr-2' />
              Add
            </CustomIconButton>
            <CustomModal onClose={() => setOpenModal(false)} open={openModal}>
              <CreateSite mode={mode} requirements={requirementData} close={() => setOpenModal(false)} />
            </CustomModal>
          </div>
        )}
      </div>
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
            title: 'Tasks'
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

      {/* Update Operation */}
      <Drawer open={isOpen} onClose={toggleForm} anchor={'right'}>
        <UpdateSite mode={mode} siteToEdit={siteToEdit} requirements={requirementData} onClose={toggleForm} />
      </Drawer>
    </div>
  )
}

export default SiteList
