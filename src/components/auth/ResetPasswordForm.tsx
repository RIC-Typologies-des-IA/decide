'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { api } from '@/lib/api-client';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (token) {
      setIsConfirmMode(true);
    }
  }, [token]);

  const validateEmail = (): boolean => {
    if (!email) {
      setErrors({ email: 'L\'email est requis' });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: 'Format d\'email invalide' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validatePassword = (): boolean => {
    if (!password) {
      setErrors({ password: 'Le mot de passe est requis' });
      return false;
    }
    if (password.length < 8) {
      setErrors({ password: 'Le mot de passe doit contenir au moins 8 caractères' });
      return false;
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail()) return;

    setLoading(true);
    try {
      await api.requestReset(email);
      setSuccess(true);
    } catch {
      setSuccess(true); // Always show success to not reveal email existence
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await api.confirmReset(token!, password);
      
      if (response.success) {
        router.push('/auth/login?reset=success');
      } else {
        setErrors({ password: response.error || 'Une erreur est survenue' });
      }
    } catch (err) {
      setErrors({ password: err instanceof Error ? err.message : 'Une erreur est survenue' });
    } finally {
      setLoading(false);
    }
  };

  // Success state for request mode
  if (success && !isConfirmMode) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Email envoyé</h2>
          <p className="text-gray-500 mt-2">
            Si cet email existe, vous recevrez un lien de réinitialisation
          </p>
        </div>
        <a href="/auth/login" className="block text-center text-black font-medium hover:underline">
          Retour à la connexion
        </a>
      </div>
    );
  }

  if (isConfirmMode) {
    return (
      <form onSubmit={handleConfirmSubmit} className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Nouveau mot de passe</h2>
          <p className="text-gray-500 mt-1">Choisissez un nouveau mot de passe</p>
        </div>

        <Input
          label="Nouveau mot de passe"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          error={errors.password}
          autoFocus
        />

        <Input
          label="Confirmer le mot de passe"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          error={errors.confirmPassword}
        />

        <Button type="submit" loading={loading}>
          Réinitialiser le mot de passe
        </Button>

        <a href="/auth/login" className="block text-center text-sm text-gray-500 hover:text-black">
          Annuler
        </a>
      </form>
    );
  }

  // Request mode
  return (
    <form onSubmit={handleRequestSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Mot de passe oublié</h2>
        <p className="text-gray-500 mt-1">Entrez votre email pour réinitialiser</p>
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="vous@exemple.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        error={errors.email}
        autoFocus
      />

      <Button type="submit" loading={loading}>
        Envoyer le lien
      </Button>

      <div className="text-center space-y-2">
        <a href="/auth/login" className="block text-sm text-gray-500 hover:text-black">
          Retour à la connexion
        </a>
        <a href="/auth/register" className="block text-sm text-gray-500 hover:text-black">
          Pas encore de compte ? Créer un compte
        </a>
      </div>
    </form>
  );
}

export default ResetPasswordForm;
