import { redirect } from 'next/navigation'

export default function HomePage() {
  redirect('/login')
  
  // This won't be rendered since we're redirecting
  return null
}
