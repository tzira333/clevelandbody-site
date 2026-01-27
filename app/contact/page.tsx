import { Metadata } from 'next'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us | Domestic and Foreign Auto Body Cleveland OH',
  description: 'Contact Domestic and Foreign Auto Body in Cleveland, OH. Call (216) 481-8696 or visit us at 17017 Saint Clair Ave. Free estimates available. Mon-Fri 8AM-4:30PM.',
  keywords: [
    'contact auto body shop Cleveland',
    'Cleveland body shop phone',
    'auto repair Cleveland contact',
    '17017 Saint Clair Ave',
    'Cleveland OH 44110',
  ],
  openGraph: {
    title: 'Contact Us | Domestic and Foreign Auto Body',
    description: 'Get in touch with Cleveland\'s premier auto body shop. Free estimates.',
    url: 'https://clevelandbody.com/contact',
  },
}

export default function ContactPage() {
  return <ContactForm />
}
