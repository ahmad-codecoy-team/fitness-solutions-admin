import apiClient from "../apiClient";

export interface ImageUploadResponse {
	image: string;
}

export interface PdfToImagesResponse {
	totalPages: number;
	images: string[];
}

export enum UploadApi {
	IMAGE = "/uploads/image",
	PDF_TO_IMAGES = "/uploads/pdf-to-images",
}

/**
 * Upload a single image to the backend
 * @param file - The image file to upload
 * @returns Promise with uploaded image filename
 */
const uploadImage = async (file: File): Promise<ImageUploadResponse> => {
	const formData = new FormData();
	formData.append("image", file);

	return apiClient.post<ImageUploadResponse>({
		url: UploadApi.IMAGE,
		data: formData,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

/**
 * Upload multiple images to the backend
 * @param files - Array of image files
 * @returns Promise with array of uploaded image filenames
 */
const uploadImages = async (files: File[]): Promise<string[]> => {
	const uploadPromises = files.map((file) => uploadImage(file));
	const responses = await Promise.all(uploadPromises);
	return responses.map((response) => response.image);
};

/**
 * Upload a PDF file and convert it to images
 * @param file - The PDF file to upload and convert
 * @returns Promise with response containing totalPages and images array
 */
const uploadPdfToImages = async (file: File): Promise<PdfToImagesResponse> => {
	const formData = new FormData();
	formData.append("pdf", file);

	return apiClient.post<PdfToImagesResponse>({
		url: UploadApi.PDF_TO_IMAGES,
		data: formData,
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

export default {
	uploadImage,
	uploadImages,
	uploadPdfToImages,
};
