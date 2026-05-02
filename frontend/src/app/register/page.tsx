'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { AuthForm, AuthLayoutLink } from '@/components/forms/AuthForm';
import { Container } from '@/components/ui/Container';
import { useToast } from '@/components/ui/Toast';
import { formatApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { login, register } from '@/services/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const { notify } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-12">
      <AuthForm
        title="Create your account"
        subtitle="Start tracking tokens in seconds."
        submitLabel="Create account"
        isSubmitting={isSubmitting}
        errorMessage={errorMessage}
        onSubmit={async (values) => {
          setIsSubmitting(true);
          setErrorMessage(null);
          try {
            await register(values);
            const session = await login(values);
            signIn(session.accessToken, session.user);
            notify('Account created — welcome!', 'success');
            router.push('/dashboard/watchlist');
          } catch (error) {
            setErrorMessage(formatApiError(error));
          } finally {
            setIsSubmitting(false);
          }
        }}
        footer={
          <>
            Already have an account?{' '}
            <AuthLayoutLink href="/login">Sign in</AuthLayoutLink>.
          </>
        }
      />
    </Container>
  );
}
