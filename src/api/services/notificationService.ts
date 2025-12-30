import type { CreateNotificationRequest, Notification } from "@/types/notification";
import apiClient from "../apiClient";

export enum NotificationApi {
	LIST = "/admin/notifications",
	CREATE = "/admin/notifications",
	UPDATE = "/notifications/:id",
	DELETE = "/admin/notifications/:id",
	GET_BY_ID = "/admin/notifications/:id",
	SEND = "/admin/notifications/:id/send",
}

// Get all notifications with pagination
const getNotifications = (page: number = 1, limit: number = 10) => {
	console.log(`[NotificationService] Fetching notifications - page: ${page}, limit: ${limit}`);
	const url = `${NotificationApi.LIST}?page=${page}&limit=${limit}`;

	return apiClient.get<{ data: Notification[]; meta: any }>({
		url,
	});
};

// Get notification by ID
const getNotificationById = (id: string) => {
	console.log(`[NotificationService] Fetching notification by ID: ${id}`);
	return apiClient.get<{ data: Notification; meta: any }>({
		url: NotificationApi.GET_BY_ID.replace(":id", id),
	});
};

// Create notification draft
const createNotification = (data: CreateNotificationRequest) => {
	console.log("[NotificationService] Creating notification with data:", data);
	return apiClient.post<{ data: Notification; meta: any }>({
		url: NotificationApi.CREATE,
		data,
	});
};

// Send notification via FCM
const sendNotification = (notificationId: string) => {
	console.log("[NotificationService] Sending notification with ID:", notificationId);
	const sendUrl = NotificationApi.SEND.replace(":id", notificationId);
	console.log("[NotificationService] Send URL:", sendUrl);
	return apiClient.post<{ message: string; fcmResult: string | string[] }>({
		url: sendUrl,
	});
};

// Create and send notification in one go (convenience method)
const createAndSendNotification = async (data: CreateNotificationRequest) => {
	try {
		// Step 1: Create notification draft
		console.log("[NotificationService] Step 1: Creating notification draft...");
		const response = await createNotification(data);
		console.log("[NotificationService] Create response:", response);
		console.log("[NotificationService] Full response object keys:", Object.keys(response));

		// Extract the actual notification data from the response
		const notificationData = response.data;
		console.log("[NotificationService] Notification data:", notificationData);

		// Try different possible ID properties from the data object
		const notificationId =
			notificationData.id ||
			notificationData._id ||
			notificationData.notificationId ||
			notificationData.ID ||
			notificationData.uuid;

		console.log("[NotificationService] Trying to extract ID from response.data:");
		console.log("[NotificationService] - notificationData.id:", notificationData.id);
		console.log("[NotificationService] - notificationData._id:", notificationData._id);
		console.log("[NotificationService] - notificationData.notificationId:", notificationData.notificationId);
		console.log("[NotificationService] - notificationData.ID:", notificationData.ID);
		console.log("[NotificationService] - notificationData.uuid:", notificationData.uuid);
		console.log("[NotificationService] Final extracted ID:", notificationId);

		if (!notificationId) {
			console.error("[NotificationService] No valid ID found in response:", createdNotification);
			throw new Error("No notification ID received from create API");
		}

		// Step 2: Send the notification
		console.log("[NotificationService] Step 2: Sending notification...");
		const sendResult = await sendNotification(notificationId);
		console.log("[NotificationService] Send result:", sendResult);

		return {
			notification: notificationData,
			sendResult,
		};
	} catch (error) {
		console.error("[NotificationService] Error in createAndSendNotification:", error);
		throw error;
	}
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
	console.log(`[NotificationService] Deleting notification with ID: ${id}`);
	return apiClient.delete<{ data: Notification; meta: any }>({
		url: NotificationApi.DELETE.replace(":id", id),
	});
};

const notificationService = {
	getNotifications,
	getNotificationById,
	createNotification,
	sendNotification,
	createAndSendNotification,
	updateNotification,
	deleteNotification,
};

export default notificationService;
