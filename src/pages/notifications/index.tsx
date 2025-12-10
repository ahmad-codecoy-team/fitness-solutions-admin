import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Icon } from "@/components/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { mockNotifications, type Notification } from "@/mocks/notifications";
import { SimpleNotificationForm } from "./components/simple-notification-form";
import type { CreateNotificationRequest } from "@/types/notification";
import { toast } from "sonner";

export default function NotificationsManagement() {
	const [notifications] = useState(mockNotifications);
	const [isLoading, setIsLoading] = useState(false);
	const [formKey, setFormKey] = useState(Date.now());

	const handleCreateNotification = async (data: CreateNotificationRequest) => {
		setIsLoading(true);

		try {
			const announcement = data.message || data.title || "";

			if (!announcement.trim()) {
				toast.error("Please enter an announcement message");
				setIsLoading(false);
				return;
			}

			// Mock notification creation
			await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

			toast.success("Announcement sent successfully! All users will receive this notification.");
			
			// Clear form
			setFormKey(Date.now());
		} catch (error) {
			console.error("Error sending announcement:", error);
			toast.error("Failed to send announcement. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		if (window.confirm("Clear the form?")) {
			setFormKey(Date.now());
		}
	};

	const getTypeIcon = (type: string) => {
		switch (type) {
			case 'success': return 'solar:check-circle-bold-duotone';
			case 'warning': return 'solar:warning-bold-duotone';
			case 'error': return 'solar:close-circle-bold-duotone';
			case 'info': 
			default: return 'solar:info-circle-bold-duotone';
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case 'success': return 'default';
			case 'warning': return 'secondary';
			case 'error': return 'destructive';
			case 'info':
			default: return 'outline';
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'sent': return 'default';
			case 'scheduled': return 'secondary';
			case 'draft': return 'outline';
			default: return 'outline';
		}
	};

	const getRecipientsBadge = (recipients: string, count: number) => {
		const colors: Record<string, string> = {
			all: 'bg-blue-100 text-blue-800',
			trainers: 'bg-green-100 text-green-800',
			trainees: 'bg-purple-100 text-purple-800',
			individual: 'bg-gray-100 text-gray-800'
		};

		return (
			<Badge variant="outline" className={colors[recipients] || colors.individual}>
				{recipients === 'all' ? 'All Users' : recipients === 'individual' ? 'Individual' : `${recipients.charAt(0).toUpperCase() + recipients.slice(1)}`} ({count})
			</Badge>
		);
	};

	// Stats
	const totalNotifications = notifications.length;
	const sentNotifications = notifications.filter(n => n.status === 'sent').length;
	const scheduledNotifications = notifications.filter(n => n.status === 'scheduled').length;
	const draftNotifications = notifications.filter(n => n.status === 'draft').length;
	const totalReads = notifications.reduce((sum, n) => sum + n.readCount, 0);
	const totalClicks = notifications.reduce((sum, n) => sum + n.clickCount, 0);

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

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Icon icon="solar:notification-unread-bold-duotone" className="h-4 w-4" />
							Total Notifications
						</CardTitle>
					</CardHeader>
					<CardContent className="pb-4">
						<div className="text-2xl font-bold">{totalNotifications}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Icon icon="solar:check-circle-bold-duotone" className="h-4 w-4 text-green-600" />
							Sent
						</CardTitle>
					</CardHeader>
					<CardContent className="pb-4">
						<div className="text-2xl font-bold text-green-600">{sentNotifications}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Icon icon="solar:eye-bold-duotone" className="h-4 w-4 text-blue-600" />
							Total Reads
						</CardTitle>
					</CardHeader>
					<CardContent className="pb-4">
						<div className="text-2xl font-bold text-blue-600">{totalReads}</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
							<Icon icon="solar:cursor-bold-duotone" className="h-4 w-4 text-purple-600" />
							Total Clicks
						</CardTitle>
					</CardHeader>
					<CardContent className="pb-4">
						<div className="text-2xl font-bold text-purple-600">{totalClicks}</div>
					</CardContent>
				</Card>
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
								Send Announcement
							</CardTitle>
							<p className="text-sm text-muted-foreground">
								Create and send push notifications to all app users
							</p>
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
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Title</TableHead>
										<TableHead>Type</TableHead>
										<TableHead>Recipients</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Reads</TableHead>
										<TableHead>Clicks</TableHead>
										<TableHead>Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{notifications.map((notification) => (
										<TableRow key={notification.id}>
											<TableCell>
												<div>
													<div className="font-medium">{notification.title}</div>
													<div className="text-sm text-muted-foreground truncate max-w-xs">
														{notification.message}
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Badge variant={getTypeColor(notification.type) as any} className="flex items-center gap-1 w-fit">
													<Icon icon={getTypeIcon(notification.type)} className="h-3 w-3" />
													{notification.type}
												</Badge>
											</TableCell>
											<TableCell>
												{getRecipientsBadge(notification.recipients, notification.recipientCount)}
											</TableCell>
											<TableCell>
												<Badge variant={getStatusColor(notification.status) as any}>
													{notification.status}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="text-sm">
													<div>
														{notification.sentAt 
															? format(new Date(notification.sentAt), 'MMM dd, yyyy')
															: notification.scheduledAt
															? format(new Date(notification.scheduledAt), 'MMM dd, yyyy')
															: format(new Date(notification.createdAt), 'MMM dd, yyyy')
														}
													</div>
													<div className="text-muted-foreground">
														{notification.sentAt 
															? format(new Date(notification.sentAt), 'HH:mm')
															: notification.scheduledAt
															? `Scheduled ${format(new Date(notification.scheduledAt), 'HH:mm')}`
															: 'Draft'
														}
													</div>
												</div>
											</TableCell>
											<TableCell className="text-center">
												{notification.readCount}
											</TableCell>
											<TableCell className="text-center">
												{notification.clickCount}
											</TableCell>
											<TableCell>
												<Button variant="ghost" size="sm">
													<Icon icon="solar:eye-bold-duotone" className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}