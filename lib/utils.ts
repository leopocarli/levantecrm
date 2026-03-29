import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Função pública `cn` do projeto.
 *
 * @param {ClassValue[]} inputs - Parâmetro `inputs`.
 * @returns {string} Retorna um valor do tipo `string`.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/** Remove acentos de uma string para busca accent-insensitive. */
export function stripAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

// ── Formatação de Moeda (BRL) ──────────────────────────────────────

const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})

/** Formata valor como moeda brasileira: R$ 1.500,00 */
export function formatCurrencyBRL(value: number): string {
    return BRL_FORMATTER.format(value)
}

/** Formata valor compacto para cards/charts: R$ 1,5M / R$ 997k / R$ 500 */
export function formatCurrencyCompact(value: number): string {
    if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}M`
    if (value >= 1_000) return `R$ ${(value / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}k`
    return BRL_FORMATTER.format(value)
}

/**
 * Formata string enquanto o usuário digita em campo monetário.
 * Ex: "1500" → "1.500,00", "29990" → "29.990,00", "" → ""
 */
export function formatInputCurrency(raw: string): string {
    const digits = raw.replace(/\D/g, '')
    if (!digits) return ''
    const cents = parseInt(digits, 10)
    return (cents / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

/** Converte valor formatado "1.500,00" de volta para number 1500. */
export function parseCurrencyInput(formatted: string): number {
    if (!formatted) return 0
    const cleaned = formatted.replace(/\./g, '').replace(',', '.')
    return parseFloat(cleaned) || 0
}
