import notificationService from "@/api/services/notificationService";
import { Icon } from "@/components/icon";
import type { Notification } from "@/types/notification";
import type { CreateNotificationRequest } from "@/types/notification";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { SimpleNotificationForm } from "./components/simple-notification-form";

export default function NotificationsManagement() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingHistory, setIsLoadingHistory] = useState(false);
	const [formKey, setFormKey] = useState(Date.now());
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [meta, setMeta] = useState<any>(null);

	// Fetch notifications for history tab
	const fetchNotifications = async (page = 1) => {
		console.log("[NotificationPage] Fetching notifications for page:", page);
		setIsLoadingHistory(true);
		try {
			const response = await notificationService.getNotifications(page, 10);
			console.log("[NotificationPage] Notifications response:", response);

			setNotifications(response.data);
			setMeta(response.meta);
			setCurrentPage(response.meta.page);
			setTotalPages(response.meta.totalPages);
		} catch (error) {
			console.error("[NotificationPage] Error fetching notifications:", error);
			toast.error("Failed to load notification history");
		} finally {
			setIsLoadingHistory(false);
		}
	};

	// Load notifications when component mounts
	useEffect(() => {
		fetchNotifications(1);
	}, []);

	const handleCreateNotification = async (data: CreateNotificationRequest) => {
		console.log("[NotificationPage] Form submitted with data:", data);
		setIsLoading(true);

		try {
			if (!data.title?.trim() || !data.message?.trim()) {
				toast.error("Please enter both title and message");
				setIsLoading(false);
				return;
			}

			console.log("[NotificationPage] Calling notification service...");
			// Use the new notification service
			const { default: notificationService } = await import("@/api/services/notificationService");
			const result = await notificationService.createAndSendNotification(data);
			console.log("[NotificationPage] Service call completed successfully:", result);

			toast.success("Push notification sent successfully! Users will receive this notification.");

			// Clear form and refresh history
			setFormKey(Date.now());
			fetchNotifications(currentPage);
		} catch (error) {
			console.error("[NotificationPage] Error sending notification:", error);

			// Enhanced error logging
			if (error instanceof Error) {
				console.error("[NotificationPage] Error message:", error.message);
				console.error("[NotificationPage] Error stack:", error.stack);
			}

			toast.error("Failed to send notification. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		if (window.confirm("Clear the form?")) {
			setFormKey(Date.now());
		}
	};

	const handleViewNotification = (notification: Notification) => {
		// Navigate to the details page instead of opening a dialog
		window.location.href = `/notifications/${notification._id}`;
	};

	const handleDeleteNotification = async (notificationId: string) => {
		if (!window.confirm("Are you sure you want to delete this notification? This action cannot be undone.")) {
			return;
		}

		try {
			console.log("[NotificationPage] Deleting notification:", notificationId);
			await notificationService.deleteNotification(notificationId);

			toast.success("Notification deleted successfully");

			// Refresh the notifications list
			fetchNotifications(currentPage);
		} catch (error) {
			console.error("[NotificationPage] Error deleting notification:", error);
			toast.error("Failed to delete notification. Please try again.");
		}
	};

	const getRecipientsBadge = (notification: Notification) => {
		const colors: Record<string, string> = {
			all: "bg-blue-100 text-blue-800",
			users: "bg-green-100 text-green-800",
		};

		const isAll = notification.target === "all";
		const count = isAll ? "All Users" : notification.recipients.length;

		return (
			<Badge variant="outline" className={colors[notification.target] || colors.users}>
				{isAll ? "All Users" : `${count} User${notification.recipients.length !== 1 ? "s" : ""}`}
			</Badge>
		);
	};

	// Stats based on real data
	const totalNotifications = meta?.total || 0;

	return (
		<div className="flex flex-col gap-6 p-6">
			<Helmet>
				<title>Notifications - Fitness Solutions Admin</title>
			</Helmet>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Notifications</h1>
					<p className="text-muted-foreground">Manage and send notifications to users</p>
				</div>
			</div>

			{/* Tabs */}
			<Tabs defaultValue="send" className="w-full">
				<TabsList className="grid w-full max-w-md grid-cols-2">
					<TabsTrigger value="send" className="flex items-center gap-2">
						<Icon icon="solar:paper-bin-bold-duotone" className="h-4 w-4" />
						Send Notification
					</TabsTrigger>
					<TabsTrigger value="history" className="flex items-center gap-2">
						<Icon icon="solar:history-bold-duotone" className="h-4 w-4" />
						History
					</TabsTrigger>
				</TabsList>

				{/* Send Notification Tab */}
				<TabsContent value="send" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Icon icon="solar:notification-unread-bold-duotone" className="h-5 w-5 text-primary" />
								Send Push Notification
							</CardTitle>
							<p className="text-sm text-muted-foreground">Create and send push notifications to app users</p>
						</CardHeader>
						<CardContent>
							<div className="max-w-2xl">
								<SimpleNotificationForm
									key={formKey}
									mode="create"
									onSubmit={handleCreateNotification}
									onCancel={handleCancel}
									isLoading={isLoading}
								/>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* History Tab */}
				<TabsContent value="history" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Notification History</CardTitle>
							<p className="text-sm text-muted-foreground">
								{totalNotifications > 0 && `Total: ${totalNotifications} notifications`}
							</p>
						</CardHeader>
						<CardContent>
							{isLoadingHistory ? (
								<div className="flex items-center justify-center py-8">
									<Icon icon="solar:loading-bold" className="h-6 w-6 animate-spin mr-2" />
									<span>Loading notifications...</span>
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Notification</TableHead>
											<TableHead>Recipients</TableHead>
											<TableHead>Date</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{notifications.length === 0 ? (
											<TableRow>
												<TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
													No notifications found
												</TableCell>
											</TableRow>
										) : (
											notifications.map((notification) => (
												<TableRow key={notification._id} className="hover:bg-muted/50">
													<TableCell>
														<button
															type="button"
															onClick={() => handleViewNotification(notification)}
															className="text-left hover:underline focus:outline-none w-full"
														>
															<div className="font-medium text-primary cursor-pointer">{notification.title}</div>
															<div className="text-sm text-muted-foreground truncate max-w-md">
																{notification.message}
															</div>
														</button>
													</TableCell>

													<TableCell>{getRecipientsBadge(notification)}</TableCell>

													<TableCell>
														<div className="text-sm">
															<div>
																{notification.sentAt
																	? format(new Date(notification.sentAt), "MMM dd, yyyy")
																	: notification.scheduledAt
																		? format(new Date(notification.scheduledAt), "MMM dd, yyyy")
																		: format(new Date(notification.createdAt), "MMM dd, yyyy")}
															</div>
															<div className="text-muted-foreground">
																{notification.sentAt
																	? format(new Date(notification.sentAt), "HH:mm")
																	: notification.scheduledAt
																		? `Scheduled ${format(new Date(notification.scheduledAt), "HH:mm")}`
																		: "Draft"}
															</div>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-1">
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleViewNotification(notification)}
																title="View Details"
															>
																<Icon icon="solar:eye-bold-duotone" className="h-4 w-4" />
															</Button>
															<Button
																variant="ghost"
																size="icon"
																onClick={() => handleDeleteNotification(notification._id)}
																title="Delete Notification"
																className="text-destructive hover:text-destructive"
															>
																<Icon icon="solar:trash-bin-minimalistic-bold-duotone" className="h-4 w-4" />
															</Button>
														</div>
													</TableCell>
												</TableRow>
											))
										)}
									</TableBody>
								</Table>
							)}

							{/* Pagination Controls */}
							{!isLoadingHistory && totalPages > 1 && (
								<div className="flex items-center justify-between mt-4">
									<div className="text-sm text-muted-foreground">
										Page {currentPage} of {totalPages}
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="sm"
											onClick={() => fetchNotifications(currentPage - 1)}
											disabled={currentPage === 1 || isLoadingHistory}
										>
											<Icon icon="solar:alt-arrow-left-bold" className="h-4 w-4" />
											Previous
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => fetchNotifications(currentPage + 1)}
											disabled={currentPage === totalPages || isLoadingHistory}
										>
											Next
											<Icon icon="solar:alt-arrow-right-bold" className="h-4 w-4" />
										</Button>
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Note: Notification details now handled by separate page */}
		</div>
	);
}
