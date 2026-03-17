import { Metadata } from 'next';
import RegisterWizard from '@/components/auth/RegisterWizard';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Créer un compte | Decide',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Card>
        <RegisterWizard />
        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <a href="/auth/login" className="text-black font-medium hover:underline">
            Se connecter
          </a>
        </p>
      </Card>
    </div>
  );
}
