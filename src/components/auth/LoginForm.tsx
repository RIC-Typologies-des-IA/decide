'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { api } from '@/lib/api-client';

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await api.login({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        router.push('/dashboard');
      } else {
        if (response.error?.includes('email')) {
          setErrors({ email: response.error });
        } else if (response.error?.includes('mot de passe') || response.error?.includes('password')) {
          setErrors({ password: response.error });
        } else {
          setErrors({ password: response.error || 'Email ou mot de passe incorrect' });
        }
      }
    } catch (err) {
      setErrors({ password: err instanceof Error ? err.message : 'Une erreur est survenue' });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Se connecter</h2>
        <p className="text-gray-500 mt-1">Bienvenue retour</p>
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="vous@exemple.com"
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
        error={errors.email}
        autoFocus
      />

      <Input
        label="Mot de passe"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => updateField('password', e.target.value)}
        error={errors.password}
      />

      <div className="text-right">
        <a
          href="/auth/reset-password"
          className="text-sm text-gray-500 hover:text-black transition-colors"
        >
          Mot de passe oublié ?
        </a>
      </div>

      <Button type="submit" loading={loading}>
        Se connecter
      </Button>
    </form>
  );
}

export default LoginForm;
