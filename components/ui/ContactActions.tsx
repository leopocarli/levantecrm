'use client';

import { MessageCircle, Phone, Mail } from 'lucide-react';
import { toWhatsAppPhone, normalizePhoneE164 } from '@/lib/phone';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils/cn';

interface ContactActionsProps {
  phone?: string;
  email?: string;
  contactName?: string;
  size?: 'sm' | 'md';
  className?: string;
}

const iconSize = { sm: 14, md: 16 } as const;

export function ContactActions({
  phone,
  email,
  contactName,
  size = 'md',
  className,
}: ContactActionsProps) {
  const waPhone = toWhatsAppPhone(phone);
  const e164 = normalizePhoneE164(phone);
  const hasPhone = !!waPhone;
  const hasEmail = !!email;
  const isSm = size === 'sm';
  const iconPx = iconSize[size];

  const label = contactName || 'contato';

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn('flex items-center gap-1', className)}
        onClick={(e) => e.stopPropagation()}
      >
        {/* WhatsApp */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              disabled={!hasPhone}
              aria-label={`Enviar WhatsApp para ${label}`}
              onClick={() => window.open(`https://wa.me/${waPhone}`, '_blank', 'noopener')}
              className={cn(
                'rounded-md transition-colors flex items-center gap-1.5',
                'text-slate-500 hover:text-green-500 hover:bg-green-500/10',
                'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-500',
                isSm ? 'p-1.5' : 'px-2.5 py-1.5 text-xs font-medium',
              )}
            >
              <MessageCircle size={iconPx} />
              {!isSm && <span>WhatsApp</span>}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {hasPhone ? `WhatsApp: ${phone}` : 'Sem telefone'}
          </TooltipContent>
        </Tooltip>

        {/* Telefone */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              disabled={!hasPhone}
              aria-label={`Ligar para ${label}`}
              onClick={() => window.open(`tel:${e164}`, '_self')}
              className={cn(
                'rounded-md transition-colors flex items-center gap-1.5',
                'text-slate-500 hover:text-blue-500 hover:bg-blue-500/10',
                'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-500',
                isSm ? 'p-1.5' : 'px-2.5 py-1.5 text-xs font-medium',
              )}
            >
              <Phone size={iconPx} />
              {!isSm && <span>Ligar</span>}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {hasPhone ? `Ligar: ${phone}` : 'Sem telefone'}
          </TooltipContent>
        </Tooltip>

        {/* Email */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              disabled={!hasEmail}
              aria-label={`Enviar email para ${label}`}
              onClick={() => window.open(`mailto:${email}`, '_self')}
              className={cn(
                'rounded-md transition-colors flex items-center gap-1.5',
                'text-slate-500 hover:text-cyan-500 hover:bg-cyan-500/10',
                'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-slate-500',
                isSm ? 'p-1.5' : 'px-2.5 py-1.5 text-xs font-medium',
              )}
            >
              <Mail size={iconPx} />
              {!isSm && <span>Email</span>}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {hasEmail ? `Email: ${email}` : 'Sem email'}
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
