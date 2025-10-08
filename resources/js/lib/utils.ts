import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function asset(path: string) {
    return 'https://apems.sgp1.digitaloceanspaces.com/' + path;
}