import { AnimatedDonutChart } from "@/components/dashboard/charts/animated-donut-chart";
import { AnimatedBarChart } from "@/components/dashboard/charts/animated-bar-chart";
import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";
import { Card, CardContent } from "@/ui/card";
import { m } from "motion/react";
import { mockDashboardStats, mockUserActivityData, mockProgramUsageData } from "@/mocks/dashboard";


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
	const programUsageData = mockProgramUsageData;

	const statCards: StatCardProps[] = [
		{
			title: "Total Users",
			value: stats.totalUsers.toLocaleString(),
			subtitle: "Trainers & Trainees",
			icon: "solar:user-bold-duotone",
			color: "#5942d9",
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
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
					<p className="text-muted-foreground">Fitness Solutions Admin Overview</p>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
							<Badge variant="secondary" className="text-xs">
								Last 3 months
							</Badge>
						</div>
						<div className="h-auto">
							<AnimatedBarChart 
								title="Monthly Program Usage" 
								data={programUsageData} 
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}