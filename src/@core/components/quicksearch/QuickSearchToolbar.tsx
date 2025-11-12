import Icon from '@core/components/icon/index'
import CustomTextField from '@core/components/mui/TextField'
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import type { ChangeEvent } from 'react'

interface Props {
  value: string
  clearSearch: () => void
  onChange: (e: ChangeEvent) => void
  toggleForm: () => void
  title: string
  data: any
  showAddButton?: boolean
  savedButton?: boolean
  handleSave?: () => void
}

const QuickSearchToolbar = (props: Props) => {
  const { showAddButton = true } = props
  const { savedButton = false } = props
  return (
    <Box
      sx={{
        gap: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: theme => theme.spacing(2, 5, 4, 5)
      }}
    >
      <div style={{ display: 'flex' }}>
        <CustomTextField
          autoFocus
          type='string'
          value={props.value}
          placeholder='Recherche…'
          onChange={props.onChange}
          InputProps={{
            startAdornment: (
              <Box sx={{ mr: 2, display: 'flex' }}>
                <Icon fontSize='1.25rem' icon='tabler:search' />
              </Box>
            ),
            endAdornment: (
              <IconButton size='small' title='Clear' aria-label='Clear' onClick={props.clearSearch}>
                <Icon fontSize='1.25rem' icon='tabler:x' />
              </IconButton>
            )
          }}
          sx={{
            width: {
              xs: 1,
              sm: 'auto'
            },
            '& .MuiInputBase-root > svg': {
              mr: 2
            },
            mr: 2
          }}
        />
      </div>
      {savedButton && (
        <div>
          <Button variant='contained' color='primary' onClick={props.handleSave} sx={{ minWidth: 140 }}>
            Sauvegarder
          </Button>
        </div>
      )}

      {showAddButton && (
        <div>
          <Button
            title={'Ajouter '.concat(props.title)}
            onClick={props.toggleForm}
            variant='contained'
            sx={{ '& svg': { mr: 2 } }}
          >
            <Icon fontSize='1.125rem' icon='tabler:plus' />
            Ajouter
          </Button>
        </div>
      )}
    </Box>
  )
}

export default QuickSearchToolbar
