'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { api } from '@/lib/api-client';

interface FormData {
  email: string;
  password: string;
  name: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
}

export function RegisterWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    name: '',
  });

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'L\'email est requis';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Format d\'email invalide';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Le mot de passe est requis';
    if (password.length < 8) return 'Le mot de passe doit contenir au moins 8 caractères';
    return undefined;
  };

  const handleNext = () => {
    const newErrors: FormErrors = {};
    
    if (step === 1) {
      const emailError = validateEmail(formData.email);
      if (emailError) {
        newErrors.email = emailError;
      }
    } else if (step === 2) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStep(step + 1);
  };

  const handleBack = () => {
    setErrors({});
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    try {
      const response = await api.register({
        email: formData.email,
        password: formData.password,
        name: formData.name || undefined,
      });

      if (response.success) {
        router.push('/dashboard');
      } else {
        setErrors({ email: response.error || 'Une erreur est survenue' });
      }
    } catch (err) {
      setErrors({ email: err instanceof Error ? err.message : 'Une erreur est survenue' });
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="w-full">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              s === step
                ? 'bg-black'
                : s < step
                ? 'bg-gray-400'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Créer votre compte</h2>
            <p className="text-gray-500 mt-1">Commencez par votre adresse email</p>
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

          <Button onClick={handleNext}>
            Continuer
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Choisir un mot de passe</h2>
            <p className="text-gray-500 mt-1"> minimum 8 caractères</p>
          </div>

          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => updateField('password', e.target.value)}
            error={errors.password}
            autoFocus
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleBack}>
              Retour
            </Button>
            <Button onClick={handleNext}>
              Continuer
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Qui êtes-vous ?</h2>
            <p className="text-gray-500 mt-1">Vous pouvez ajouter votre nom (optionnel)</p>
          </div>

          <Input
            label="Nom"
            type="text"
            placeholder="Votre nom"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            error={errors.name}
            autoFocus
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleBack}>
              Retour
            </Button>
            <Button onClick={handleSubmit} loading={loading}>
              Créer mon compte
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterWizard;
