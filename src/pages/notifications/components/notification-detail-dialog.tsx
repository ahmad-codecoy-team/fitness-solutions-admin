import { Icon } from "@/components/icon";
import type { Notification } from "@/types/notification";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/ui/dialog";
import { format } from "date-fns";

interface NotificationDetailDialogProps {
	notification: Notification | null;
	open: boolean;
	onClose: () => void;
}

export function NotificationDetailDialog({ notification, open, onClose }: NotificationDetailDialogProps) {
	if (!notification) return null;

	// Removed type functions as they're not needed for the simplified structure

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

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Icon icon="solar:notification-unread-bold-duotone" className="h-5 w-5 text-primary" />
						Notification Details
					</DialogTitle>
					<DialogDescription>Complete information about this notification</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Title and Message */}
					<div className="space-y-4">
						<div>
							<span className="text-sm font-medium text-muted-foreground">Title</span>
							<h3 className="text-lg font-semibold mt-1">{notification.title}</h3>
						</div>

						<div>
							<span className="text-sm font-medium text-muted-foreground">Message</span>
							<p className="text-foreground mt-1 whitespace-pre-wrap">{notification.message}</p>
						</div>
					</div>

					{/* Metadata Grid */}
					<div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
						<div>
							<span className="text-sm font-medium text-muted-foreground">Status</span>
							<div className="mt-1">
								<Badge variant={getStatusColor(notification.status) as any} className="capitalize">
									{notification.status}
								</Badge>
							</div>
						</div>

						<div>
							<span className="text-sm font-medium text-muted-foreground">Recipients</span>
							<div className="mt-1">{getRecipientsBadge(notification)}</div>
						</div>

						<div>
							<span className="text-sm font-medium text-muted-foreground">Created</span>
							<p className="text-foreground mt-1">{format(new Date(notification.createdAt), "MMM dd, yyyy HH:mm")}</p>
						</div>

						<div>
							<span className="text-sm font-medium text-muted-foreground">Sent</span>
							<p className="text-foreground mt-1">
								{notification.sentAt
									? format(new Date(notification.sentAt), "MMM dd, yyyy HH:mm")
									: notification.scheduledAt
										? `Scheduled: ${format(new Date(notification.scheduledAt), "MMM dd, yyyy HH:mm")}`
										: "Not sent"}
							</p>
						</div>
					</div>

					{/* Recipients List for targeted notifications */}
					{notification.target === "users" && notification.recipients.length > 0 && (
						<div className="space-y-2">
							<span className="text-sm font-medium text-muted-foreground">Sent to Users:</span>
							<div className="max-h-32 overflow-y-auto p-3 bg-muted rounded-lg space-y-2">
								{notification.recipients.map((user) => (
									<div key={user._id} className="flex items-center gap-2 text-sm">
										{user.avatar && (
											<img
												src={user.avatar}
												alt={`${user.first_name} ${user.last_name}`}
												className="h-6 w-6 rounded-full object-cover"
											/>
										)}
										<span>
											{user.first_name} {user.last_name}
										</span>
										<span className="text-muted-foreground">({user.email})</span>
									</div>
								))}
							</div>
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
