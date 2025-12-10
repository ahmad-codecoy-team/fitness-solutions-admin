import { Icon } from "@/components/icon";
import { useRouter } from "@/routes/hooks";
import type { CreateNotificationRequest } from "@/types/notification";
import { Button } from "@/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import notificationService from "@/api/services/notificationService";
import { SimpleNotificationForm } from "./components/simple-notification-form";

export default function CreateNotification() {
	const [isLoading, setIsLoading] = useState(false);
	const { push, back } = useRouter();

	const handleCreateNotification = async (data: CreateNotificationRequest) => {
		setIsLoading(true);

		try {
			// Extract just the message/title as the announcement
			const announcement = data.message || data.title || "";

			if (!announcement.trim()) {
				toast.error("Please enter an announcement message");
				setIsLoading(false);
				return;
			}

			const result = await notificationService.sendNotification(announcement);

			if (result.status === 0 || result.code === 0) {
				toast.success("Announcement sent successfully! All users will receive this notification.");
				// Reset form by reloading the page
				window.location.reload();
			} else {
				toast.error(result.message || "Failed to send notification");
			}
		} catch (error) {
			console.error("Error sending notification:", error);
			toast.error("Failed to send notification");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		back();
	};

	return (
		<div className="h-screen flex flex-col p-6">
			{/* Header */}
			<div className="flex-shrink-0 mb-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-4">
						<Button variant="ghost" size="sm" onClick={handleCancel}>
							<Icon icon="solar:alt-arrow-left-outline" className="h-4 w-4 mr-2" />
							Back
						</Button>
						<div>
							<h1 className="text-2xl font-bold text-foreground">Create Notification</h1>
							<p className="text-muted-foreground">Send push notifications to your app users</p>
						</div>
					</div>
				</div>
			</div>

			{/* Notification Form */}
			<div className="flex-1 overflow-y-auto">
				<SimpleNotificationForm
					mode="create"
					onSubmit={handleCreateNotification}
					onCancel={handleCancel}
					isLoading={isLoading}
				/>
			</div>
		</div>
	);
}
