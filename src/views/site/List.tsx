import type { SystemMode } from '@core/types'
import Table from '@core/components/mui/Table'
import Typography from '@mui/material/Typography'

const sampleData = [
  {
    id: 1,
    label: 'Frozen yoghurt',
    description: 'this is a description',
    requirements: [
      { id: 1, label: 'Task 1', description: 'Description for task 1' },
      { id: 2, label: 'Task 2', description: 'Description for task 2' }
    ]
  },
  {
    id: 2,
    label: 'Ice cream sandwich',
    description: 'this is a description',
    requirements: [
      { id: 3, label: 'Task 1', description: 'Description for task 1' },
      { id: 4, label: 'Task 2', description: 'Description for task 2' }
    ]
  },
  {
    id: 3,
    label: 'Eclair',
    description: 'this is a description',
    requirements: [
      { id: 5, label: 'Task 1', description: 'Description for task 1' },
      { id: 6, label: 'Task 2', description: 'Description for task 2' }
    ]
  },
  {
    id: 4,
    label: 'Cupcake',
    description: 'this is a description',
    requirements: [
      { id: 7, label: 'Task 1', description: 'Description for task 1' },
      { id: 8, label: 'Task 2', description: 'Description for task 2' }
    ]
  },
  {
    id: 5,
    label: 'Gingerbread',
    description: 'this is a description',
    requirements: [
      { id: 9, label: 'Task 1', description: 'Description for task 1' },
      { id: 10, label: 'Task 2', description: 'Description for task 2' }
    ]
  },
  {
    id: 6,
    label: 'Lollipop',
    description: 'this is a description',
    requirements: [
      { id: 11, label: 'Task 1', description: 'Description for task 1' },
      { id: 12, label: 'Task 2', description: 'Description for task 2' }
    ]
  },
  {
    id: 7,
    label: 'Macaron',
    description: 'this is a description',
    requirements: [
      { id: 13, label: 'Task 1', description: 'Description for task 1' },
      { id: 14, label: 'Task 2', description: 'Description for task 2' }
    ]
  },
  {
    id: 8,
    label: 'Churros',
    description: 'this is a description',
    requirements: [
      { id: 15, label: 'Task 1', description: 'Description for task 1' },
      { id: 16, label: 'Task 2', description: 'Description for task 2' }
    ]
  },
  {
    id: 9,
    label: 'Pavlova',
    description: 'this is a description',
    requirements: [
      { id: 17, label: 'Task 1', description: 'Description for task 1' },
      { id: 18, label: 'Task 2', description: 'Description for task 2' }
    ]
  },
  {
    id: 10,
    label: 'Tiramisu',
    description: 'this is a description',
    requirements: [
      { id: 19, label: 'Task 1', description: 'Description for task 1' },
      { id: 20, label: 'Task 2', description: 'Description for task 2' }
    ]
  }
]

const SiteList = ({ mode }: { mode: SystemMode }) => {
  return (
    <div className='bg-backgroundPaper p-6'>
      <Typography variant='h2' className='my-2'>
        Site List
      </Typography>
      <Table data={sampleData} />
    </div>
  )
}

export default SiteList
