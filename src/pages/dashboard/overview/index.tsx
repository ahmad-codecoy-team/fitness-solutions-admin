import { AnimatedDonutChart } from "@/components/dashboard/charts/animated-donut-chart";
import { AnimatedBarChart } from "@/components/dashboard/charts/animated-bar-chart";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";

import { Card, CardContent } from "@/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { m } from "motion/react";
import { mockDashboardStats, mockUserActivityData, mockProgramUsageData } from "@/mocks/dashboard";
import { useState, useMemo } from "react";

interface StatCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: string;
	color: string;
	badge?: {
		text: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	};
	index?: number;
}

const StatCard = ({ title, value, subtitle, icon, color, badge, index }: StatCardProps) => (
	<m.div
		initial={{ opacity: 0, y: 30 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{
			duration: 0.6,
			ease: "easeOut",
			delay: (index || 0) * 0.1,
		}}
		whileHover={{
			y: -4,
			transition: { duration: 0.2 },
		}}
		className="group"
	>
		<Card className="h-full transition-all duration-200 group-hover:shadow-lg">
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
							<Icon icon={icon} style={{ color }} className="shrink-0" />
							<span>{title}</span>
							{badge && (
								<Badge variant={badge.variant} className="text-xs">
									{badge.text}
								</Badge>
							)}
						</div>
						<div className="text-2xl font-bold text-foreground">{value}</div>
						{subtitle && <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>}
					</div>
				</div>
			</CardContent>
		</Card>
	</m.div>
);

export default function FitnessOverview() {
	// Use mock data from mocks folder
	const stats = mockDashboardStats;
	const userActivityData = mockUserActivityData;

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

	const statCards: StatCardProps[] = [
		{
			title: "Total Trainers",
			value: stats.totalTrainers.toLocaleString(),
			subtitle: "Registered fitness trainers",
			icon: "solar:user-bold-duotone",
			color: "#5942d9",
		},
		{
			title: "Total Trainees",
			value: stats.totalTrainees.toLocaleString(),
			subtitle: "Client accounts",
			icon: "solar:users-group-two-rounded-bold-duotone",
			color: "#ff6b6b",
		},
		{
			title: "Total Programs",
			value: stats.totalPrograms,
			subtitle: "Active fitness programs",
			icon: "solar:calendar-bold-duotone",
			color: "#95d9a9",
		},
		{
			title: "Total Exercises",
			value: stats.totalExercises,
			subtitle: "Available exercises",
			icon: "solar:heart-pulse-bold-duotone",
			color: "#ffb97a",
		},
		{
			title: "Active Users",
			value: stats.activeUsers,
			subtitle: `${((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total`,
			icon: "solar:check-circle-bold-duotone",
			color: "#95d9a9",
			badge: {
				text: "High",
				variant: "default",
			},
		},
	];

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
							<AnimatedDonutChart
								title="User Activity Distribution"
								data={userActivityData}
								centerValue={stats.totalUsers}
								centerLabel="Total Users"
							/>
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
