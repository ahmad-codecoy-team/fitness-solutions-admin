import uploadService from "@/api/services/uploadService";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export interface UseImageUploadOptions {
	onSuccess?: (filename: string) => void;
	onError?: (error: Error) => void;
	showToast?: boolean;
	minWidth?: number;
	minHeight?: number;
}

/**
 * Hook for uploading a single image
 */
export const useImageUpload = (options: UseImageUploadOptions = {}) => {
	const { onSuccess, onError, showToast = true, minWidth = 400, minHeight = 600 } = options;

	const mutation = useMutation({
		mutationFn: uploadService.uploadImage,
		onSuccess: (response) => {
			if (showToast) {
				toast.success("Image uploaded successfully");
			}
			onSuccess?.(response.image);
		},
		onError: (error: Error) => {
			if (showToast) {
				toast.error(`Upload failed: ${error.message}`);
			}
			onError?.(error);
		},
	});

	const uploadImage = (file: File) => {
		return new Promise<any>((resolve, reject) => {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				const error = new Error("Please select a valid image file");
				if (showToast) {
					toast.error(error.message);
				}
				onError?.(error);
				reject(error);
				return;
			}

			// Validate file size (max 5MB)
			const maxSize = 5 * 1024 * 1024; // 5MB
			if (file.size > maxSize) {
				const error = new Error("Image size must be less than 5MB");
				if (showToast) {
					toast.error(error.message);
				}
				onError?.(error);
				reject(error);
				return;
			}

			// Validate image dimensions
			const img = new Image();
			img.onload = () => {
				if (img.width < minWidth || img.height < minHeight) {
					const error = new Error(`Image dimensions must be at least ${minWidth}x${minHeight}px. Current: ${img.width}x${img.height}px`);
					if (showToast) {
						toast.error(error.message);
					}
					onError?.(error);
					reject(error);
					return;
				}

				// All validations passed, proceed with upload
				mutation.mutateAsync(file).then(resolve).catch(reject);
			};

			img.onerror = () => {
				const error = new Error("Invalid image file");
				if (showToast) {
					toast.error(error.message);
				}
				onError?.(error);
				reject(error);
			};

			img.src = URL.createObjectURL(file);
		});
	};

	return {
		uploadImage,
		isUploading: mutation.isPending,
		error: mutation.error,
		reset: mutation.reset,
	};
};

/**
 * Hook for uploading multiple images
 */
export const useMultipleImageUpload = (options: UseImageUploadOptions = {}) => {
	const { onSuccess, onError, showToast = true, minWidth = 400, minHeight = 600 } = options;

	const mutation = useMutation({
		mutationFn: uploadService.uploadImages,
		onSuccess: (filenames) => {
			if (showToast) {
				toast.success(`${filenames.length} images uploaded successfully`);
			}
			// For multiple uploads, we'll pass the array as a joined string
			onSuccess?.(filenames.join(","));
		},
		onError: (error: Error) => {
			if (showToast) {
				toast.error(`Upload failed: ${error.message}`);
			}
			onError?.(error);
		},
	});

	const uploadImages = (files: File[]) => {
		// Validate all files first
		for (const file of files) {
			if (!file.type.startsWith("image/")) {
				const error = new Error("All files must be valid images");
				if (showToast) {
					toast.error(error.message);
				}
				onError?.(error);
				return;
			}

			const maxSize = 5 * 1024 * 1024; // 5MB
			if (file.size > maxSize) {
				const error = new Error("All images must be less than 5MB");
				if (showToast) {
					toast.error(error.message);
				}
				onError?.(error);
				return;
			}
		}

		// Validate dimensions for all files
		let validationPromises = files.map(file => {
			return new Promise<void>((resolve, reject) => {
				const img = new Image();
				img.onload = () => {
					if (img.width < minWidth || img.height < minHeight) {
						reject(new Error(`Image ${file.name} dimensions must be at least ${minWidth}x${minHeight}px. Current: ${img.width}x${img.height}px`));
						return;
					}
					resolve();
				};
				img.onerror = () => {
					reject(new Error(`Invalid image file: ${file.name}`));
				};
				img.src = URL.createObjectURL(file);
			});
		});

		Promise.all(validationPromises)
			.then(() => {
				// All validations passed, proceed with upload
				mutation.mutate(files);
			})
			.catch((error) => {
				if (showToast) {
					toast.error(error.message);
				}
				onError?.(error);
			});
	};

	return {
		uploadImages,
		isUploading: mutation.isPending,
		error: mutation.error,
		reset: mutation.reset,
	};
};
