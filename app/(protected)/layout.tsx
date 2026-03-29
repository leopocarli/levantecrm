'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { QueryProvider } from '@/lib/query'
import { ToastProvider } from '@/context/ToastContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { CRMProvider } from '@/context/CRMContext'
import { AIProvider } from '@/context/AIContext'
import Layout from '@/components/Layout'
import { useConsent } from '@/hooks/useConsent'
import { ConsentModal } from '@/components/ConsentModal'
import { useIdleTimeout } from '@/hooks/useIdleTimeout'
import { useToast } from '@/context/ToastContext'

/**
 * Inner shell that runs hooks requiring providers (Toast, Auth, etc).
 */
function AppShellGuard({ children }: { children: React.ReactNode }) {
    const { shouldShowConsentModal, missingConsents, giveConsents } = useConsent();
    const { addToast } = useToast();

    useIdleTimeout({
        onWarning: () => addToast('Sua sessão expira em 5 minutos por inatividade.', 'warning'),
        onTimeout: () => addToast('Sessão encerrada por inatividade.', 'info'),
    });

    // Listen for PWA update available
    useEffect(() => {
        const handler = () => addToast('Nova versão disponível! Recarregue a página para atualizar.', 'info');
        window.addEventListener('sw-update-available', handler);
        return () => window.removeEventListener('sw-update-available', handler);
    }, [addToast]);

    return (
        <>
            <ConsentModal
                isOpen={shouldShowConsentModal}
                missingConsents={missingConsents}
                onAccept={async (types) => { await giveConsents(types); }}
            />
            {children}
        </>
    );
}

/**
 * Componente React `ProtectedLayout`.
 */
export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isSetupRoute = pathname === '/setup'
    const isLabsRoute = pathname === '/labs' || pathname.startsWith('/labs/')
    const shouldUseAppShell = !isSetupRoute && !isLabsRoute

    return (
        <QueryProvider>
            <ToastProvider>
                <ThemeProvider>
                    <AuthProvider>
                        <CRMProvider>
                            <AIProvider>
                                <AppShellGuard>
                                    {shouldUseAppShell ? <Layout>{children}</Layout> : children}
                                </AppShellGuard>
                            </AIProvider>
                        </CRMProvider>
                    </AuthProvider>
                </ThemeProvider>
            </ToastProvider>
        </QueryProvider>
    )
}

