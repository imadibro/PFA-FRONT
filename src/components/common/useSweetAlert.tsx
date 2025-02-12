'use client'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export default function useSweetAlert() {
  const showAlert = (title: string, text: string, icon: 'success' | 'error' | 'warning' | 'info') => {
    MySwal.fire({
      title,
      text,
      icon,
      confirmButtonText: 'OK'
    })
  }

  const showConfirm = async (title: string, text: string, confirmText = 'Yes', cancelText = 'Cancel') => {
    const result = await MySwal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      confirmButtonColor: 'red',
      cancelButtonText: cancelText
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
      timerProgressBar: true
    })
  }

  return { showAlert, showConfirm, showToast }
}
