import type { SystemMode } from '@core/types'
import Typography from '@mui/material/Typography'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { ChangeEvent, useState } from 'react'
import CustomModal from '@/@core/components/mui/Modal'
import CreateTask from './Create'
import { Skeleton } from '@mui/material'
import { useGetTasksQuery } from '@/store/features/task/taskApi'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { formatDateFR } from '@/@core/utils/format'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import QuickSearchToolbar from '@/components/common/QuickSearchToolbar'

interface CellType {
  row: any
}

const columns = (): GridColDef[] => {
  return [
    {
      flex: 1,
      minWidth: 180,
      field: 'label',
      headerName: 'Label',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }} title={row.label}>
          {row.label}
        </Typography>
      )
    },
    {
      flex: 1,
      minWidth: 250,
      field: 'description',
      headerName: 'Description',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }} title={row.description}>
          {row.description}
        </Typography>
      )
    },

    {
      flex: 1,
      minWidth: 170,
      field: 'createdAt',
      headerName: 'Creation BC',
      renderCell: ({ row }: CellType) => (
        <Typography noWrap sx={{ fontWeight: 500, color: 'text.secondary' }}>
          {formatDateFR(new Date(row.createdAt))}
        </Typography>
      )
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false
      // renderCell: ({ row }: CellType) => (
      //   <RowOptions toggleEditMode={toggleEditMode} deleteObject={deleteObject} row={row} setIsPDFLoading={setIsPDFLoading} />
      // )
    }
  ]
}

const TaskList = ({ mode }: { mode: SystemMode }) => {
  const [openModal, setOpenModal] = useState(false)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<ITask[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  const { data, error, isLoading } = useGetTasksQuery()

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

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = data.filter((row: ITask) => {
      return Object.keys(row).some(field => {
        if (row[field as keyof ITask] !== null && row[field as keyof ITask] !== undefined) {
          return searchRegex.test(row[field as keyof ITask]!.toString())
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
  return (
    <div className='bg-backgroundPaper p-6'>
      <div className='flex justify-between items-center'>
        <Typography variant='h2' className='my-2'>
          Tasks List
        </Typography>
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
          <CreateTask mode={mode} />
        </CustomModal>
      </div>
      {/* <Table data={data} /> */}
      <DataGrid
        rowHeight={62}
        loading={isLoading}
        rows={data}
        localeText={{ noRowsLabel: 'Aucune donnes a afficher' }}
        columns={columns()}
        // slots={{ toolbar: QuickSearchToolbar }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          toolbar: {
            defaultValue: searchText,
            onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value),
            // toggleForm,
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
    </div>
  )
}

export default TaskList
