import apiClient from "@/api/apiClient";
import type { 
    Exercise,
    ExerciseCreateRequest, 
    ExerciseUpdateRequest,
    ExerciseResponse,
    ExercisesListResponse
} from "@/types/entity";

export interface ExerciseImportData {
    title: string;
    instructions?: string;
    videoLink?: string;
    [key: string]: any;
}

export enum ExerciseApi {
    Base = "/admin/exercises",
    BulkImport = "/exercise/bulk-import",
}

// Create a new exercise
const createExercise = (data: ExerciseCreateRequest) => {
    return apiClient.post<Exercise>({
        url: ExerciseApi.Base,
        data,
    });
};

// Get all exercises with pagination support
const getAllExercises = (page: number = 1, limit: number = 20) => {
    const url = `${ExerciseApi.Base}?page=${page}&limit=${limit}`;
    console.log("🔵 exerciseService.getAllExercises called, URL:", url);
    return apiClient.get<{
        data: Exercise[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>({
        url: url,
    }).then(result => {
        console.log("✅ getAllExercises paginated result:", result);
        return result;
    }).catch(error => {
        console.error("❌ getAllExercises error:", error);
        throw error;
    });
};

// Update an exercise
const updateExercise = (exerciseId: string, data: ExerciseUpdateRequest) => {
    return apiClient.patch<Exercise>({
        url: `${ExerciseApi.Base}/${exerciseId}`,
        data,
    });
};

// Get exercise by ID
const getExerciseById = (exerciseId: string) => {
    console.log("🔵 exerciseService.getExerciseById called, ID:", exerciseId);
    return apiClient.get<Exercise>({
        url: `${ExerciseApi.Base}/${exerciseId}`,
    }).then(result => {
        console.log("✅ getExerciseById result:", result);
        return result;
    }).catch(error => {
        console.error("❌ getExerciseById error:", error);
        throw error;
    });
};

// Delete an exercise
const deleteExercise = (exerciseId: string) => {
    return apiClient.delete({
        url: `${ExerciseApi.Base}/${exerciseId}`,
    });
};

// Legacy bulk import (keeping for backward compatibility)
const importExercises = (data: ExerciseImportData[]) => {
    return apiClient.post({
        url: ExerciseApi.BulkImport,
        data,
    });
};

export default {
    createExercise,
    getAllExercises,
    getExerciseById,
    updateExercise,
    deleteExercise,
    importExercises,
};
