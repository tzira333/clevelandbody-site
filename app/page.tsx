<div className="p-8 bg-primary text-white text-3xl">
  Tailwind is working (should be maroon background)
</div>
  
import Link from 'next/link'
import Hero from '@/components/home/Hero'
import Services from '@/components/home/Services'
import WhyChooseUs from '@/components/home/WhyChooseUs'
import CTASection from '@/components/home/CTASection'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <WhyChooseUs />
      <CTASection />
    </>
  )
}
