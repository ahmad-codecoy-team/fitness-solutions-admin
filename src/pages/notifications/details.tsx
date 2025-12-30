import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Icon } from "@/components/icon";
import { Avatar } from "@/ui/avatar";
import type { Notification } from "@/types/notification";
import notificationService from "@/api/services/notificationService";
import { toast } from "sonner";
import { getImageUrl } from "@/utils";

export default function NotificationDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [notification, setNotification] = useState<Notification | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchNotification = async () => {
			if (!id) return;

			try {
				setLoading(true);
				console.log("[NotificationDetails] Fetching notification:", id);
				const response = await notificationService.getNotificationById(id);
				console.log("[NotificationDetails] Response:", response);
				setNotification(response.data);
			} catch (error) {
				console.error("[NotificationDetails] Error fetching notification:", error);
				toast.error("Failed to load notification details");
				navigate("/notifications");
			} finally {
				setLoading(false);
			}
		};

		fetchNotification();
	}, [id, navigate]);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "sent":
				return "default";
			case "scheduled":
				return "secondary";
			case "draft":
				return "outline";
			default:
				return "outline";
		}
	};

	const getRecipientsBadge = (notification: Notification) => {
		const colors: Record<string, string> = {
			all: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
			users: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
		};

		const isAll = notification.target === "all";
		const count = isAll ? "All Users" : notification.recipients.length;

		return (
			<Badge variant="outline" className={colors[notification.target] || colors.users}>
				{isAll ? "All Users" : `${count} User${notification.recipients.length !== 1 ? "s" : ""}`}
			</Badge>
		);
	};

	const handleDeleteNotification = async () => {
		if (
			!notification ||
			!window.confirm("Are you sure you want to delete this notification? This action cannot be undone.")
		) {
			return;
		}

		try {
			await notificationService.deleteNotification(notification._id);
			toast.success("Notification deleted successfully");
			navigate("/notifications");
		} catch (error) {
			console.error("[NotificationDetails] Error deleting notification:", error);
			toast.error("Failed to delete notification. Please try again.");
		}
	};

	if (loading) {
		return (
			<div className="flex flex-col gap-6 p-6">
				<div className="flex items-center justify-center py-8">
					<Icon icon="solar:loading-bold" className="h-6 w-6 animate-spin mr-2" />
					<span>Loading notification details...</span>
				</div>
			</div>
		);
	}

	if (!notification) {
		return (
			<div className="flex flex-col gap-6 p-6">
				<div className="text-center py-8">
					<Icon
						icon="solar:notification-unread-bold-duotone"
						className="h-12 w-12 mx-auto mb-4 text-muted-foreground"
					/>
					<h3 className="text-lg font-medium">Notification not found</h3>
					<p className="text-muted-foreground">
						The notification you're looking for doesn't exist or has been deleted.
					</p>
					<Button onClick={() => navigate("/notifications")} className="mt-4">
						Back to Notifications
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 p-6">
			<Helmet>
				<title>Notification Details - Fitness Solutions Admin</title>
			</Helmet>

			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button
						variant="outline"
						size="sm"
						onClick={() => navigate("/notifications")}
						className="flex items-center gap-2"
					>
						<Icon icon="solar:alt-arrow-left-bold" className="h-4 w-4" />
						Back
					</Button>
					<div>
						<h1 className="text-3xl font-bold text-foreground">Notification Details</h1>
						<p className="text-muted-foreground">View notification information and recipients</p>
					</div>
				</div>
				<Button variant="destructive" onClick={handleDeleteNotification} className="flex items-center gap-2">
					<Icon icon="solar:trash-bin-minimalistic-bold-duotone" className="h-4 w-4" />
					Delete
				</Button>
			</div>

			{/* Main Content */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Notification Content */}
				<div className="lg:col-span-2 space-y-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Icon icon="solar:notification-unread-bold-duotone" className="h-5 w-5 text-primary" />
								Notification Content
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<span className="text-sm font-bold text-muted-foreground">Title</span>
								<p className="text-foreground mt-1">{notification.title}</p>
							</div>
							<div>
								<span className="text-sm font-bold text-muted-foreground">Message</span>
								<p className="text-foreground mt-1 whitespace-pre-wrap">{notification.message}</p>
							</div>
						</CardContent>
					</Card>

					{/* Recipients for targeted notifications */}
					{notification.target === "users" && notification.recipients.length > 0 && (
						<Card>
							<CardHeader>
								<CardTitle>Recipients ({notification.recipients.length})</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="custom-scrollbar scrollable-container space-y-3">
									{notification.recipients.map((user) => (
										<div key={user._id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
											<Avatar className="h-10 w-10">
												{user.avatar ? (
													<img
														src={getImageUrl(user.avatar)}
														alt={`${user.first_name} ${user.last_name}`}
														className="object-cover"
													/>
												) : (
													<div className="w-full h-full bg-linear-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-medium">
														{user.first_name.charAt(0)}
														{user.last_name.charAt(0)}
													</div>
												)}
											</Avatar>
											<div className="flex-1">
												<div className="font-medium">
													{user.first_name} {user.last_name}
												</div>
												<div className="text-sm text-muted-foreground">{user.email}</div>
											</div>
											<Badge variant="outline" className="text-xs">
												{user.role.name}
											</Badge>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Metadata */}
					<Card>
						<CardHeader>
							<CardTitle>Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<span className="text-sm font-semibold text-muted-foreground">Status</span>
								<div className="mt-1">
									<Badge variant={getStatusColor(notification.status) as any} className="capitalize">
										{notification.status}
									</Badge>
								</div>
							</div>

							<div>
								<span className="text-sm font-semibold text-muted-foreground">Recipients</span>
								<div className="mt-1">{getRecipientsBadge(notification)}</div>
							</div>

							<div>
								<span className="text-sm font-semibold text-muted-foreground">Created</span>
								<p className="text-foreground mt-1">{format(new Date(notification.createdAt), "MMM dd, yyyy HH:mm")}</p>
							</div>

							<div>
								<span className="text-sm font-semibold text-muted-foreground">Sent</span>
								<p className="text-foreground mt-1">
									{notification.sentAt
										? format(new Date(notification.sentAt), "MMM dd, yyyy HH:mm")
										: notification.scheduledAt
											? `Scheduled: ${format(new Date(notification.scheduledAt), "MMM dd, yyyy HH:mm")}`
											: "Not sent"}
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
