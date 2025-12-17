import { Icon } from "@/components/icon";
import type { CreateNotificationRequest } from "@/types/notification";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Input } from "@/ui/input";
import { Checkbox } from "@/ui/checkbox";
import { Badge } from "@/ui/badge";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { mockTrainers, mockTrainees } from "@/mocks/users";

interface SimpleNotificationFormProps {
	onSubmit: (data: CreateNotificationRequest) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
	mode: "create" | "edit";
}

export function SimpleNotificationForm({ onSubmit, onCancel, isLoading, mode }: SimpleNotificationFormProps) {
	const [announcement, setAnnouncement] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});
	const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState("");

	// Combine all users (trainers + trainees)
	const allUsers = useMemo(() => {
		const trainers = mockTrainers.map(t => ({
			id: t.id,
			name: t.name,
			email: t.email,
			type: "Trainer" as const,
			status: t.status
		}));
		const trainees = mockTrainees.map(t => ({
			id: t.id,
			name: t.name,
			email: t.email,
			type: "Trainee" as const,
			status: t.status
		}));
		return [...trainers, ...trainees];
	}, []);

	// Filter users based on search query
	const filteredUsers = useMemo(() => {
		if (!searchQuery.trim()) return allUsers;
		const query = searchQuery.toLowerCase();
		return allUsers.filter(user => 
			user.name.toLowerCase().includes(query) ||
			user.email.toLowerCase().includes(query)
		);
	}, [allUsers, searchQuery]);

	// Handle select all
	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedUserIds(filteredUsers.map(u => u.id));
		} else {
			setSelectedUserIds([]);
		}
	};

	// Handle individual user selection
	const handleUserToggle = (userId: string, checked: boolean) => {
		if (checked) {
			setSelectedUserIds(prev => [...prev, userId]);
		} else {
			setSelectedUserIds(prev => prev.filter(id => id !== userId));
		}
	};

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

		if (selectedUserIds.length === 0) {
			newErrors.recipients = "Please select at least one user";
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
				type: "admin_message" as any,
				title: "Admin Announcement",
				message: announcement.trim(),
				target: {
					type: "custom_users" as any,
					userIds: selectedUserIds,
				},
			};

			await onSubmit(submitData);
		} catch (error) {
			console.error("Error submitting announcement:", error);
			toast.error("Failed to send announcement");
		}
	};

	const selectedCount = selectedUserIds.length;
	const isAllSelected = filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length;

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="text-xl font-semibold">
						{mode === "create" ? "Create New Announcement" : "Edit Announcement"}
					</CardTitle>
					<p className="text-muted-foreground">
						Send a push notification announcement to app users
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

					{/* User Selection */}
					<div className="space-y-4">
						<Label className="text-foreground">Select Users *</Label>
						
						{/* User Selection List - Always visible */}
							<div className="space-y-3">
								{/* Search */}
								<div className="relative">
									<Icon 
										icon="solar:magnifer-bold-duotone" 
										className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
									/>
									<Input
										placeholder="Search users by name or email..."
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
										className="pl-9"
									/>
								</div>

								{/* Select All */}
								<div className="flex items-center justify-between p-3 bg-muted rounded-lg">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="select-all"
											checked={isAllSelected}
											onCheckedChange={handleSelectAll}
										/>
										<Label htmlFor="select-all" className="font-medium cursor-pointer">
											Select All
										</Label>
									</div>
									<Badge variant="secondary">
										{selectedCount} selected
									</Badge>
								</div>

								{/* User List */}
								<div className="border rounded-lg max-h-[300px] overflow-y-auto">
									{filteredUsers.length === 0 ? (
										<div className="p-8 text-center text-muted-foreground">
											<Icon icon="solar:users-group-rounded-bold-duotone" className="h-12 w-12 mx-auto mb-2 opacity-50" />
											<p>No users found</p>
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
													<Label
														htmlFor={user.id}
														className="flex-1 cursor-pointer"
													>
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

								{errors.recipients && (
									<p className="text-sm text-destructive">{errors.recipients}</p>
								)}
							</div>
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
									<li>• This will be sent to {selectedCount} selected user{selectedCount !== 1 ? 's' : ''}</li>
									<li>• Selected users will receive a push notification</li>
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