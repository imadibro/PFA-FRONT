import type { SystemMode } from '@core/types'
import Table from '@core/components/mui/Table'
import Typography from '@mui/material/Typography'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { useState } from 'react'
import CustomModal from '@/@core/components/mui/Modal'
import CreateRequirement from './Create'
import { Skeleton } from '@mui/material'
import { useGetRequirementQuery } from '@/store/features/requirement/requirementApi'

const RequirementList = ({ mode }: { mode: SystemMode }) => {
  const [openModal, setOpenModal] = useState(false)

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

  return (
    <div className='bg-backgroundPaper p-6'>
      <div className='flex justify-between items-center'>
        <Typography variant='h2' className='my-2'>
          Requirement List
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
          <CreateRequirement mode={mode} />
        </CustomModal>
      </div>
      <Table data={data} />
    </div>
  )
}

export default RequirementList
