import { Icon } from "@/components/icon";
import type { CreateNotificationRequest } from "@/types/notification";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

interface SimpleNotificationFormProps {
	onSubmit: (data: CreateNotificationRequest) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
	mode: "create" | "edit";
}

export function SimpleNotificationForm({ onSubmit, onCancel, isLoading, mode }: SimpleNotificationFormProps) {
	const [announcement, setAnnouncement] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!announcement.trim()) {
			newErrors.announcement = "Announcement message is required";
		}

		if (announcement.trim().length < 10) {
			newErrors.announcement = "Announcement must be at least 10 characters long";
		}

		if (announcement.trim().length > 500) {
			newErrors.announcement = "Announcement must be less than 500 characters";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			toast.error("Please fix the errors before submitting");
			return;
		}

		try {
			// Create a simple data object that matches CreateNotificationRequest
			const submitData: CreateNotificationRequest = {
				type: "admin_message" as any,
				title: "Admin Announcement",
				message: announcement.trim(),
				target: {
					type: "all_users" as any,
				},
			};

			await onSubmit(submitData);
		} catch (error) {
			console.error("Error submitting announcement:", error);
			toast.error("Failed to send announcement");
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-xl font-semibold">
						{mode === "create" ? "Create New Announcement" : "Edit Announcement"}
					</CardTitle>
					<p className="text-muted-foreground">
						Send a push notification announcement to all app users
					</p>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Announcement Message */}
					<div className="space-y-2">
						<Label htmlFor="announcement" className="text-foreground">
							Announcement Message *
						</Label>
						<Textarea
							id="announcement"
							value={announcement}
							onChange={(e) => {
								setAnnouncement(e.target.value);
								// Clear error when user starts typing
								if (errors.announcement) {
									setErrors((prev) => ({ ...prev, announcement: "" }));
								}
							}}
							placeholder="Enter your announcement message here..."
							rows={5}
							className={errors.announcement ? "border-destructive" : ""}
						/>
						{errors.announcement && (
							<p className="text-sm text-destructive">{errors.announcement}</p>
						)}
						<p className="text-xs text-muted-foreground">
							{announcement.length}/500 characters
						</p>
					</div>

					{/* Info Box */}
					<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
						<div className="flex items-start space-x-3">
							<Icon 
								icon="solar:info-circle-bold" 
								className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" 
							/>
							<div className="space-y-1">
								<p className="text-sm font-medium text-blue-900 dark:text-blue-100">
									Announcement Details
								</p>
								<ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
									<li>• This will be sent to all app users</li>
									<li>• Users will receive a push notification</li>
									<li>• The announcement will be visible in the app</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center justify-end gap-3 pt-4 border-t">
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={isLoading || !announcement.trim()}
							className="min-w-[120px]"
						>
							{isLoading ? (
								<>
									<Icon icon="solar:loading-bold" className="h-4 w-4 mr-2 animate-spin" />
									Sending...
								</>
							) : (
								<>
									<Icon icon="solar:paper-plane-bold" className="h-4 w-4 mr-2" />
									Send Announcement
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}