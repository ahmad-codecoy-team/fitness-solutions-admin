import { useQuery } from "@tanstack/react-query";
import userService from "@/api/services/userService";
import exerciseService from "@/api/services/exercises";
import type { DashboardStats, UserActivityData } from "@/mocks/dashboard";

// Query keys
export const dashboardKeys = {
	all: ["dashboard"] as const,
	stats: () => [...dashboardKeys.all, "stats"] as const,
	userActivity: () => [...dashboardKeys.all, "userActivity"] as const,
};

// Fetch dashboard statistics from real API data
export function useDashboardStats() {
	return useQuery({
		queryKey: dashboardKeys.stats(),
		queryFn: async (): Promise<DashboardStats> => {
			try {
				// Fetch trainers, clients, and exercises data in parallel
				const [trainersData, clientsData, exercisesData] = await Promise.all([
					userService.getAllTrainers(),
					userService.getTotalClients(),
					exerciseService.getAllExercises(1, 1000), // Get large limit to count all
				]);

				// Process trainers data
				let trainers: any[] = [];
				if (trainersData && (trainersData as any).data && Array.isArray((trainersData as any).data)) {
					trainers = (trainersData as any).data;
				} else if (Array.isArray(trainersData)) {
					trainers = trainersData;
				}

				// Process clients data
				let clients: any[] = [];
				if (clientsData && (clientsData as any).data && Array.isArray((clientsData as any).data)) {
					clients = (clientsData as any).data;
				} else if (Array.isArray(clientsData)) {
					clients = clientsData;
				}

				// Process exercises data
				let exercises: any[] = [];
				let totalExercises = 0;
				if (exercisesData && exercisesData.data && Array.isArray(exercisesData.data)) {
					exercises = exercisesData.data;
					totalExercises = exercisesData.meta?.total || exercises.length;
				} else if (Array.isArray(exercisesData)) {
					exercises = exercisesData;
					totalExercises = exercises.length;
				}

				// Count active/inactive trainers
				const activeTrainers = trainers.filter((trainer) => trainer.status === "active" || !trainer.status).length;
				const inactiveTrainers = trainers.filter((trainer) => trainer.status === "suspended").length;
				const totalTrainers = trainers.length;

				// Count active/inactive clients (trainees)
				// const activeClients = clients.filter(client => client.status === 'active' || !client.status).length;
				// const inactiveClients = clients.filter(client => client.status === 'suspended').length;
				const totalTrainees = clients.length;

				// Calculate total users (trainers + clients)
				const totalUsers = totalTrainers;
				const activeUsers = activeTrainers;
				// const activeUsers = activeTrainers + activeClients;
				const inactiveUsers = inactiveTrainers;

				return {
					totalUsers,
					totalPrograms: 0, // Keep as 0 for now, no programs API available
					totalExercises,
					activeUsers,
					inactiveUsers,
					totalTrainers,
					totalTrainees,
				};
			} catch (error) {
				console.error("Error fetching dashboard stats:", error);
				// Return fallback data on error
				return {
					totalUsers: 0,
					totalPrograms: 0,
					totalExercises: 0,
					activeUsers: 0,
					inactiveUsers: 0,
					totalTrainers: 0,
					totalTrainees: 0,
				};
			}
		},
		refetchInterval: 30000, // Refetch every 30 seconds
	});
}

// Generate user activity data based on real stats
export function useUserActivityData() {
	const { data: stats } = useDashboardStats();

	return useQuery({
		queryKey: dashboardKeys.userActivity(),
		queryFn: (): UserActivityData[] => {
			if (!stats) return [];

			const totalUsers = stats.totalUsers || 1; // Prevent division by zero

			return [
				{
					label: "Active Users",
					value: stats.activeUsers,
					color: "bg-green-500",
					percentage: (stats.activeUsers / totalUsers) * 100,
				},
				{
					label: "Inactive Users",
					value: stats.inactiveUsers,
					color: "bg-gray-500",
					percentage: (stats.inactiveUsers / totalUsers) * 100,
				},
			];
		},
		enabled: !!stats, // Only run when stats are available
	});
}
