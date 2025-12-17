import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { Icon } from "@/components/icon";
import { Card } from "@/ui/card";

type DashboardHeaderProps = {
	userLabel?: string; // e.g. "Admin"
	orgName?: string; // e.g. "Wilderness Scout Ministries"
};

export function DashboardHeader({ userLabel = "Admin", orgName = "Fitness Solutions" }: DashboardHeaderProps) {
	const [now, setNow] = useState(() => dayjs());

	useEffect(() => {
		const id = setInterval(() => setNow(dayjs()), 1000);
		return () => clearInterval(id);
	}, []);

	const greeting = useMemo(() => {
		const h = now.hour();
		if (h >= 5 && h < 12) return "Good Morning";
		if (h >= 12 && h < 17) return "Good Afternoon";
		return "Good Night";
	}, [now]);

	const dateText = now.format("dddd, MMMM D, YYYY");
	const timeText = now.format("hh:mm:ss A");

	return (
		<Card className="relative overflow-hidden">
			{/* Background covers the entire card */}
			<div className="absolute inset-0 bg-linear-to-r from-primary/15 via-primary/10 to-transparent" />

			{/* Content layer */}
			<div className="relative z-10 p-6 md:p-8">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					{/* Left */}
					<div className="flex-1 min-w-0">
						<div className="flex items-start gap-4">
							<div className="p-2 bg-primary/10 rounded-lg shrink-0">
								<Icon icon="solar:shield-check-bold-duotone" className="h-8 w-8 text-primary" />
							</div>

							<div className="min-w-0">
								<h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
									{greeting}, {userLabel}
								</h1>
								<p className="mt-1 text-sm md:text-base text-muted-foreground">Welcome to {orgName} Admin Dashboard</p>
							</div>
						</div>
					</div>

					{/* Right */}
					<div className="flex md:justify-end">
						<div className="rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm px-4 py-3 md:px-5 md:py-4">
							<div className="flex items-center md:justify-end gap-2 text-muted-foreground">
								<Icon icon="solar:calendar-bold-duotone" className="h-4 w-4" />
								<span className="text-sm font-medium">{dateText}</span>
							</div>
							<div className="mt-1 text-2xl md:text-3xl font-extrabold tracking-tight text-primary">{timeText}</div>
						</div>
					</div>
				</div>

				{/* Decorative Elements */}
				<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
				<div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" />
			</div>
		</Card>
	);
}
