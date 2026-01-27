import { Metadata } from 'next'
import ScheduleForm from './ScheduleForm'
import ScheduleForm from './ScheduleForm'

export const metadata = {
  title: 'Schedule Estimate | Domestic & Foreign Auto Body',
  description: 'Schedule an estimate for collision repair and auto body services.',
}

export default function SchedulePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <ScheduleForm />
    </div>
  )
}}
