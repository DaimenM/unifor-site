import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripMarkdown(markdown: string): string {
  return markdown
    // Remove headers
    .replace(/#{1,6}\s/g, '')
    // Remove bold/italic
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')
    // Remove links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove code blocks
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    // Remove lists
    .replace(/^[\s-]*[-+*]\s+/gm, '')
    // Remove blockquotes
    .replace(/^\s*>\s*/gm, '')
    // Remove horizontal rules
    .replace(/^[\s-]*[-*_]{3,}[\s-]*$/gm, '')
    // Remove images
    .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    .trim();
}
