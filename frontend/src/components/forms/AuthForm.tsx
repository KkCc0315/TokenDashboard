'use client';

import Link from 'next/link';
import { FormEvent, ReactNode, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

export interface AuthFormValues {
  email: string;
  password: string;
}

interface AuthFormProps {
  title: string;
  subtitle: string;
  submitLabel: string;
  onSubmit: (values: AuthFormValues) => Promise<void>;
  footer?: ReactNode;
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

interface Errors {
  email?: string;
  password?: string;
}

function validate({ email, password }: AuthFormValues): Errors {
  const errors: Errors = {};
  if (!email.trim()) errors.email = 'Email is required.';
  else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address.';
  if (!password) errors.password = 'Password is required.';
  else if (password.length < 8) errors.password = 'Password must be at least 8 characters.';
  return errors;
}

export function AuthForm({
  title,
  subtitle,
  submitLabel,
  onSubmit,
  footer,
  isSubmitting,
  errorMessage,
}: AuthFormProps) {
  const [values, setValues] = useState<AuthFormValues>({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;
    await onSubmit(values);
  };

  return (
    <Card className="w-full max-w-md">
      <CardBody className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold text-text">{title}</h1>
          <p className="text-sm text-text-muted">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            error={errors.email}
            onChange={(event) =>
              setValues((current) => ({ ...current, email: event.target.value }))
            }
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={values.password}
            error={errors.password}
            hint="Minimum 8 characters."
            onChange={(event) =>
              setValues((current) => ({ ...current, password: event.target.value }))
            }
          />

          {errorMessage && (
            <p className="rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
              {errorMessage}
            </p>
          )}

          <Button type="submit" isLoading={isSubmitting} size="lg">
            {submitLabel}
          </Button>
        </form>

        {footer && <div className="text-sm text-text-muted">{footer}</div>}
      </CardBody>
    </Card>
  );
}

export function AuthLayoutLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="font-medium text-brand hover:text-brand-hover">
      {children}
    </Link>
  );
}
