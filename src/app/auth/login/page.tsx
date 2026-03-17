import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Se connecter | Decide',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Card>
        <LoginForm />
        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <a href="/auth/register" className="text-black font-medium hover:underline">
            Créer un compte
          </a>
        </p>
      </Card>
    </div>
  );
}
