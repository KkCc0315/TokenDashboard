'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

import { AuthForm, AuthLayoutLink } from '@/components/forms/AuthForm';
import { Container } from '@/components/ui/Container';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';
import { formatApiError } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { login } from '@/services/auth';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { signIn } = useAuth();
  const { notify } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const next = params.get('next') ?? '/dashboard/watchlist';

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Sign in to manage your watchlist."
      submitLabel="Sign in"
      isSubmitting={isSubmitting}
      errorMessage={errorMessage}
      onSubmit={async (values) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
          const response = await login(values);
          signIn(response.accessToken, response.user);
          notify('Signed in.', 'success');
          router.push(next);
        } catch (error) {
          setErrorMessage(formatApiError(error));
        } finally {
          setIsSubmitting(false);
        }
      }}
      footer={
        <>
          New here? <AuthLayoutLink href="/register">Create an account</AuthLayoutLink>.
        </>
      }
    />
  );
}

export default function LoginPage() {
  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-12">
      <Suspense fallback={<Spinner size={28} />}>
        <LoginInner />
      </Suspense>
    </Container>
  );
}
