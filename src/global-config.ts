import packageJson from "../package.json";

/**
 * Global application configuration type definition
 */
export type GlobalConfig = {
	/** Application name */
	appName: string;
	/** Application version number */
	appVersion: string;
	/** Default route path for the application */
	defaultRoute: string;
	/** Public path for static assets */
	publicPath: string;
	/** Base URL for API endpoints */
	apiBaseUrl: string;
};

/**
 * Global configuration constants
 * Reads configuration from environment variables and package.json
 *
 * @warning
 * Always use GLOBAL_CONFIG instead of directly accessing import.meta.env
 */
export const GLOBAL_CONFIG: GlobalConfig = {
	appName: "Fitness Solutions Admin",
	appVersion: packageJson.version,
	defaultRoute: import.meta.env.VITE_APP_DEFAULT_ROUTE || "/overview",
	publicPath: import.meta.env.VITE_APP_PUBLIC_PATH || "/",
	// Updated for Fitness Solutions API
	apiBaseUrl:
		import.meta.env.VITE_API_URL ||
		import.meta.env.VITE_APP_API_BASE_URL ||
		"/api/v1",
};
