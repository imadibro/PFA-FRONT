import Button from '@mui/material/Button'
import { useLazyExportPlanningExcelQuery } from '../../../store/features/planing/planingApi' // adapte le chemin

type ExportBtnProps = {
  startDate?: string
  endDate?: string
}

export function ExportPlanningButton({ startDate, endDate }: ExportBtnProps) {
  const [trigger, { isFetching }] = useLazyExportPlanningExcelQuery()

  const handleExport = async () => {
    try {
      const blob = await trigger({ startDate, endDate }).unwrap()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `planning_${startDate ?? 'week'}_${endDate ?? ''}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Export planning failed', e)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isFetching}
      variant='contained'
      sx={{
        bgcolor: '#32aa68',
        color: '#222',
        fontWeight: 600,
        boxShadow: 'none',
        '&:hover': { bgcolor: '#34e78e', boxShadow: 'none' },
        '& i': { mr: 1 }
      }}
      title='Exporter (back)'
    >
      <i className='tabler-file-export' />
      {isFetching ? 'Export…' : 'Exporter'}
    </Button>
  )
}
