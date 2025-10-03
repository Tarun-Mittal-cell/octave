import dynamic from 'next/dynamic'

const Hero = dynamic(() => import('./components/Hero'), {
  ssr: false,
})

export const dynamicParams = false

export default function Home() {
  return <Hero />
}
