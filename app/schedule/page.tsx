import { Metadata } from 'next'
import ScheduleForm from './ScheduleForm'

export const metadata: Metadata = {
  title: 'Schedule Free Estimate | Auto Body Repair Appointment Cleveland',
  description: 'Schedule a free estimate for auto body repair in Cleveland, OH. Quick and easy online appointment booking. Expert collision repair, paintless dent repair, and more. Call (216) 481-8696.',
  keywords: [
    'schedule auto body repair',
    'free estimate Cleveland',
    'collision repair appointment',
    'auto body appointment',
    'Cleveland body shop appointment',
  ],
  openGraph: {
    title: 'Schedule Free Estimate | Domestic and Foreign Auto Body',
    description: 'Book your free auto body repair estimate online. Fast, convenient scheduling.',
    url: 'https://clevelandbody.com/schedule',
  },
}

export default function SchedulePage() {
  return <ScheduleForm />
}
