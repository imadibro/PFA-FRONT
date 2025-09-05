import { useGetEquipesQuery } from '@/store/features/equipe/equipeApi'
import { useGetOperationsTasksQuery } from '@/store/features/operation/operationTasksApi'
import { useGetProjectsQuery } from '@/store/features/project/projectApi'
import { useGetAllSitesForDropDawnQuery } from '@/store/features/site/siteApi'
import CustomTextField from '@core/components/mui/TextField'
import type { IOperation, IOperationRequest, IProject, ISite } from '@core/utils/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Grid, MenuItem } from '@mui/material'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import dynamic from 'next/dynamic'
import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import getEditorStateFromHtml from './getEditorStateFromHtml'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false })

interface Props {
  isOpen: boolean
  toggle: () => void
  handleAdd: (operation: IOperationRequest) => void
  handleEdit: (operation: IOperationRequest) => void
  cancleEditMode: () => void
  operationToEdit: IOperation | null
  isEditMode: boolean
}
const schema = yup
  .object({
    site: yup.string().required('Site est requis'),
    operationTasks: yup.string().required('Les operations est requis'),
    project: yup.string().required('Le projet est requis'),
    equipe: yup.string().nullable().notRequired(),
    gabarit: yup.number().nullable().notRequired()
  })
  .required()
export default function OperationForm(props: Props) {
  const { isOpen, toggle, operationToEdit, isEditMode, handleAdd, handleEdit } = props
  const { data: operationTasksData } = useGetOperationsTasksQuery()
  const { data: projectsData } = useGetProjectsQuery()
  const { data: sitesData } = useGetAllSitesForDropDawnQuery()
  const operationTasks = operationTasksData ?? []
  const projects = projectsData ?? []
  const sites = sitesData ?? []

  type OperationFormValues = {
    site: string
    operationTasks: string
    project: string
    comment: EditorState
    gabarit?: number | null
    isPlanified: boolean
  }
  const defaultValues: IOperationRequest = {
    site: isEditMode && operationToEdit && operationToEdit?.site?.id ? operationToEdit.site.id : '',
    operationTasks:
      isEditMode && operationToEdit && operationToEdit.operationTasks ? operationToEdit.operationTasks.id || '' : '',
    project: isEditMode && operationToEdit && operationToEdit?.project?.id ? operationToEdit.project.id || '' : '',
    comment: isEditMode ? getEditorStateFromHtml(operationToEdit?.comment || '') : EditorState.createEmpty(),
    gabarit: isEditMode && operationToEdit && operationToEdit?.gabarit ? (operationToEdit.gabarit ?? null) : null,
    isPlanified: isEditMode && operationToEdit ? (operationToEdit.isPlanified ?? false) : false
  }
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<OperationFormValues>({
    defaultValues,
    resolver: yupResolver(schema) as any
  })
  const onSubmit: SubmitHandler<OperationFormValues> = data => {
    const cleanData = {
      ...data,
      comment: draftToHtml(convertToRaw(data.comment.getCurrentContent()))
    }
    if (isEditMode && operationToEdit) {
      handleEdit({ ...cleanData, id: operationToEdit?.id })
    } else {
      handleAdd(cleanData)
    }
    reset()
    toggle()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={12}>
          <Controller
            name='site'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                SelectProps={{
                  value,
                  onChange: e => onChange(e.target.value)
                }}
                fullWidth
                label='Site *'
                id='site'
                error={Boolean(errors.site)}
                aria-describedby="Tâches d'exploitation"
                {...(errors.site && { helperText: 'Ce champs est obligatoire' })}
              >
                {sites &&
                  (sites as ISite[]).map(site => (
                    <MenuItem key={site.id} value={site.id}>
                      {site.label} {site.siteNbr}
                    </MenuItem>
                  ))}
              </CustomTextField>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name='operationTasks'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                SelectProps={{
                  value,
                  onChange: e => onChange(e.target.value)
                }}
                fullWidth
                label="Tâches d'exploitation *"
                id='operationTasks'
                error={Boolean(errors.operationTasks)}
                aria-describedby='operationTasks'
                {...(errors.site && { helperText: 'Ce champs est obligatoire' })}
              >
                {operationTasks &&
                  operationTasks.map(operationTasks => (
                    <MenuItem key={operationTasks.id} value={operationTasks.id}>
                      {`${operationTasks.operationType.label} ${operationTasks.operationZone.label}
                        ${operationTasks.operationTrans.label}`}
                    </MenuItem>
                  ))}
              </CustomTextField>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name='project'
            control={control}
            rules={{ required: true }}
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                select
                SelectProps={{
                  value,
                  onChange: e => onChange(e)
                }}
                fullWidth
                label='Projet *'
                id='project'
                error={Boolean(errors.project)}
                aria-describedby='projet'
                {...(errors.project && { helperText: 'Ce champs est obligatoire' })}
              >
                {projects &&
                  (projects as IProject[]).map(projects => (
                    <MenuItem key={projects.id} value={projects.id}>
                      {projects.projectCode}
                    </MenuItem>
                  ))}
              </CustomTextField>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Controller
            name='gabarit'
            control={control}
            render={({ field: { value, onChange } }) => (
              // Assuming gabarits is a number input, adjust as necessary
              <CustomTextField
                type='number'
                fullWidth
                label='Gabarit'
                id='gabarit'
                value={value ?? ''}
                onChange={e => onChange(e.target.value === '' ? null : Number(e.target.value))}
                error={Boolean(errors.gabarit)}
                aria-describedby='gabarit'
                {...(errors.gabarit && { helperText: 'Ce champs est obligatoire' })}
              />
            )}
          />
        </Grid>
        {/* <Grid item xs={12} sm={12}>
            <Controller
              name='equipe'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  select
                  SelectProps={{
                    value,
                    onChange: e => onChange(e.target.value)
                  }}
                  fullWidth
                  label='Equipe'
                  id='equipe'
                  error={Boolean(errors.equipe)}
                  aria-describedby='Equipe'
                  {...(errors.equipe && { helperText: 'Ce champs est obligatoire' })}
                >
                  {equipes &&
                    equipes.map(equipe => (
                      <MenuItem key={equipe.id} value={equipe.id}>
                        {equipe.name}
                      </MenuItem>
                    ))}
                </CustomTextField>
              )}
            />
          </Grid> */}
        <Grid item xs={12} sm={12}>
          <Controller
            name='comment'
            control={control}
            render={({ field: { value, onChange } }) => (
              <RichTextEditor editorState={value} setEditorState={onChange} />
            )}
          />
        </Grid>

        <Grid item xs={6} sm={6}>
          <Button fullWidth type='submit' variant='contained'>
            {isEditMode ? 'Modifier' : 'Ajouter'}
          </Button>
        </Grid>
        <Grid item xs={6} sm={6}>
          <Button fullWidth onClick={toggle} style={{ marginLeft: 3 }} variant='outlined' color='error'>
            Annuler
          </Button>
        </Grid>
      </Grid>
    </form>
  )
}
