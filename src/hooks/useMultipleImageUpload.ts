import uploadService from "@/api/services/uploadService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UseMultipleImageUploadOptions {
	onSuccess?: (filenames: string[]) => void;
	onError?: (error: Error) => void;
	showToast?: boolean;
	minWidth?: number;
	minHeight?: number;
}

/**
 * Hook for uploading multiple images sequentially
 * Note: No longer restricts to max 5 images - user can upload any number
 */
export const useMultipleImageUpload = (options: UseMultipleImageUploadOptions = {}) => {
	const { onSuccess, onError, showToast = true, minWidth = 400, minHeight = 600 } = options;

	const mutation = useMutation({
		mutationFn: async (files: File[]) => {
			// Upload images one by one as backend only supports single upload
			const uploadPromises = files.map(file => uploadService.uploadImage(file));
			const responses = await Promise.all(uploadPromises);
			return responses.map(response => response.image);
		},
		onSuccess: (filenames) => {
			if (showToast) {
				toast.success(`${filenames.length} images uploaded successfully`);
			}
			onSuccess?.(filenames);
		},
		onError: (error: Error) => {
			if (showToast) {
				toast.error(`Upload failed: ${error.message}`);
			}
			onError?.(error);
		},
	});

	const uploadImages = async (files: File[]): Promise<string[]> => {
		return new Promise((resolve, reject) => {
			// Validate all files first
			for (const file of files) {
				if (!file.type.startsWith("image/")) {
					const error = new Error("All files must be valid images");
					if (showToast) {
						toast.error(error.message);
					}
					onError?.(error);
					reject(error);
					return;
				}

				const maxSize = 5 * 1024 * 1024; // 5MB
				if (file.size > maxSize) {
					const error = new Error("All images must be less than 5MB");
					if (showToast) {
						toast.error(error.message);
					}
					onError?.(error);
					reject(error);
					return;
				}
			}

			// Validate dimensions for all files
			const validationPromises = files.map(file => {
				return new Promise<void>((resolveValidation, rejectValidation) => {
					const img = new Image();
					img.onload = () => {
						if (img.width < minWidth || img.height < minHeight) {
							rejectValidation(new Error(`Image ${file.name} dimensions must be at least ${minWidth}x${minHeight}px. Current: ${img.width}x${img.height}px`));
							return;
						}
						resolveValidation();
					};
					img.onerror = () => {
						rejectValidation(new Error(`Invalid image file: ${file.name}`));
					};
					img.src = URL.createObjectURL(file);
				});
			});

			Promise.all(validationPromises)
				.then(() => {
					// All validations passed, proceed with upload
					mutation.mutateAsync(files).then(resolve).catch(reject);
				})
				.catch((error) => {
					if (showToast) {
						toast.error(error.message);
					}
					onError?.(error);
					reject(error);
				});
		});
	};

	return {
		uploadImages,
		isUploading: mutation.isPending,
		error: mutation.error,
		reset: mutation.reset,
	};
};