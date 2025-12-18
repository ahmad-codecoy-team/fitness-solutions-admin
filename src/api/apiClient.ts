import { GLOBAL_CONFIG } from "@/global-config";
import { t } from "@/locales/i18n";
import userStore from "@/store/userStore";
import axios, { type AxiosRequestConfig, type AxiosError, type AxiosResponse } from "axios";
import { toast } from "sonner";
import type { Result } from "#/api";
import { ResultStatus } from "#/enum";

const axiosInstance = axios.create({
	baseURL: GLOBAL_CONFIG.apiBaseUrl,
	timeout: 50000,
	headers: {
		"Content-Type": "application/json;charset=utf-8",
		"ngrok-skip-browser-warning": "true", // Skip ngrok browser warning page
	},
});

axiosInstance.interceptors.request.use(
	(config) => {
		// Add request logging for debugging
		console.log("🔵 API Request Debug:", {
			url: config.url,
			method: config.method?.toUpperCase(),
			baseURL: config.baseURL,
			fullURL: `${config.baseURL}${config.url}`,
			headers: config.headers,
			data: config.data,
		});

		const { userToken } = userStore.getState();
		if (userToken.accessToken) {
			config.headers.Authorization = `Bearer ${userToken.accessToken}`;
			console.log("✅ Authorization header added");
		} else {
			console.log("⚠️ No access token found");
		}

		// Ensure ngrok header is always present
		config.headers["ngrok-skip-browser-warning"] = "true";

		return config;
	},
	(error) => {
		console.error("🔴 Request interceptor error:", error);
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(res: AxiosResponse<any>) => {
		// Handle 204 No Content responses (successful but no data)
		if (res.status === 204) {
			console.log("✅ 204 No Content - returning empty array");
			return [];
		}

		// Handle responses with no data but successful status codes
		if (!res.data && res.status >= 200 && res.status < 300) {
			console.log("✅ Success with no data - returning empty array");
			return [];
		}

		// If no data and not a success status, throw error
		if (!res.data) {
			console.error("❌ No data in response:", res);
			throw new Error(t("sys.api.apiRequestFailed"));
		}

		// Handle upload response: { image: "filename.jpg" }
		if (res.data.image) {
			console.log("✅ Upload response detected");
			return res.data;
		}

		// CRITICAL: Handle paginated response format FIRST: { data: [...], meta: {...} }
		// This must be checked BEFORE the generic { data: {...} } check
		if (res.data.data !== undefined && res.data.meta !== undefined) {
			console.log("✅ Paginated response detected, returning full response with data and meta");
			return res.data; // Return the entire response object { data, meta }
		}

		// Handle backend response format: { data: {...} } without meta
		if (res.data.data !== undefined) {
			console.log("✅ Backend wrapper format detected, extracting data");
			return res.data.data;
		}

		// Handle direct array responses (like store list)
		if (Array.isArray(res.data)) {
			console.log("✅ Direct array response detected");
			return res.data;
		}

		// Handle legacy mock format: { status, data, message }
		const { status, data, message } = res.data;
		if (status === ResultStatus.SUCCESS) {
			console.log("✅ Legacy mock format detected, extracting data");
			return data;
		}

		// Handle HTML responses (likely ngrok warning page or server errors)
		if (typeof res.data === "string" && res.data.includes("<!DOCTYPE html>")) {
			console.error("❌ Received HTML instead of JSON - likely ngrok warning page or server error");
			// console.error("Full HTML response:", res.data.substring(0, 500) + "...");

			// Check if it's ngrok warning page
			if (res.data.includes("ngrok.com") || res.data.includes("ERR_NGROK")) {
				throw new Error(
					"ngrok tunnel requires verification. Please visit the URL directly in your browser first, or add 'ngrok-skip-browser-warning' header.",
				);
			}

			throw new Error("Server returned HTML instead of JSON. Check if your backend API is running correctly.");
		}

		// If we get here, the response format is unexpected
		console.error("❌ Unexpected response format:", res.data);
		throw new Error(message || t("sys.api.apiRequestFailed"));
	},
	(error: AxiosError<Result>) => {
		// Enhanced error logging
		console.error("🔴 API Error Debug:", {
			url: error.config?.url,
			method: error.config?.method?.toUpperCase(),
			status: error.response?.status,
			statusText: error.response?.statusText,
			data: error.response?.data,
			message: error.message,
			stack: error.stack,
		});

		const { response, message } = error || {};
		const errMsg = response?.data?.message || message || t("sys.api.errorMessage");
		toast.error(errMsg, { position: "top-center" });
		if (response?.status === 401) {
			userStore.getState().actions.clearUserInfoAndToken();
		}
		return Promise.reject(error);
	},
);

class APIClient {
	get<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "GET" });
	}
	post<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "POST" });
	}
	put<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "PUT" });
	}
	patch<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "PATCH" });
	}
	delete<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "DELETE" });
	}
	// request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
	// 	return axiosInstance.request<any, T>(config);
	// }
	request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		const isFormData = config.data instanceof FormData;

		// Ensure proper JSON serialization for nested objects
		if (config.data && !isFormData && typeof config.data === "object") {
			config.data = JSON.parse(JSON.stringify(config.data));
		}

		return axiosInstance.request<any, T>(config);
	}
}

export default new APIClient();
