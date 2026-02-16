import { useGetOperationsTasksQuery } from '@/store/features/operation/operationTasksApi'
import { useGetProjectsQuery } from '@/store/features/project/projectApi'
import { useGetAllSitesForDropDawnQuery } from '@/store/features/site/siteApi'
import CustomTextField from '@core/components/mui/TextField'
import type { IOperation, IOperationRequest, IProject, ISite, ISiteBrief } from '@core/utils/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button, Checkbox, Chip, FormControlLabel, Grid } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { convertToRaw, EditorState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { SubmitHandler } from 'react-hook-form'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import CreateSiteModal from './CreateSiteModal'
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

type TagSite = ISite | { fromCreate: true; siteNbr: string; label: string }

const schema = yup
  .object({
    sites: yup
      .object({
        siteIds: yup.array().of(yup.string().uuid()),
        toCreate: yup.array().of(
          yup.object({
            siteNbr: yup.string().required('Numéro du site requis'),
            label: yup.string().required('Label requis')
          })
        )
      })
      .test('at-least-one-site', 'Au moins un site sélectionné ou créé', function (value) {
        const { siteIds, toCreate } = value || {}
        const hasSiteIds = siteIds && siteIds.length > 0
        const hasToCreate = toCreate && toCreate.length > 0
        return hasSiteIds || hasToCreate
      })
      .required(),
    operationTasks: yup.string().required('Les operations est requis'),
    project: yup.string().required('Le projet est requis'),
    clientAbri: yup.string().nullable().notRequired(),
    equipe: yup.string().nullable().notRequired(),
    gabarit: yup
      .number()
      .typeError('Gabarit doit être un nombre')
      .required('Gabarit est requis')
      .min(1, 'Gabarit doit être au minimum 1')
  })
  .required()

export default function OperationForm(props: Props) {
  const { toggle, operationToEdit, isEditMode, handleAdd, handleEdit } = props
  const [openCreateSiteModal, setOpenCreateSiteModal] = useState(false)
  const { data: operationTasksData } = useGetOperationsTasksQuery()
  const { data: projectsData } = useGetProjectsQuery()
  const { data: sitesData } = useGetAllSitesForDropDawnQuery()
  const operationTasks = operationTasksData ?? []
  const projects = projectsData ?? []
  const sites = sitesData ?? []

  const defaultValues: IOperationRequest = {
    sites: {
      siteIds: isEditMode && operationToEdit ? (operationToEdit.site as ISiteBrief[]).map(s => s.id) : [],
      toCreate: []
    },
    operationTasks:
      isEditMode && operationToEdit && operationToEdit.operationTasks ? operationToEdit.operationTasks.id || '' : '',
    project: isEditMode && operationToEdit && operationToEdit?.project?.id ? operationToEdit.project.id || '' : '',
    clientAbri: isEditMode && operationToEdit && operationToEdit?.clientAbri ? operationToEdit.clientAbri : '',
    comment: isEditMode ? getEditorStateFromHtml(operationToEdit?.comment || '') : EditorState.createEmpty(),
    gabarit: isEditMode && operationToEdit && operationToEdit?.gabarit ? (operationToEdit.gabarit ?? null) : null,
    isPlanified: isEditMode && operationToEdit ? (operationToEdit.isPlanified ?? false) : false,
    isRecursive: isEditMode && operationToEdit ? (operationToEdit.isRecursive ?? false) : false
  }
  const {
    reset,
    control,
    handleSubmit,
    getValues,
    setValue
    // formState: { errors }
  } = useForm<IOperationRequest>({
    defaultValues,
    resolver: yupResolver(schema) as any
  })
  const onSubmit: SubmitHandler<IOperationRequest> = data => {
    const operationRequest: IOperationRequest = {
      sites: {
        siteIds: data.sites.siteIds,
        toCreate: data.sites.toCreate
      },
      operationTasks: data.operationTasks,
      project: data.project,
      clientAbri: data.clientAbri ?? '',
      comment:
        typeof data.comment === 'string'
          ? data.comment
          : data.comment
            ? draftToHtml(convertToRaw(data.comment.getCurrentContent()))
            : '',
      gabarit: data.gabarit ?? null,
      isPlanified: data.isPlanified,
      isRecursive: data.isRecursive
    }

    if (isEditMode && operationToEdit) {
      handleEdit({ ...operationRequest, id: operationToEdit?.id })
    } else {
      handleAdd(operationRequest)
    }
    reset()
    toggle()
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <Controller
              name='sites.siteIds'
              control={control}
              render={({ fieldState: { error } }) => {
                const selectedIds = getValues('sites.siteIds')
                const toCreateSites = getValues('sites.toCreate')
                const siteTags: TagSite[] = [
                  ...sites.filter((s: ISite) => selectedIds.includes(s.id)),
                  ...toCreateSites.map((s: any) => ({ ...s, fromCreate: true }))
                ]
                return (
                  <Autocomplete
                    multiple
                    size='small'
                    options={sites}
                    getOptionLabel={option => `${option.label} ${option.siteNbr}`}
                    value={siteTags}
                    isOptionEqualToValue={(option, value) => {
                      if ('id' in option && 'id' in value) return option.id === value.id
                      if ('label' in option && 'siteNbr' in option && 'label' in value && 'siteNbr' in value)
                        return option.label === value.label && option.siteNbr === value.siteNbr
                      return false
                    }}
                    // La vraie logique pour supprimer n'importe quel tag
                    onChange={(_, newValue) => {
                      // Séparer les tags existants
                      const selectedSiteIds = newValue.filter((s: TagSite) => 'id' in s).map((s: any) => s.id)

                      // Séparer les tags créés
                      const createdTags = newValue
                        .filter((s: TagSite) => !('id' in s))
                        .map((s: any) => ({ label: s.label, siteNbr: s.siteNbr }))

                      setValue('sites.siteIds', selectedSiteIds)
                      setValue('sites.toCreate', createdTags)
                    }}
                    renderTags={(tagValue, getTagProps) =>
                      tagValue.map((option, index) => (
                        <Chip
                          {...getTagProps({ index })}
                          key={'id' in option ? option.id : `${option.label}-${option.siteNbr}-${index}`}
                          label={`${option.label} ${option.siteNbr}`}
                          variant='outlined'
                        />
                      ))
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Site *'
                        error={!!error}
                        helperText={error ? 'Ce champ est obligatoire' : ''}
                      />
                    )}
                  />
                )
              }}
            />
          </Grid>

          <Button
            variant='outlined'
            size='small'
            sx={{ ml: 'auto', mt: 1 }}
            onClick={() => setOpenCreateSiteModal(true)}
          >
            Ajouter noveaux sites
          </Button>

          <Grid item xs={12} sm={12}>
            <Controller
              name='operationTasks'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Autocomplete
                  size='small'
                  options={operationTasks || []}
                  getOptionLabel={option =>
                    `${option.operationType.label} ${option.operationZone.label} ${option.operationTrans.label}`
                  }
                  value={operationTasks?.find(task => task.id === value) || null}
                  onChange={(event, newValue) => {
                    onChange(newValue ? newValue.id : null)
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label="Tâches d'exploitation *"
                      error={Boolean(error)}
                      helperText={error ? 'Ce champs est obligatoire' : ''}
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Controller
              name='project'
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange }, fieldState: { error } }) => (
                <Autocomplete
                  size='small'
                  options={(projects as IProject[]) || []}
                  getOptionLabel={option => option.projectCode || ''}
                  value={projects.find((project: IProject) => project.id === value) || null}
                  onChange={(_event, newValue) => {
                    const projectId = newValue ? newValue.id : ''
                    onChange(projectId)
                    setValue('clientAbri', newValue?.projectAbrieviation || newValue?.clientAgencyLabel || '')
                  }}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  renderInput={params => (
                    <TextField
                      {...params}
                      label='Projet *'
                      error={Boolean(error)}
                      helperText={error ? 'Ce champs est obligatoire' : ''}
                    />
                  )}
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Controller
              name='clientAbri'
              control={control}
              render={({ field: { value, onChange } }) => (
                <CustomTextField
                  type='text'
                  fullWidth
                  label='Client'
                  id='clientAbri'
                  value={value ?? ''}
                  onChange={e => onChange(e.target.value)}
                  aria-describedby='clientAbri'
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Controller
              name='gabarit'
              control={control}
              render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
                <CustomTextField
                  type='number'
                  fullWidth
                  label='Gabarit'
                  id='gabarit'
                  value={value ?? ''}
                  // empêche l'envoi de chaîne vide -> keep null/'' if you want optional
                  onChange={e => {
                    const raw = e.target.value
                    // allow empty string so user can erase, otherwise convert to number
                    const next = raw === '' ? '' : Number(raw)
                    onChange(next)
                  }}
                  onKeyDown={e => {
                    // Bloque la saisie de caractères indésirables
                    if (['-', 'e', 'E', '+'].includes(e.key)) e.preventDefault()
                  }}
                  onBlur={() => {
                    // clamp à 1 si valeur fournie mais < 1
                    if (value != null && Number(value) < 1) {
                      onChange(1) // forcera la valeur à 1 et déclenchera la validation
                    }
                    onBlur?.() // déclenche validation RHF si présent
                  }}
                  inputProps={{
                    min: 1,
                    step: 1,
                    onWheel: (e: React.WheelEvent<HTMLInputElement>) => (e.target as HTMLInputElement).blur()
                  }}
                  error={Boolean(error)}
                  helperText={error?.message || ''}
                  aria-describedby='gabarit'
                />
              )}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Controller
              name='isRecursive'
              control={control}
              defaultValue={false}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={<Checkbox checked={!!value} onChange={e => onChange(e.target.checked)} />}
                  label='Operation récursive'
                />
              )}
            />
          </Grid>

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

      <CreateSiteModal
        open={openCreateSiteModal}
        onClose={() => setOpenCreateSiteModal(false)}
        onSubmit={(newSite: any) => {
          const currentToCreate = getValues('sites.toCreate')
          setValue('sites.toCreate', [...currentToCreate, newSite])
          setOpenCreateSiteModal(false)
        }}
      />
    </>
  )
}
