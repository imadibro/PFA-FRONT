import type { SystemMode } from '@core/types'
import Table from '@core/components/mui/Table'
import Typography from '@mui/material/Typography'
import CustomIconButton from '@/@core/components/mui/IconButton'
import { useState } from 'react'
import CustomModal from '@/@core/components/mui/Modal'
import CreateRequirement from './Create'

const sampleData = [
  {
    id: 1,
    label: 'Frozen yoghurt',
    description: 'this is a description'
  },
  {
    id: 2,
    label: 'Ice cream sandwich',
    description: 'this is a description'
  },
  {
    id: 3,
    label: 'Eclair',
    description: 'this is a description'
  },
  {
    id: 4,
    label: 'Cupcake',
    description: 'this is a description'
  },
  {
    id: 5,
    label: 'Gingerbread',
    description: 'this is a description'
  },
  {
    id: 6,
    label: 'Lollipop',
    description: 'this is a description'
  },
  {
    id: 7,
    label: 'Macaron',
    description: 'this is a description'
  },
  {
    id: 8,
    label: 'Churros',
    description: 'this is a description'
  },
  {
    id: 9,
    label: 'Pavlova',
    description: 'this is a description'
  },
  {
    id: 10,
    label: 'Tiramisu',
    description: 'this is a description'
  }
]

const RequirementList = ({ mode }: { mode: SystemMode }) => {
  const [openModal, setOpenModal] = useState(false)

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
      <Table data={sampleData} />
    </div>
  )
}

export default RequirementList
