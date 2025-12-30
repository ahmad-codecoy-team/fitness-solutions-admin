import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '@/api/services/userService';
import type { Trainer, UserStatusUpdateRequest } from '@/types/entity';
import { toast } from 'sonner';

// Query keys
export const trainerKeys = {
  all: ['trainers'] as const,
  lists: () => [...trainerKeys.all, 'list'] as const,
  list: (filters: Record<string, any>) => [...trainerKeys.lists(), filters] as const,
  details: () => [...trainerKeys.all, 'detail'] as const,
  detail: (id: string) => [...trainerKeys.details(), id] as const,
};

// Fetch all trainers
export function useTrainers() {
  return useQuery({
    queryKey: trainerKeys.lists(),
    queryFn: async () => {
      const data = await userService.getAllTrainers();
      
      // Handle different API response formats
      if (data && (data as any).data && Array.isArray((data as any).data) && (data as any).meta) {
        // Paginated response with { data: [...], meta: {...} }
        return (data as any).data;
      } else if (Array.isArray(data)) {
        // Direct array response (fallback for non-paginated APIs)
        return data;
      } else {
        // Unexpected response format
        console.error("❌ Unexpected API response format:", data);
        return [];
      }
    },
  });
}

// Fetch trainer by ID
export function useTrainer(trainerId: string) {
  return useQuery({
    queryKey: trainerKeys.detail(trainerId),
    queryFn: () => userService.getTrainerById(trainerId),
    enabled: !!trainerId,
  });
}

// Update trainer status
export function useUpdateTrainerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ trainerId, status }: { trainerId: string; status: UserStatusUpdateRequest }) =>
      userService.updateUserStatus(trainerId, status),
    onSuccess: (_, variables) => {
      // Invalidate and refetch trainers list
      queryClient.invalidateQueries({ queryKey: trainerKeys.lists() });
      // Update specific trainer cache if it exists
      queryClient.invalidateQueries({ queryKey: trainerKeys.detail(variables.trainerId) });
      
      toast.success(`Trainer status updated to ${variables.status.status}`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update trainer status");
    },
  });
}

// Fetch clients by trainer ID
export function useTrainerClients(trainerId: string) {
  return useQuery({
    queryKey: [...trainerKeys.detail(trainerId), 'clients'],
    queryFn: () => userService.getClientsByTrainerId(trainerId),
    enabled: !!trainerId,
  });
}