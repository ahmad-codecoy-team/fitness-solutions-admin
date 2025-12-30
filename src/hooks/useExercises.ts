import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import exerciseService from "@/api/services/exercises";
import type {
	Exercise,
	ExerciseCreateRequest,
	ExerciseUpdateRequest,
	ExerciseStatusUpdateRequest,
} from "@/types/entity";
import { toast } from "sonner";

// Query keys
export const exerciseKeys = {
	all: ["exercises"] as const,
	lists: () => [...exerciseKeys.all, "list"] as const,
	list: (page: number, limit: number) => [...exerciseKeys.lists(), { page, limit }] as const,
	details: () => [...exerciseKeys.all, "detail"] as const,
	detail: (id: string) => [...exerciseKeys.details(), id] as const,
};

// Fetch all exercises with pagination
export function useExercises(page: number = 1, limit: number = 20) {
	return useQuery({
		queryKey: exerciseKeys.list(page, limit),
		queryFn: async () => {
			const data = await exerciseService.getAllExercises(page, limit);

			// Handle different API response formats
			if (data && data.data && Array.isArray(data.data) && data.meta) {
				// Paginated response with { data: [...], meta: {...} }
				return {
					exercises: data.data,
					pagination: data.meta,
				};
			} else if (Array.isArray(data)) {
				// Direct array response (fallback for non-paginated APIs)
				return {
					exercises: data,
					pagination: null,
				};
			} else {
				// Unexpected response format
				console.error("❌ Unexpected API response format:", data);
				return {
					exercises: [],
					pagination: null,
				};
			}
		},
	});
}

// Fetch exercise by ID
export function useExercise(exerciseId: string) {
	return useQuery({
		queryKey: exerciseKeys.detail(exerciseId),
		queryFn: () => exerciseService.getExerciseById(exerciseId),
		enabled: !!exerciseId,
	});
}

// Create exercise
export function useCreateExercise() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: ExerciseCreateRequest) => exerciseService.createExercise(data),
		onSuccess: () => {
			// Invalidate and refetch exercises list
			queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
			toast.success("Exercise created successfully");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to create exercise");
		},
	});
}

// Update exercise
export function useUpdateExercise() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ exerciseId, data }: { exerciseId: string; data: ExerciseUpdateRequest }) =>
			exerciseService.updateExercise(exerciseId, data),
		onSuccess: (_, variables) => {
			// Invalidate and refetch exercises list
			queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
			// Update specific exercise cache
			queryClient.invalidateQueries({ queryKey: exerciseKeys.detail(variables.exerciseId) });
			toast.success("Exercise updated successfully");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to update exercise");
		},
	});
}

// Update exercise status
export function useUpdateExerciseStatus() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ exerciseId, status }: { exerciseId: string; status: ExerciseStatusUpdateRequest }) =>
			exerciseService.updateExerciseStatus(exerciseId, status),
		onSuccess: (_, variables) => {
			// Invalidate and refetch exercises list
			queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
			// Update specific exercise cache if it exists
			queryClient.invalidateQueries({ queryKey: exerciseKeys.detail(variables.exerciseId) });

			toast.success(`Exercise ${variables.status.status} successfully`);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to update exercise status");
		},
	});
}

// Delete exercise
export function useDeleteExercise() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (exerciseId: string) => exerciseService.deleteExercise(exerciseId),
		onSuccess: () => {
			// Invalidate and refetch exercises list
			queryClient.invalidateQueries({ queryKey: exerciseKeys.lists() });
			toast.success("Exercise deleted successfully");
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message || "Failed to delete exercise");
		},
	});
}
