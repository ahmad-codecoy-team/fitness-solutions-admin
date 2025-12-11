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

export const mockProgramUsageData: ProgramUsageData[] = [
	{ label: "Jan", value: 120, color: "bg-blue-500", icon: "solar:calendar-bold-duotone" },
	{ label: "Feb", value: 135, color: "bg-purple-500", icon: "solar:calendar-bold-duotone" },
	{ label: "Mar", value: 150, color: "bg-green-500", icon: "solar:calendar-bold-duotone" },
];
