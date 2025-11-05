'use client'

import { useTheme } from '@mui/material/styles'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function useSweetAlert() {
  const theme = useTheme()
  const isDarkMode = theme.palette.mode === 'dark'

  const customStyles = {
    background: isDarkMode ? theme.palette.background.default : '#fff',
    color: isDarkMode ? theme.palette.text.primary : '#000',
    confirmButtonColor: theme.palette.primary.main,
    cancelButtonColor: theme.palette.error.main
  }

  const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info') => {
    MySwal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK',
      ...customStyles
    })
  }

  const showConfirm = async (title: string, text: string, confirmText = 'Yes', cancelText = 'Cancel') => {
    const result = await MySwal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      ...customStyles
    })

    return result.isConfirmed
  }

  const showToast = (title: string, icon: 'success' | 'error' | 'warning' | 'info') => {
    MySwal.fire({
      title,
      icon,
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      ...customStyles
    })
  }

  const showConfirmWithCheckbox = async (
    title: string,
    checkboxLabel: string,
    confirmText = 'Supprimer',
    cancelText = 'Annuler'
  ) => {
    const result = await Swal.fire({
      title,
      icon: 'warning',
      input: 'checkbox',
      inputValue: 0,
      inputPlaceholder: checkboxLabel,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      ...customStyles
    })

    return {
      isConfirmed: result.isConfirmed,
      checkboxChecked: result.value === 1
    }
  }

  return { showAlert, showConfirm, showToast, showConfirmWithCheckbox }
}
