import useSweetAlert from '@/@core/hooks/useSweetAlert'
import { DEFAULT_PAGE, DEFAULT_SIZE_PER_PAGE } from '@/@core/utils/constants'
import exportData from '@/@core/utils/exportData'
import { formatDateFR, stringToDate } from '@/@core/utils/format'
import type { ISite } from '@/@core/utils/types'
import { GetColumns, renderTypographyCell } from '@/components/common/GridColumns'
import QuickSearchToolbar from '@/components/common/QuickSearchToolbar'
import { useToastComponante } from '@/components/common/ToastComponante'
import {
  useGetRequirementQuery,
  useLazyGetRequirementsByLabelsQuery
} from '@/store/features/requirement/requirementApi'
import { useCreateSiteMutation, useDeleteSiteMutation, useGetSiteQuery } from '@/store/features/site/siteApi'
import { isRTKQueryError } from '@/utils/functions'
import { getSitesFromDB, removeSiteFromDB } from '@/utils/idbUtils'
import type { SystemMode } from '@core/types'
import { Alert, Drawer } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { escapeRegExp } from '@mui/x-data-grid/internals'
import type { ChangeEvent } from 'react'
import React, { useEffect, useRef, useState } from 'react'
import SiteDetails from './Details'
import SiteForm from './SiteForm'

const customColumns = () => [
  {
    flex: 1,
    field: 'siteNbr',
    headerName: 'Num de site',
    minWidth: 180,
    renderCell: renderTypographyCell('siteNbr')
  },
  {
    flex: 1,
    field: 'label',
    headerName: 'Libellé',
    minWidth: 180,
    renderCell: renderTypographyCell('label')
  },
  {
    flex: 1,
    field: 'siteOwner',
    headerName: 'Propriétaire',
    minWidth: 180,
    renderCell: renderTypographyCell('siteOwner')
  },
  {
    flex: 1,
    field: 'siteType',
    headerName: 'Type de site',
    minWidth: 180,
    renderCell: renderTypographyCell('siteType')
  }
]

const SiteList = ({ mode }: { mode: SystemMode }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>('')
  const [filteredData, setFilteredData] = useState<ISite[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: DEFAULT_SIZE_PER_PAGE,
    page: DEFAULT_PAGE
  })
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [siteToEdit, setSiteToEdit] = useState<ISite | null>(null)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [isProcessing, setIDBIsProcessing] = useState(false)
  const workerRef = useRef<Worker>()

  const { showAlert, showToast } = useSweetAlert()
  const { confirmDelete, showDeletToast, showUnauthorizedToast } = useToastComponante()

  const [deleteSite, { isLoading: deleteSiteIsLoading /* isError, error: deleteSiteError, isSuccess */ }] =
    useDeleteSiteMutation()
  const [createSite /* { isLoading: isCreating, isError: createError, error: createErr }*/] = useCreateSiteMutation()
  // Initialize the RTK Query hook
  const [triggerGetRequirements] = useLazyGetRequirementsByLabelsQuery()

  const processSitesFromDB = async () => {
    setIDBIsProcessing(true)
    const sites = await getSitesFromDB()

    if (!sites.length) {
      setIDBIsProcessing(false)
      return
    }
    // Extract unique labels first to minimize API calls
    const uniqueLabels = [...new Set(sites.map(a => a["Contraintes d'accÃ¨s"]))]

    try {
      // Fetch all wanted requirements in one batch
      const { data: requirements } = await triggerGetRequirements(uniqueLabels)
      const requirementeMap = new Map(requirements?.map(req => [req.label, req.id]) || [])

      for (const site of sites) {
        try {
          if (site['NumÃ©ro de site'] && site['LibellÃ©'] && site['Description'] && site["Contraintes d'accÃ¨s"]) {
            const requirementsIds = site["Contraintes d'accÃ¨s"]
              .split(',')
              .map((req: string) => requirementeMap.get(req))
              ?.filter(Boolean)

            const siteObj: any = {
              label: site['LibellÃ©'],
              siteNbr: site['NumÃ©ro de site'].toString(),
              description: site['Description'],
              requirementsIds
            }
            await createSite(siteObj)
              .unwrap()
              .then(async () => {
                await removeSiteFromDB(site.id)
              })
              .finally(async () => {
                await new Promise(resolve => setTimeout(resolve, 500))
              })
          } else {
            showToast("Le format des données n'est pas correct !", 'error')
          }
        } catch (error) {
          console.error('Error inserting site:', error)
        }
      }
    } catch (error) {
      console.error('Error fetching sites:', error)
      showToast('Erreur lors de la récupération des sites', 'error')
    } finally {
      setIDBIsProcessing(false)
    }
  }
  useEffect(() => {
    workerRef.current = new Worker(new URL('@/utils/excelWorker.ts', import.meta.url))
    workerRef.current.onmessage = async (event: any) => {
      if (event.data.status === 'success') {
        showToast(
          'Les données ont été stockées avec succès. Vous êtes libre de faire autre chose maintenant',
          'success'
        )
        processSitesFromDB()
      }
    }

    return () => {
      workerRef.current?.terminate()
    }
  }, [])

  useEffect(() => {
    processSitesFromDB() // Start processing absences from IndexedDB
  }, [createSite])

  const handleSearch = (searchValue: string) => {
    setSearchText(searchValue)
    const searchRegex = new RegExp(escapeRegExp(searchValue), 'i')
    const filteredRows = data?.data.filter((row: ISite) => {
      return Object.keys(row).some(field => {
        if (row[field as keyof ISite] !== null && row[field as keyof ISite] !== undefined) {
          return searchRegex.test(row[field as keyof ISite]!.toString())
        }
      })
    })
    if (searchValue.length) {
      setIsFiltering(true)
      setFilteredData(filteredRows ?? [])
    } else {
      setIsFiltering(false)
      setFilteredData([])
    }
  }

  const { data, error, isLoading } = useGetSiteQuery({
    page: paginationModel.page + 1,
    limit: paginationModel.pageSize
  })

  const sites = data?.data || []
  const totalItems = data?.total || 0

  const { data: requirementData, error: requirementError, isLoading: isLoadingRequirements } = useGetRequirementQuery()

  if (error) {
    const errorMessage =
      'status' in error
        ? `Error ${error.status}: ${(error.data as any)?.message || 'Unknown error'}`
        : error.message || 'An unknown error occurred'

    return (
      <Alert severity='error' sx={{ margin: '16px 0' }}>
        {errorMessage}
      </Alert>
    )
  }

  const toggleForm = () => setIsOpen(!isOpen)

  const toggleEditMode = (site: ISite) => {
    setIsEditMode(true)
    setSiteToEdit(site)
    toggleForm()
  }

  const onCloseForm = () => {
    if (isEditMode) {
      setIsEditMode(false)
      setSiteToEdit(null)
    }
    toggleForm()
  }

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDelete('ce site')

    if (confirmed) {
      try {
        await deleteSite({ siteId: id }).unwrap()
        showDeletToast('Site')
      } catch (err) {
        if (isRTKQueryError(err) && err.status === 403) {
          await showUnauthorizedToast()
        } else {
          showAlert(`Vous ne pouvez pas supprimer ce site`, `Site lie a une operation`, 'error')
        }
      }
    }
  }

  const handleDateFilter = (start: Date, end: Date) => {
    const filteredRows = data?.data.filter((row: ISite) => {
      const formattedCreatedAt = stringToDate(row?.createdAt || '')

      if (!formattedCreatedAt || isNaN(formattedCreatedAt.getTime())) {
        return false
      }

      return formattedCreatedAt >= start && formattedCreatedAt <= end
    })
    setIsFiltering(true)
    setFilteredData(filteredRows ?? [])
  }

  const clearDateFilter = () => {
    setIsFiltering(false)
    setFilteredData([])
  }

  const handleCustomAction = (site: ISite) => {
    setSiteToEdit(site)
    setIsDetailsOpen(true)
  }

  const handleImport = (file: File) => {
    if (workerRef.current) {
      workerRef.current.postMessage({ file, type: 'site' })
    }
  }

  const columns = GetColumns({
    toggleEditMode,
    deleteObject: handleDelete,
    customColumns: customColumns(),
    includeActions: true,
    customAction: 'Détails',
    handleCustomAction
  })

  const fieldHandlers = {
    createdAt: (value: string) => formatDateFR(new Date(value)),
    updatedAt: (value: string) => formatDateFR(new Date(value))
  }

  const toolbarProps = {
    value: searchText,
    clearSearch: () => handleSearch(''),
    onChange: (event: ChangeEvent<HTMLInputElement>) => handleSearch(event.target.value),
    handleChecked: () => {},
    toggleForm,
    title: 'Taches',
    checkBoxLabel: '',
    showCheckBox: false,
    showDateFilter: false,
    handleDateFilter,
    clearDateFilter,
    data: exportData(isFiltering ? filteredData : sites, customColumns(), fieldHandlers),
    showExcel: true,
    hideAddButton: false,
    handleImport: !isProcessing ? handleImport : undefined
  }

  return (
    <div className='bg-backgroundPaper p-6'>
      <div className='flex justify-between items-center'></div>
      <DataGrid
        rowHeight={35}
        loading={isLoading || deleteSiteIsLoading}
        rows={isFiltering ? filteredData : sites}
        paginationMode='server'
        rowCount={totalItems}
        localeText={{ noRowsLabel: 'Aucune donnes a afficher' }}
        columns={columns}
        slots={{ toolbar: () => <QuickSearchToolbar {...toolbarProps} /> }}
        slotProps={{
          baseButton: {
            size: 'medium',
            variant: 'outlined'
          },
          pagination: {
            labelRowsPerPage: 'Lignes par page'
          }
        }}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      {/*  Site Form */}
      {!isLoadingRequirements && !requirementError && (
        <SiteForm
          key={isEditMode ? siteToEdit?.id : 'new'}
          mode={mode}
          isOpen={isOpen}
          siteToEdit={siteToEdit}
          onClose={onCloseForm}
          isEditMode={isEditMode}
          requirements={requirementData}
        />
      )}
      {/* details drawer */}
      <Drawer open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} anchor='right'>
        <SiteDetails mode={mode} close={() => setIsDetailsOpen(false)} site={siteToEdit} />
      </Drawer>
    </div>
  )
}

export default SiteList
