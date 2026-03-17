import { Metadata } from 'next';
import { Suspense } from 'react';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import Card from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'Réinitialiser le mot de passe | Decide',
};

function ResetPasswordFormLoader() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Chargement...</h2>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Card>
        <Suspense fallback={<ResetPasswordFormLoader />}>
          <ResetPasswordForm />
        </Suspense>
      </Card>
    </div>
  );
}
