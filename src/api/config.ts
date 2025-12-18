/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

const env = import.meta.env;

export const API_CONFIG = {
	BASE_URL: env.VITE_API_URL || "http://localhost:3000/api/v1",
	DEV_URL: env.VITE_DEV_API_URL || "http://localhost:3000/api/v1",
	FILE_STORAGE_URL: env.VITE_FILE_URL || "http://localhost:3000/uploads",
	TIMEOUT: 55000,
	HEADERS: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	ENV: env.VITE_NODE_ENV || "development",
};

/* -------------------------------------------------
   API ENDPOINTS
-------------------------------------------------- */

export const ENDPOINTS = {
	AUTH: {
		LOGIN: "/auth/login",
		FORGOT_PASSWORD: "/auth/forgot-password",
		RESET_PASSWORD: "/auth/reset-password",
		CHANGE_PASSWORD: "/auth/change-password",
	},

	TRAINERS: {
		LIST: "/trainers",
		GET_BY_ID: (id: string) => `/trainers/${id}`,
		UPDATE: (id: string) => `/trainers/${id}`,
		TOGGLE_STATUS: (id: string) => `/trainers/${id}/status`,
	},

	TRAINEES: {
		LIST: "/trainees",
		CREATE: "/trainees",
		GET_BY_ID: (id: string) => `/trainees/${id}`,
		UPDATE: (id: string) => `/trainees/${id}`,
		BY_TRAINER: (trainerId: string) => `/trainers/${trainerId}/trainees`,
	},

	NOTIFICATIONS: {
		LIST: "/notifications",
		CREATE: "/notifications",
		GET_BY_ID: (id: string) => `/notifications/${id}`,
		UPDATE: (id: string) => `/notifications/${id}`,
		DELETE: (id: string) => `/notifications/${id}`,
	},

	UPLOADS: {
		IMAGE_UPLOAD: "/uploads/image",
		DELETE_IMAGE: "/uploads/delete/image",
	},

	DASHBOARD: {
		STATS: "/dashboard/stats",
	},

	LEGAL: {
		TERMS_GET: "/legal/terms",
		TERMS_UPDATE: "/legal/terms",
		PRIVACY_GET: "/legal/privacy",
		PRIVACY_UPDATE: "/legal/privacy",
	},
};
