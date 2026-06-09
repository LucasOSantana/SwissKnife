import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { toast } from "sonner"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function copyToClipboard(text: string, successMessage = "Copied to clipboard!") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
    return true;
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    toast.error("Unable to copy to clipboard.");
    return false;
  }
}
