import apiClient from "../apiClient";
import { ENDPOINTS } from "../config";

// Type for app setting data
export interface AppSettingData {
	_id: string;
	notificationsEnabled: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

// Type for app setting response
export interface AppSettingResponse {
	data: AppSettingData;
}

// Get current app setting
const getAppSetting = (): Promise<AppSettingData> => {
	return apiClient.get<AppSettingData>({
		url: ENDPOINTS.APP_SETTINGS.GET,
	});
};

// Toggle app setting (for enabling/disabling notifications)
const toggleAppSetting = (settingId: string): Promise<AppSettingData> => {
	return apiClient.put<AppSettingData>({
		url: ENDPOINTS.APP_SETTINGS.UPDATE(settingId),
	});
};

const appSettingsService = {
	getAppSetting,
	toggleAppSetting,
};

export default appSettingsService;
