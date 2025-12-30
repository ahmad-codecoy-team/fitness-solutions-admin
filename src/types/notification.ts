export enum NotificationType {
	ADMIN_MESSAGE = "admin_message",
	NEW_STORE = "new_store",
	NEW_COLLECTION = "new_collection",
	DISCOUNT_ADDED = "discount_added",
}

export enum NotificationStatus {
	DRAFT = "draft",
	SCHEDULED = "scheduled",
	SENT = "sent",
	CANCELLED = "cancelled",
}

export enum NotificationTargetType {
	ALL_USERS = "all_users",
	CUSTOM_USERS = "custom_users",
}

export interface NotificationTarget {
	type: NotificationTargetType;
	userIds?: string[]; // For custom user selection
}

export interface Notification {
	_id: string;
	title: string;
	message: string;
	target: "all" | "users"; // Based on API docs
	topics: string[];
	recipients: Array<{
		_id: string;
		first_name: string;
		last_name: string;
		avatar?: string;
		email: string;
		role: {
			_id: string;
			name: string;
			createdAt: string;
			updatedAt: string;
		};
		status: "active" | "inactive";
	}>;
	data: {
		type: string;
	};
	deepLink?: string;
	status: "draft" | "sent" | "scheduled";
	scheduledAt?: string | null;
	sentAt?: string | null;
	createdBy?: string | null;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

// For creating notifications - updated to match API docs
export interface CreateNotificationRequest {
	title: string;
	message: string;
	sendToAll?: boolean;
	recipients?: string[]; // User IDs when sendToAll is false
	data?: Record<string, any>; // Additional data payload
}

// For updating notifications (only draft can be updated)
export interface UpdateNotificationRequest {
	title?: string;
	message?: string;
	target?: NotificationTarget;
}

// For filtering notifications
export interface NotificationFilters {
	search?: string;
	type?: NotificationType;
	status?: NotificationStatus;
	targetType?: NotificationTargetType;
	dateFrom?: Date;
	dateTo?: Date;
}

// Labels for UI
export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
	[NotificationType.ADMIN_MESSAGE]: "Admin Message",
	[NotificationType.NEW_STORE]: "New Store Added",
	[NotificationType.NEW_COLLECTION]: "New Collection Added",
	[NotificationType.DISCOUNT_ADDED]: "Discount Added",
};

export const NOTIFICATION_STATUS_LABELS: Record<NotificationStatus, string> = {
	[NotificationStatus.DRAFT]: "Draft",
	[NotificationStatus.SCHEDULED]: "Scheduled",
	[NotificationStatus.SENT]: "Sent",
	[NotificationStatus.CANCELLED]: "Cancelled",
};

export const NOTIFICATION_TARGET_TYPE_LABELS: Record<NotificationTargetType, string> = {
	[NotificationTargetType.ALL_USERS]: "All Users",
	[NotificationTargetType.CUSTOM_USERS]: "Selected Users",
};
