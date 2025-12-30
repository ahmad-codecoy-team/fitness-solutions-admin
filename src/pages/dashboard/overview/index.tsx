import { AnimatedDonutChart } from "@/components/dashboard/charts/animated-donut-chart";
import { AnimatedBarChart } from "@/components/dashboard/charts/animated-bar-chart";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";

import { Card, CardContent } from "@/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { mockProgramUsageData } from "@/mocks/dashboard";
import { useState, useMemo } from "react";
import type { StatCardProps } from "../components/StatCard";
import StatCard from "../components/StatCard";
import { useDashboardStats, useUserActivityData } from "@/hooks";

export default function FitnessOverview() {
	// Use React Query hooks for real API data
	const { data: stats, isLoading: statsLoading } = useDashboardStats();
	const { data: userActivityData, isLoading: activityLoading } = useUserActivityData();

	// Date range state for program usage filter
	const [monthsToShow, setMonthsToShow] = useState("3");

	// Filter program usage data based on selected months
	const programUsageData = useMemo(() => {
		const months = Number.parseInt(monthsToShow);
		return mockProgramUsageData.slice(-months);
	}, [monthsToShow]);

	// Generate date range label
	const dateRangeLabel = useMemo(() => {
		const months = Number.parseInt(monthsToShow);
		if (months === 12) return "Last 12 months";
		if (months === 6) return "Last 6 months";
		if (months === 3) return "Last 3 months";
		if (months === 1) return "Last month";
		return `Last ${months} months`;
	}, [monthsToShow]);

	const statCards: StatCardProps[] = useMemo(() => {
		if (!stats) return [];
		
		return [
			{
				title: "Total Trainers",
				value: statsLoading ? "..." : stats.totalTrainers.toLocaleString(),
				subtitle: "Registered fitness trainers",
				icon: "solar:user-bold-duotone",
				color: "#5942d9",
			},
			{
				title: "Total Trainees",
				value: statsLoading ? "..." : stats.totalTrainees.toLocaleString(),
				subtitle: "Client accounts",
				icon: "solar:users-group-two-rounded-bold-duotone",
				color: "#ff6b6b",
			},
			{
				title: "Total Programs",
				value: statsLoading ? "..." : stats.totalPrograms.toString(),
				subtitle: "Active fitness programs",
				icon: "solar:calendar-bold-duotone",
				color: "#95d9a9",
			},
			{
				title: "Total Exercises",
				value: statsLoading ? "..." : stats.totalExercises.toString(),
				subtitle: "Available exercises",
				icon: "solar:heart-pulse-bold-duotone",
				color: "#ffb97a",
			},
			{
				title: "Active Users",
				value: statsLoading ? "..." : stats.activeUsers.toString(),
				subtitle: statsLoading ? "Loading..." : `${stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}% of total`,
				icon: "solar:check-circle-bold-duotone",
				color: "#95d9a9",
				badge: !statsLoading && stats.activeUsers > 0 ? {
					text: "High",
					variant: "default",
				} : undefined,
			},
		];
	}, [stats, statsLoading]);

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Dashboard Header */}
			<DashboardHeader />

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
				{statCards.map((card, index) => (
					<StatCard key={card.title} {...card} index={index} />
				))}
			</div>

			{/* Charts Section */}
			<div className="grid gap-6 md:grid-cols-2">
				{/* User Activity Chart */}
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center gap-2 mb-4">
							<Icon icon="solar:pie-chart-bold-duotone" className="text-primary" />
							<h3 className="text-lg font-semibold">User Activity</h3>
						</div>
						<div className="h-auto flex items-center justify-center">
							{activityLoading || statsLoading ? (
								<div className="flex flex-col items-center justify-center py-8">
									<Icon icon="solar:refresh-bold-duotone" className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
									<p className="text-sm text-muted-foreground">Loading user activity data...</p>
								</div>
							) : userActivityData && stats ? (
								<AnimatedDonutChart
									title="User Activity Distribution"
									data={userActivityData}
									centerValue={stats.totalUsers}
									centerLabel="Total Users"
								/>
							) : (
								<div className="flex flex-col items-center justify-center py-8">
									<Icon icon="solar:danger-circle-bold-duotone" className="h-8 w-8 text-muted-foreground mb-2" />
									<p className="text-sm text-muted-foreground">No data available</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Program Usage Chart */}
				<Card>
					<CardContent className="p-6">
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-2">
								<Icon icon="solar:chart-bold-duotone" className="text-primary" />
								<h3 className="text-lg font-semibold">Program Usage</h3>
							</div>
							<div className="flex items-center gap-2">
								<Badge variant="secondary" className="text-xs">
									{dateRangeLabel}
								</Badge>
								<Select value={monthsToShow} onValueChange={setMonthsToShow}>
									<SelectTrigger className="w-[140px] h-8">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="1">1 Month</SelectItem>
										<SelectItem value="3">3 Months</SelectItem>
										<SelectItem value="6">6 Months</SelectItem>
										<SelectItem value="12">12 Months</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>
						<div className="h-auto">
							<AnimatedBarChart title="Monthly Program Usage" data={programUsageData} />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
