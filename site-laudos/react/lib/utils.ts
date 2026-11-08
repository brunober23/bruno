import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utilitário padrão do shadcn/ui: junta classes condicionais e resolve conflitos do Tailwind.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
