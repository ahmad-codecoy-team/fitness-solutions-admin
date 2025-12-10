import appSettingsService, { type AppSettingData } from "@/api/services/appSettingsService";
import { Icon } from "@/components/icon";
import { Label } from "@/ui/label";
import { Switch } from "@/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface NotificationToggleProps {
	className?: string;
}

export function NotificationToggle({ className }: NotificationToggleProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isInitializing, setIsInitializing] = useState(true);
	const [appSetting, setAppSetting] = useState<AppSettingData | null>(null);

	// Load initial state from API
	useEffect(() => {
		const loadAppSetting = async () => {
			try {
				setIsInitializing(true);
				const setting = await appSettingsService.getAppSetting();
				setAppSetting(setting);
			} catch (error) {
				console.error("❌ Error loading app settings:", error);
				toast.error("Failed to load notification settings.");
			} finally {
				setIsInitializing(false);
			}
		};

		loadAppSetting();
	}, []);

	const handleToggle = async () => {
		if (!appSetting) return;

		setIsLoading(true);

		try {
			console.log("🔄 Toggling notification setting");

			// Call the API to toggle notification setting
			const result = await appSettingsService.toggleAppSetting(appSetting._id);

			console.log("✅ Notification setting toggled:", result);

			setAppSetting(result);

			// API logic is inverted: notificationsEnabled=true means MUTED
			toast.success(!result.notificationsEnabled ? "Notifications are now muted" : "Notifications are now going");
		} catch (error) {
			console.error("❌ Error toggling notifications:", error);
			toast.error("Failed to update notification settings. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// Show loading state while initializing
	if (isInitializing || !appSetting) {
		return (
			<div className={`flex items-center bg-card rounded-lg border px-4 py-2.5 shadow-sm ${className}`}>
				<div className="flex items-center space-x-3">
					<div className="flex items-center space-x-2">
						<div className="p-1.5 rounded-md bg-muted/50">
							<Icon icon="solar:notification-bold" className="h-4 w-4 text-muted-foreground" />
						</div>
						<div className="flex flex-col">
							<Label className="text-sm font-medium leading-none">Push Notifications</Label>
							<span className="text-xs text-muted-foreground mt-0.5">Loading...</span>
						</div>
					</div>
					<div className="flex items-center space-x-3 ml-4">
						<Icon icon="solar:loading-bold" className="h-3 w-3 animate-spin text-muted-foreground" />
					</div>
				</div>
			</div>
		);
	}

	// Toggle works like a mute button: ON = muted, OFF = going
	const isMuted = appSetting.notificationsEnabled;

	return (
		<div className={`flex items-center bg-card rounded-lg border px-4 py-2.5 shadow-sm ${className}`}>
			<div className="flex items-center space-x-3">
				{/* Icon and Label */}
				<div className="flex items-center space-x-2">
					<div className="p-1.5 rounded-md bg-muted/50">
						<Icon icon="solar:notification-bold" className="h-4 w-4 text-muted-foreground" />
					</div>
					<div className="flex flex-col">
						<Label
							htmlFor="notification-toggle"
							className="text-sm font-medium cursor-pointer select-none leading-none"
						>
							Push Notifications
						</Label>
						<span className="text-xs text-muted-foreground mt-0.5">
							{!isMuted ? "Notifications muted" : "Notifications going"}
						</span>
					</div>
				</div>

				{/* Status and Toggle - Fixed width to prevent movement */}
				<div className="flex items-center space-x-3 ml-4">
					{/* Status indicator with fixed width */}
					<div className="flex items-center space-x-1.5 min-w-[70px]">
						<div className={`w-2 h-2 rounded-full ${!isMuted ? "bg-red-500" : "bg-green-500"}`} />
						<span
							className={`text-xs font-medium ${!isMuted ? "text-red-700 dark:text-red-400" : "text-green-700 dark:text-green-400"}`}
						>
							{!isMuted ? "Muted" : "Going"}
						</span>
					</div>

					{/* Toggle Switch */}
					<div className="flex items-center space-x-2">
						{isLoading && <Icon icon="solar:loading-bold" className="h-3 w-3 animate-spin text-muted-foreground" />}
						<Switch
							id="notification-toggle"
							checked={isMuted}
							onCheckedChange={handleToggle}
							disabled={isLoading}
							className="data-[state=unchecked]:bg-red-600 data-[state=checked]:bg-green-600"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
