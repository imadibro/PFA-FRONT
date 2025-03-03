import { IOperation } from '@/@core/utils/types'
import { useGetOperationByIdQuery } from '@/store/features/operation/operationApi'
import type { SystemMode } from '@core/types'
import {
  Box,
  IconButton,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Skeleton
} from '@mui/material'

const OperationDetails = ({
  mode,
  operation,
  close
}: {
  mode: SystemMode
  operation: IOperation | null
  close: () => void
}) => {
  const { data, error, isLoading } = useGetOperationByIdQuery(operation?.id || '')

  return (
    <Box sx={{ width: '100%', position: 'relative', p: 4, px: 0, minWidth: 450 }}>
      <IconButton onClick={close} sx={{ position: 'absolute', top: 8, left: 8, color: 'grey.600' }}>
        <i className='tabler-x' />
      </IconButton>

      <Card sx={{ boxShadow: 0, borderRadius: 3, p: 2, px: 0, mt: 2 }}>
        <Typography variant='h3' className='m-2 text-center'>
          opération détails
        </Typography>
        <Divider sx={{ my: 4 }} />
        <CardContent>
          <Typography variant='h5' fontWeight={600} gutterBottom>
            Libellé : {operation?.label || 'Aucune opération sélectionnée'}
          </Typography>

          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            Description : {operation?.description || 'No description available.'}
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Typography variant='h6' fontWeight={500} gutterBottom>
            Tâches associées
          </Typography>

          {isLoading ? (
            <div>
              <Skeleton variant='rounded' width={'100%'} height={50} className='my-2' />
              <Skeleton variant='rectangular' width={'100%'} height={50} />
              <Skeleton variant='rounded' width={'100%'} height={50} className='my-2' />
            </div>
          ) : (
            <List disablePadding>
              {data?.tasks?.length ? (
                data.tasks.map(task => (
                  <ListItem
                    key={task.id}
                    sx={{
                      bgcolor: mode == 'dark' ? 'black' : 'grey.100',
                      borderRadius: 2,
                      mb: 2,
                      px: 2,
                      py: 2,
                      transition: 'background 0.3s',
                      '&:hover': { bgcolor: mode == 'dark' ? 'grey.700' : 'grey.200' }
                    }}
                  >
                    <ListItemText primary={task.label} secondary={`Description: ${task.description}`} />
                  </ListItem>
                ))
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  Aucune tâche disponible.
                </Typography>
              )}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default OperationDetails
