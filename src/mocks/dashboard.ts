export interface DashboardStats {
	totalUsers: number;
	totalPrograms: number;
	totalExercises: number;
	activeUsers: number;
	inactiveUsers: number;
	totalTrainers: number;
	totalTrainees: number;
}

export interface ProgramUsageData {
	label: string;
	value: number;
	color: string;
	icon: string;
	date: string; // ISO date string for filtering
}

export interface UserActivityData {
	label: string;
	value: number;
	color: string;
	percentage: number;
}

export const mockDashboardStats: DashboardStats = {
	totalUsers: 1250,
	totalPrograms: 85,
	totalExercises: 420,
	activeUsers: 938,
	inactiveUsers: 312,
	totalTrainers: 3,
	totalTrainees: 5,
};

export const mockUserActivityData: UserActivityData[] = [
	{
		label: "Active Users",
		value: mockDashboardStats.activeUsers,
		color: "bg-green-500",
		percentage: (mockDashboardStats.activeUsers / mockDashboardStats.totalUsers) * 100,
	},
	{
		label: "Inactive Users",
		value: mockDashboardStats.inactiveUsers,
		color: "bg-gray-500",
		percentage: (mockDashboardStats.inactiveUsers / mockDashboardStats.totalUsers) * 100,
	},
];

// Extended program usage data for the last 12 months
export const mockProgramUsageData: ProgramUsageData[] = [
	{ label: "Jan", value: 95, color: "bg-blue-500", icon: "solar:calendar-bold-duotone", date: "2024-01-01" },
	{ label: "Feb", value: 110, color: "bg-purple-500", icon: "solar:calendar-bold-duotone", date: "2024-02-01" },
	{ label: "Mar", value: 125, color: "bg-green-500", icon: "solar:calendar-bold-duotone", date: "2024-03-01" },
	{ label: "Apr", value: 105, color: "bg-yellow-500", icon: "solar:calendar-bold-duotone", date: "2024-04-01" },
	{ label: "May", value: 130, color: "bg-red-500", icon: "solar:calendar-bold-duotone", date: "2024-05-01" },
	{ label: "Jun", value: 140, color: "bg-indigo-500", icon: "solar:calendar-bold-duotone", date: "2024-06-01" },
	{ label: "Jul", value: 135, color: "bg-pink-500", icon: "solar:calendar-bold-duotone", date: "2024-07-01" },
	{ label: "Aug", value: 145, color: "bg-teal-500", icon: "solar:calendar-bold-duotone", date: "2024-08-01" },
	{ label: "Sep", value: 150, color: "bg-orange-500", icon: "solar:calendar-bold-duotone", date: "2024-09-01" },
	{ label: "Oct", value: 160, color: "bg-cyan-500", icon: "solar:calendar-bold-duotone", date: "2024-10-01" },
	{ label: "Nov", value: 155, color: "bg-lime-500", icon: "solar:calendar-bold-duotone", date: "2024-11-01" },
	{ label: "Dec", value: 165, color: "bg-violet-500", icon: "solar:calendar-bold-duotone", date: "2024-12-01" },
];
