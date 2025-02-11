import type { SystemMode } from '@core/types'
import Table from '@core/components/mui/Table'
import Typography from '@mui/material/Typography'
import { Skeleton } from '@mui/material'
import { useGetSiteQuery } from '@/store/features/site/siteApi'

const SiteList = ({ mode }: { mode: SystemMode }) => {
  const { data, error, isLoading } = useGetSiteQuery()

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
      <Typography variant='h2' className='my-2'>
        Site List
      </Typography>
      <Table data={data} />
    </div>
  )
}

export default SiteList
