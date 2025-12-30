import userService from "@/api/services/userService";
import { Icon } from "@/components/icon";
import type { Trainer } from "@/types/entity";
import type { CreateNotificationRequest } from "@/types/notification";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Checkbox } from "@/ui/checkbox";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface SimpleNotificationFormProps {
	onSubmit: (data: CreateNotificationRequest) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
	mode: "create" | "edit";
}

export function SimpleNotificationForm({ onSubmit, onCancel, isLoading, mode }: SimpleNotificationFormProps) {
	const [title, setTitle] = useState("");
	const [message, setMessage] = useState("");
	const [sendToAll, setSendToAll] = useState(true);
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const [trainers, setTrainers] = useState<Trainer[]>([]);
	const [isLoadingTrainers, setIsLoadingTrainers] = useState(true);

	// Fetch trainers on component mount
	useEffect(() => {
		const fetchTrainers = async () => {
			try {
				console.log("[SimpleNotificationForm] Fetching trainers...");
				setIsLoadingTrainers(true);
				const result = await userService.getAllTrainers();
				console.log("[SimpleNotificationForm] Fetched trainers:", result);
				setTrainers(result.data);
			} catch (error) {
				console.error("[SimpleNotificationForm] Error fetching trainers:", error);
				toast.error("Failed to load trainers. Please refresh the page.");
			} finally {
				setIsLoadingTrainers(false);
			}
		};

		fetchTrainers();
	}, []);

	// Map trainers to the format expected by the UI (only trainers, no trainees)
	const allUsers = useMemo(() => {
		return trainers.map((trainer) => ({
			id: trainer._id,
			name: `${trainer.first_name} ${trainer.last_name}`,
			email: trainer.email,
			type: "Trainer" as const,
			status: trainer.status === "active" ? ("active" as const) : ("inactive" as const),
			avatar: trainer.avatar,
		}));
	}, [trainers]);

	// Filter users based on search query
	const filteredUsers = useMemo(() => {
		if (!searchQuery.trim()) return allUsers;
		const query = searchQuery.toLowerCase();
		return allUsers.filter(
			(user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
		);
	}, [allUsers, searchQuery]);

	// Handle select all
	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedUserIds(filteredUsers.map((u) => u.id));
		} else {
			setSelectedUserIds([]);
		}
	};

	// Handle individual user selection
	const handleUserToggle = (userId: string, checked: boolean) => {
		if (checked) {
			setSelectedUserIds((prev) => [...prev, userId]);
		} else {
			setSelectedUserIds((prev) => prev.filter((id) => id !== userId));
		}
	};

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (!title.trim()) {
			newErrors.title = "Title is required";
		}

		if (!message.trim()) {
			newErrors.message = "Message is required";
		}

		if (message.trim().length < 10) {
			newErrors.message = "Message must be at least 10 characters long";
		}

		if (message.trim().length > 500) {
			newErrors.message = "Message must be less than 500 characters";
		}

		if (!sendToAll && selectedUserIds.length === 0) {
			newErrors.recipients = "Please select at least one trainer";
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
			const submitData: CreateNotificationRequest = {
				title: title.trim(),
				message: message.trim(),
				sendToAll: sendToAll,
				...(!sendToAll && { recipients: selectedUserIds }),
				data: { type: "ADMIN_MESSAGE" },
			};

			await onSubmit(submitData);
		} catch (error) {
			console.error("Error submitting notification:", error);
			toast.error("Failed to send notification");
		}
	};

	const selectedCount = selectedUserIds.length;
	const isAllSelected = filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length;

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-xl font-semibold">
						{mode === "create" ? "Send Push Notification" : "Edit Notification"}
					</CardTitle>
					<p className="text-muted-foreground">Send a push notification to app users</p>
				</CardHeader>
				<CardContent className="space-y-6">
					{/* Title */}
					<div className="space-y-2">
						<Label htmlFor="title" className="text-foreground">
							Title *
						</Label>
						<Input
							id="title"
							value={title}
							onChange={(e) => {
								setTitle(e.target.value);
								if (errors.title) {
									setErrors((prev) => ({ ...prev, title: "" }));
								}
							}}
							placeholder="Enter notification title..."
							className={errors.title ? "border-destructive" : ""}
						/>
						{errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
					</div>

					{/* Message */}
					<div className="space-y-2">
						<Label htmlFor="message" className="text-foreground">
							Message *
						</Label>
						<Textarea
							id="message"
							value={message}
							onChange={(e) => {
								setMessage(e.target.value);
								if (errors.message) {
									setErrors((prev) => ({ ...prev, message: "" }));
								}
							}}
							placeholder="Enter your notification message here..."
							rows={4}
							className={errors.message ? "border-destructive" : ""}
						/>
						{errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
						<p className="text-xs text-muted-foreground">{message.length}/500 characters</p>
					</div>

					{/* Send To All Option */}
					<div className="space-y-4">
						<Label className="text-foreground">Recipients</Label>
						<div className="flex items-center space-x-2">
							<Checkbox
								id="sendToAll"
								checked={sendToAll}
								onCheckedChange={(checked) => {
									setSendToAll(checked as boolean);
									if (checked) {
										setSelectedUserIds([]);
									}
								}}
							/>
							<Label htmlFor="sendToAll" className="cursor-pointer">
								Send to all trainers
							</Label>
						</div>
					</div>

					{/* Trainer Selection - Only show when not sending to all */}
					{!sendToAll && (
						<div className="space-y-4">
							<Label className="text-foreground">Select Trainers *</Label>

							{/* User Selection List */}
							<div className="space-y-3">
								{/* Search */}
								<div className="relative">
									<Icon
										icon="solar:magnifer-bold-duotone"
										className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
									/>
									<Input
										placeholder="Search trainers by name or email..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-9"
									/>
								</div>

								{/* Select All */}
								<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
									<div className="flex items-center space-x-2">
										<Checkbox id="select-all" checked={isAllSelected} onCheckedChange={handleSelectAll} />
										<Label htmlFor="select-all" className="font-medium cursor-pointer">
											Select All
										</Label>
									</div>
									<Badge variant="secondary">{selectedCount} selected</Badge>
								</div>

								{/* User List */}
								<div className="border rounded-lg max-h-[300px] overflow-y-auto">
									{isLoadingTrainers ? (
										<div className="p-8 text-center text-muted-foreground">
											<Icon icon="solar:loading-bold" className="h-12 w-12 mx-auto mb-2 opacity-50 animate-spin" />
											<p>Loading trainers...</p>
										</div>
									) : filteredUsers.length === 0 ? (
										<div className="p-8 text-center text-muted-foreground">
											<Icon
												icon="solar:users-group-rounded-bold-duotone"
												className="h-12 w-12 mx-auto mb-2 opacity-50"
											/>
											<p>No trainers found</p>
										</div>
									) : (
										<div className="divide-y">
											{filteredUsers.map((user) => (
												<div
													key={user.id}
													className="flex items-center space-x-3 p-3 hover:bg-muted/50 transition-colors"
												>
													<Checkbox
														id={user.id}
														checked={selectedUserIds.includes(user.id)}
														onCheckedChange={(checked) => handleUserToggle(user.id, checked as boolean)}
													/>
													<Label htmlFor={user.id} className="flex-1 cursor-pointer">
														<div className="flex items-center justify-between">
															<div>
																<p className="font-medium">{user.name}</p>
																<p className="text-sm text-muted-foreground">{user.email}</p>
															</div>
															<div className="flex items-center gap-2">
																<Badge variant="outline" className="text-xs">
																	{user.type}
																</Badge>
																{user.status === "inactive" && (
																	<Badge variant="secondary" className="text-xs">
																		Inactive
																	</Badge>
																)}
															</div>
														</div>
													</Label>
												</div>
											))}
										</div>
									)}
								</div>

								{errors.recipients && <p className="text-sm text-destructive">{errors.recipients}</p>}
							</div>
						</div>
					)}

					{/* Info Box */}
					<div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
						<div className="flex items-start space-x-3">
							<Icon icon="solar:info-circle-bold" className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
							<div className="space-y-1">
								<p className="text-sm font-medium text-blue-900 dark:text-blue-100">Notification Details</p>
								<ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
									<li>
										• This will be sent to{" "}
										{sendToAll ? "all trainers" : `${selectedCount} selected trainer${selectedCount !== 1 ? "s" : ""}`}
									</li>
									<li>• Trainers will receive a push notification</li>
									<li>• The notification will be visible in the app</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex items-center justify-end gap-3 pt-4 border-t">
						<Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
							Cancel
						</Button>
						<Button type="submit" disabled={isLoading || !title.trim() || !message.trim()} className="min-w-[120px]">
							{isLoading ? (
								<>
									<Icon icon="solar:loading-bold" className="h-4 w-4 mr-2 animate-spin" />
									Sending...
								</>
							) : (
								<>
									<Icon icon="solar:paper-plane-bold" className="h-4 w-4 mr-2" />
									Send Notification
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
		</form>
	);
}
