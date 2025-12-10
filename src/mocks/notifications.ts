export interface Notification {
	id: string;
	title: string;
	message: string;
	type: 'info' | 'warning' | 'success' | 'error';
	status: 'draft' | 'sent' | 'scheduled';
	recipients: 'all' | 'trainers' | 'trainees' | 'individual';
	recipientCount: number;
	createdAt: string;
	sentAt?: string;
	scheduledAt?: string;
	createdBy: string;
	readCount: number;
	clickCount: number;
}

export const mockNotifications: Notification[] = [
	{
		id: "notif-001",
		title: "New Workout Program Released!",
		message: "We're excited to announce our new 'Summer Body Transformation' program. Get ready to achieve your fitness goals with our comprehensive 12-week plan.",
		type: "success",
		status: "sent",
		recipients: "all",
		recipientCount: 1250,
		createdAt: "2024-12-01T10:00:00Z",
		sentAt: "2024-12-01T10:30:00Z",
		createdBy: "Admin",
		readCount: 892,
		clickCount: 234
	},
	{
		id: "notif-002",
		title: "Maintenance Scheduled",
		message: "The app will be undergoing scheduled maintenance on December 15th from 2:00 AM to 4:00 AM EST. During this time, some features may be temporarily unavailable.",
		type: "warning",
		status: "scheduled",
		recipients: "all",
		recipientCount: 1250,
		createdAt: "2024-12-05T14:20:00Z",
		scheduledAt: "2024-12-14T18:00:00Z",
		createdBy: "Admin",
		readCount: 0,
		clickCount: 0
	},
	{
		id: "notif-003",
		title: "Welcome to Premium!",
		message: "Congratulations on upgrading to Premium! You now have access to advanced workout tracking, nutrition plans, and 1-on-1 trainer consultations.",
		type: "success",
		status: "sent",
		recipients: "individual",
		recipientCount: 1,
		createdAt: "2024-12-08T16:45:00Z",
		sentAt: "2024-12-08T16:45:00Z",
		createdBy: "System",
		readCount: 1,
		clickCount: 1
	},
	{
		id: "notif-004",
		title: "Trainer Certification Update Required",
		message: "Please update your certification documents by December 31st to maintain your trainer status. Upload your latest certifications in the profile section.",
		type: "warning",
		status: "sent",
		recipients: "trainers",
		recipientCount: 75,
		createdAt: "2024-12-07T09:15:00Z",
		sentAt: "2024-12-07T09:15:00Z",
		createdBy: "Admin",
		readCount: 45,
		clickCount: 23
	},
	{
		id: "notif-005",
		title: "New Year, New You Challenge!",
		message: "Join our New Year fitness challenge starting January 1st. Complete daily workouts for 30 days and win exciting prizes!",
		type: "info",
		status: "draft",
		recipients: "all",
		recipientCount: 1250,
		createdAt: "2024-12-09T11:30:00Z",
		createdBy: "Admin",
		readCount: 0,
		clickCount: 0
	}
];