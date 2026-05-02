import { Container } from '@/components/ui/Container';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border-subtle py-8">
      <Container className="flex flex-col items-center justify-between gap-3 text-xs text-text-muted sm:flex-row">
        <span>TokenDashboard — portfolio project</span>
        <span>Powered by your Token API</span>
      </Container>
    </footer>
  );
}
