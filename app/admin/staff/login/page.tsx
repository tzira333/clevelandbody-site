import StaffAuthCheck from './StaffAuthCheck';
import StaffDashboard from './StaffDashboard';

export const metadata = {
  title: 'Staff Dashboard | Domestic and Foreign Auto Body Inc.',
  description: 'Manage appointments and customer requests',
};

export default function StaffPage() {
  return (
    <StaffAuthCheck>
      <StaffDashboard />
    </StaffAuthCheck>
  );
}
