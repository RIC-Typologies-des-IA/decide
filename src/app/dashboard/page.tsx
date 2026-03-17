'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Card>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Tableau de bord</h1>
            <p className="text-gray-500 mt-2">Connecté en tant que</p>
            <p className="font-medium text-gray-900 mt-1">{user.email}</p>
            {user.name && (
              <p className="text-sm text-gray-500">{user.name}</p>
            )}
          </div>

          <Button variant="secondary" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </div>
      </Card>
    </div>
  );
}
