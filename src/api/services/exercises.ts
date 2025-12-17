import apiClient from "@/api/apiClient";

export interface ExerciseImportData {
    title: string;
    instructions?: string;
    videoLink?: string;
    [key: string]: any;
}

export enum ExerciseApi {
    BulkImport = "/exercise/bulk-import",
}

const importExercises = (data: ExerciseImportData[]) => {
    return apiClient.post({
        url: ExerciseApi.BulkImport,
        data,
    });
};

export default {
    importExercises,
};
