import type { CreateNotificationRequest, Notification, NotificationFilters } from "@/types/notification";
import userStore from "@/store/userStore";
import apiClient from "../apiClient";

export enum NotificationApi {
	LIST = "/notifications/",
	CREATE = "/notifications/create",
	UPDATE = "/notifications/:id",
	DELETE = "/notifications/:id",
	GET_BY_ID = "/notifications/:id",
	SEND = "/notifications/send", // New endpoint for sending notifications
}

// Get all notifications
const getNotifications = (filters?: NotificationFilters) => {
	const params = new URLSearchParams();
	
	if (filters?.search) params.append("search", filters.search);
	if (filters?.type) params.append("type", filters.type);
	if (filters?.status) params.append("status", filters.status);
	if (filters?.targetType) params.append("targetType", filters.targetType);
	if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom.toISOString());
	if (filters?.dateTo) params.append("dateTo", filters.dateTo.toISOString());
	
	const queryString = params.toString();
	const url = queryString ? `${NotificationApi.LIST}?${queryString}` : NotificationApi.LIST;
	
	return apiClient.get<Notification[]>({
		url,
	});
};

// Get notification by ID
const getNotificationById = (id: string) => {
	return apiClient.get<Notification>({
		url: NotificationApi.GET_BY_ID.replace(":id", id),
	});
};

// Create and send notification (using the new /send endpoint)
const sendNotification = (announcement: string) => {
	const { userInfo } = userStore.getState();
	const userId = userInfo._id;
	
	if (!userId) {
		throw new Error("User ID is required to send notifications");
	}
	
	// Send only the announcement field as required by the backend
	const requestData = {
		announcement: announcement,
	};
	
	return apiClient.post<Notification>({
		url: NotificationApi.SEND,
		data: requestData,
	});
};

// Update notification (only drafts can be updated)
const updateNotification = (id: string, data: Partial<CreateNotificationRequest>) => {
	return apiClient.put<Notification>({
		url: NotificationApi.UPDATE.replace(":id", id),
		data,
	});
};

// Delete notification
const deleteNotification = (id: string) => {
	return apiClient.delete({
		url: NotificationApi.DELETE.replace(":id", id),
	});
};

const notificationService = {
	getNotifications,
	getNotificationById,
	sendNotification,
	updateNotification,
	deleteNotification,
};

export default notificationService;