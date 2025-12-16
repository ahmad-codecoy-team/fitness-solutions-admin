import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/ui/dialog";
import type { Notification } from "@/mocks/notifications";
import { format } from "date-fns";

interface NotificationDetailDialogProps {
	notification: Notification | null;
	open: boolean;
	onClose: () => void;
}

export function NotificationDetailDialog({
	notification,
	open,
	onClose,
}: NotificationDetailDialogProps) {
	if (!notification) return null;

	const getTypeIcon = (type: string) => {
		switch (type) {
			case "success":
				return "solar:check-circle-bold-duotone";
			case "warning":
				return "solar:warning-bold-duotone";
			case "error":
				return "solar:close-circle-bold-duotone";
			case "info":
			default:
				return "solar:info-circle-bold-duotone";
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case "success":
				return "default";
			case "warning":
				return "secondary";
			case "error":
				return "destructive";
			case "info":
			default:
				return "outline";
		}
	};

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

	const getRecipientsBadge = (recipients: string, count: number) => {
		const colors: Record<string, string> = {
			all: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
			trainers: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
			trainees: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
			individual: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
		};

		return (
			<Badge variant="outline" className={colors[recipients] || colors.individual}>
				{recipients === "all"
					? "All Users"
					: recipients === "individual"
						? "Individual"
						: `${recipients.charAt(0).toUpperCase() + recipients.slice(1)}`}{" "}
				({count})
			</Badge>
		);
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Icon icon="solar:notification-unread-bold-duotone" className="h-5 w-5 text-primary" />
						Notification Details
					</DialogTitle>
					<DialogDescription>
						Complete information about this notification
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Title and Message */}
					<div className="space-y-4">
						<div>
							<label className="text-sm font-medium text-muted-foreground">Title</label>
							<h3 className="text-lg font-semibold mt-1">{notification.title}</h3>
						</div>

						<div>
							<label className="text-sm font-medium text-muted-foreground">Message</label>
							<p className="text-foreground mt-1 whitespace-pre-wrap">{notification.message}</p>
						</div>
					</div>

					{/* Metadata Grid */}
					<div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
						<div>
							<label className="text-sm font-medium text-muted-foreground">Type</label>
							<div className="mt-1">
								<Badge variant={getTypeColor(notification.type) as any} className="flex items-center gap-1 w-fit">
									<Icon icon={getTypeIcon(notification.type)} className="h-3 w-3" />
									{notification.type}
								</Badge>
							</div>
						</div>

						<div>
							<label className="text-sm font-medium text-muted-foreground">Status</label>
							<div className="mt-1">
								<Badge variant={getStatusColor(notification.status) as any}>
									{notification.status}
								</Badge>
							</div>
						</div>

						<div>
							<label className="text-sm font-medium text-muted-foreground">Recipients</label>
							<div className="mt-1">
								{getRecipientsBadge(notification.recipients, notification.recipientCount)}
							</div>
						</div>

						<div>
							<label className="text-sm font-medium text-muted-foreground">Date</label>
							<p className="text-foreground mt-1">
								{notification.sentAt
									? format(new Date(notification.sentAt), "MMM dd, yyyy HH:mm")
									: notification.scheduledAt
										? `Scheduled: ${format(new Date(notification.scheduledAt), "MMM dd, yyyy HH:mm")}`
										: format(new Date(notification.createdAt), "MMM dd, yyyy HH:mm")}
							</p>
						</div>
					</div>

					{/* Engagement Stats */}
					<div className="grid grid-cols-2 gap-4">
						<div className="p-4 bg-muted rounded-lg">
							<div className="flex items-center gap-2 text-muted-foreground mb-1">
								<Icon icon="solar:eye-bold-duotone" className="h-4 w-4" />
								<span className="text-sm font-medium">Read Count</span>
							</div>
							<p className="text-2xl font-bold">{notification.readCount}</p>
							<p className="text-xs text-muted-foreground">
								{((notification.readCount / notification.recipientCount) * 100).toFixed(1)}% read rate
							</p>
						</div>

						<div className="p-4 bg-muted rounded-lg">
							<div className="flex items-center gap-2 text-muted-foreground mb-1">
								<Icon icon="solar:cursor-bold-duotone" className="h-4 w-4" />
								<span className="text-sm font-medium">Click Count</span>
							</div>
							<p className="text-2xl font-bold">{notification.clickCount}</p>
							<p className="text-xs text-muted-foreground">
								{((notification.clickCount / notification.recipientCount) * 100).toFixed(1)}% click rate
							</p>
						</div>
					</div>

					{/* Action URL if exists */}
					{notification.actionUrl && (
						<div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
							<label className="text-sm font-medium text-blue-900 dark:text-blue-100">Action URL</label>
							<p className="text-sm text-blue-700 dark:text-blue-300 mt-1 break-all">
								{notification.actionUrl}
							</p>
						</div>
					)}

					{/* Close Button */}
					<div className="flex justify-end">
						<Button onClick={onClose}>Close</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
