import { Metadata } from 'next'
import TowRequestForm from './TowRequestForm'

export const metadata: Metadata = {
  title: 'Request Tow Service | 24/7 Auto Towing Cleveland',
  description: 'Need a tow? Request emergency towing service in Cleveland, OH. Fast, reliable auto towing and transportation to our shop.',
  openGraph: {
    title: 'Request Tow Service | Domestic and Foreign Auto Body',
    description: 'Emergency auto towing service in Cleveland. Fast response, professional care.',
  },
}

export default function TowRequestPage() {
  return <TowRequestForm />
}
