import { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us | Domestic and Foreign Auto Body Cleveland',
  description: 'Contact Domestic and Foreign Auto Body in Cleveland, OH. Call (216) 481-8696 or visit us at 17017 Saint Clair Ave. Free estimates available.',
  openGraph: {
    title: 'Contact Us | Domestic and Foreign Auto Body',
    description: 'Get in touch with Cleveland\'s premier auto body shop. Free estimates.',
  },
}

export default function ContactPage() {
  return <ContactForm />
}