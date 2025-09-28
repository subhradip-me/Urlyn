import { redirect } from 'next/navigation';
import { LandingPage } from '@/modules/shared/components/LandingPage';

export default function HomePage() {
  // This will be the public landing page
  return <LandingPage />;
}
