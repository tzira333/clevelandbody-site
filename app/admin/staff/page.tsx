import { Metadata } from 'next'
import StaffDashboard from './StaffDashboard'

export const metadata: Metadata = {
  title: 'Staff Dashboard | Domestic and Foreign Auto Body Inc.',
  description: 'Manage appointments, view requests, and update customer information',
}

export default function StaffDashboardPage() {
  return <StaffDashboard />
}
