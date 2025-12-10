import uploadService from "@/api/services/uploadService";
import { useMutation } from "@tanstack/react-query";
// import { toast } from "sonner";

export interface UsePdfToImagesOptions {
	onSuccess?: (images: string[], totalPages: number) => void;
	onError?: (error: Error) => void;
}

/**
 * Hook for uploading a PDF file and converting it to images immediately
 * Provides loading state and handles the conversion process
 */
export const usePdfToImages = (options: UsePdfToImagesOptions = {}) => {
	const { onSuccess, onError } = options;

	const mutation = useMutation({
		mutationFn: async (file: File) => {
			// Validate file type
			if (file.type !== "application/pdf") {
				throw new Error("File must be a PDF");
			}

			// Validate file size (e.g., 10MB limit)
			const maxSize = 10 * 1024 * 1024; // 10MB
			if (file.size > maxSize) {
				throw new Error("PDF file must be less than 10MB");
			}

			const response = await uploadService.uploadPdfToImages(file);
			return response;
		},
		onSuccess: (response) => {
			onSuccess?.(response.images, response.totalPages);
		},
		onError: (error: Error) => {
			onError?.(error);
		},
	});

	const convertPdf = async (file: File): Promise<{ images: string[], totalPages: number }> => {
		// Validate file type
		if (file.type !== "application/pdf") {
			const error = new Error("File must be a PDF");
			onError?.(error);
			throw error;
		}

		// Validate file size
		const maxSize = 10 * 1024 * 1024; // 10MB
		if (file.size > maxSize) {
			const error = new Error("PDF file must be less than 10MB");
			onError?.(error);
			throw error;
		}

		return mutation.mutateAsync(file);
	};

	return {
		convertPdf,
		isConverting: mutation.isPending,
		error: mutation.error,
		reset: mutation.reset,
	};
};