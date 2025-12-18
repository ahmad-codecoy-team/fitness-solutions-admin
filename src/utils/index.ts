import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * merge classnames
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * check if item exists in resourcePool
 */
export const check = (item: string, resourcePool: string[]) => {
	return resourcePool.some((p) => p === item);
};

/**
 * check if any item exists in resourcePool
 */
export const checkAny = (items: string[], resourcePool: string[]) => items.some((item) => check(item, resourcePool));

/**
 * check if all items exist in resourcePool
 */
export const checkAll = (items: string[], resourcePool: string[]) => items.every((item) => check(item, resourcePool));

/**
 * join url parts
 * @example
 * urlJoin('/admin/', '/api/', '/user/') // '/admin/api/user'
 * urlJoin('/admin', 'api', 'user/')     // '/admin/api/user'
 * urlJoin('/admin/', '', '/user/')      // '/admin/user'
 */
export const urlJoin = (...parts: string[]) => {
	const result = parts
		.map((part) => {
			return part.replace(/^\/+|\/+$/g, ""); // 去除两边/
		})
		.filter(Boolean);
	return `/${result.join("/")}`;
};

// Image URL utilities
import { GLOBAL_CONFIG } from "@/global-config";

/**
 * Get full image URL by appending the base image URL
 * @param imagePath - Relative path or filename of the image
 * @returns Full URL to the image, or fallback avatar if no path provided
 */
export function getImageUrl(imagePath?: string | null): string {
	if (!imagePath) {
		return "/src/assets/images/avatars/avatar-4.png"; // Default fallback avatar
	}
	
	// If already a full URL, return as is
	if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
		return imagePath;
	}
	
	// Append base URL to relative path
	const baseUrl = GLOBAL_CONFIG.imageBaseUrl;
	const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
	return `${baseUrl}${cleanPath}`;
}
