import Guard from '@/components/layout/Guard/Guard';
import OnboardingPage from '@/screens/Onboarding/OnboardingPage';

export const metadata = { title: 'Bienvenida' };

export default function Page() {
  return <Guard need="auth"><OnboardingPage /></Guard>;
}
