/**
 * API Configuration
 * Centralized configuration for all API endpoints
 */

const env = import.meta.env;

export const API_CONFIG = {
	BASE_URL: env.VITE_API_URL || "http://194.195.92.92/kampanyes-backend/api/v1",
	DEV_URL: env.VITE_DEV_API_URL || "http://localhost:9876/api/v1",
	FILE_STORAGE_URL: env.VITE_FILE_URL || "http://194.195.92.92/kampanyes-backend/uploads",
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
		SIGNUP: "/user/sign-up",
		GOOGLE_LOGIN: "/auth/google-login",
		FORGOT_PASSWORD: "/auth/forgot-password",
		VERIFY_OTP: "/auth/verify-otp",
		RESET_PASSWORD: "/auth/reset-password",
		CHANGE_PASSWORD: "/auth/change-password",
	},

	USER: {
		UPDATE_PROFILE: "/user/update-profile",
		DELETE_USER: (id: string) => `/user/${id}`,
		GET_USER_BY_ID: (id: string) => `/user/${id}`,
		TOGGLE_STATUS: (id: string) => `/user/toggle/status/${id}`,
		LIST: "/user/",
	},

	UPLOADS: {
		IMAGE_UPLOAD: "/uploads/image",
		DOCUMENT_UPLOAD: "/uploads/document/file",
		DELETE_IMAGE: "/uploads/delete/image",
		DELETE_FILE: "/uploads/delete",
	},

	STORES: {
		CREATE: "/store/create",
		LIST: "/store/",
		GET_BY_ID: (id: string) => `/store/${id}`,
		UPDATE: (id: string) => `/store/${id}`,
		DELETE: (id: string) => `/store/${id}`,
	},

	CATEGORIES: {
		CREATE: "/category/",
		LIST: "/category/",
		GET_BY_ID: (id: string) => `/category/${id}`,
		UPDATE: (id: string) => `/category/${id}`,
		DELETE: (id: string) => `/category/${id}`,
	},

	FOLDERS: {
		CREATE: "/folder/",
		UPDATE: (id: string) => `/folder/${id}`,
		GET_BY_ID: (id: string) => `/folder/${id}`,
		LIST: "/folder/",
	},

	FLYERS: {
		CREATE: "/flyer/",
		UPDATE: (id: string) => `/flyer/${id}`,
		GET_BY_ID: (id: string) => `/flyer/${id}`,
		DELETE: (id: string) => `/flyer/${id}`,
		LIST_BY_FOLDER: (folderId: string) => `/flyer/by/folder/${folderId}`,
	},

	FAVORITE: {
		TOGGLE: "/favorite/",
		LIST: "/favorite/",
	},

	STATS: {
		OVERVIEW: "/stats",
	},

	TERMS: {
		GET: "/termAndCondition",
		CREATE: "/termAndCondition",
		UPDATE: "/termAndCondition",
	},

	PRIVACY_POLICY: {
		GET: "/privacyPolicy",
		CREATE: "/privacyPolicy",
		UPDATE: "/privacyPolicy",
	},

	APP_SETTINGS: {
		GET: "/appSetting",
		UPDATE: (id: string) => `/appSetting/${id}`,
	},
};
