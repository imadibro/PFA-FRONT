// Next Imports
import type { Metadata } from 'next'

// Component Imports
import Register from '@views/Register'

export const metadata: Metadata = {
  title: "S'inscrire",
  description: 'Créez votre compte'
}

const RegisterPage = () => {
  return <Register />
}

export default RegisterPage
