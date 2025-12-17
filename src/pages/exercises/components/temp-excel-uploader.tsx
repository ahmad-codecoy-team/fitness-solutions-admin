// import { Button } from "@/ui/button";
// import { Icon } from "@/components/icon";
// import { useRef, useState } from "react";
// import * as XLSX from "xlsx";
// import { toast } from "sonner";
// import axios from "axios";

// export interface ExerciseImportData {
//     title: string;
//     instructions?: string;
//     videoLink?: string;
//     [key: string]: any;
// }

// /**
//  * TEMPORARY COMPONENT
//  * This component is used to parse Excel files and upload exercise data to the backend.
//  * It uses a direct axios call to a specific local backend port (8002).
//  */
// export default function TempExcelUploader() {
// 	const fileInputRef = useRef<HTMLInputElement>(null);
// 	const [fileName, setFileName] = useState<string | null>(null);
//     const [extractedData, setExtractedData] = useState<ExerciseImportData[]>([]);
//     const [uploading, setUploading] = useState(false);

// 	const handleButtonClick = () => {
// 		fileInputRef.current?.click();
// 	};

// 	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
// 		const file = e.target.files?.[0];
// 		if (!file) return;

// 		setFileName(file.name);
//         setExtractedData([]); // Clear previous data

// 		try {
// 			const data = await readExcelFile(file);
// 			console.log("Extracted Excel Data:", data);
//             setExtractedData(data);
// 			toast.success(`Successfully extracted ${data.length} rows from ${file.name}. Ready to upload.`);
// 		} catch (error) {
// 			console.error("Error reading excel file:", error);
// 			toast.error("Failed to read Excel file");
// 		} finally {
// 			if (fileInputRef.current) fileInputRef.current.value = "";
// 		}
// 	};

//     const handleUpload = async () => {
//         if (!extractedData.length) {
//             toast.warning("No data to upload");
//             return;
//         }

//         setUploading(true);
//         try {
//             // Using axios directly to avoid Auth headers injected by apiClient
//             // Hardcoded URL as requested by user
//             const url = "http://localhost:8002/api/v1/exercise/bulk-import";

//             console.log("Submitting payload to:", url);
//             // console.log("Payload:", JSON.stringify(extractedData, null, 2));

//             const response = await axios.post(url, extractedData, {
//                 headers: {
//                     "Content-Type": "application/json",
//                 }
//             });

//             console.log("Upload Success:", response.data);
//             toast.success("Successfully uploaded exercises to server!");
//             setExtractedData([]);
//             setFileName(null);
//         } catch (error: any) {
//             console.error("Upload failed details:", error);
//              // Extract specific error message if available
//             let msg = error.response?.data?.error?.detail || error.message || "Unknown error";
//             if (error.response?.status === 500) {
//                  msg += " (Check server logs for 'general_error')";
//             }
//             toast.error(`Upload failed: ${msg}`);
//         } finally {
//             setUploading(false);
//         }
//     };

//     // Helper to extract URL from HYPERLINK formula
// 	function extractUrlFromHyperlinkFormula(formula?: string): string | null {
// 		if (!formula) return null;
// 		const f = formula.trim();
// 		if (!/^=*\s*HYPERLINK\s*\(/i.test(f)) return null;

// 		const m = f.match(/HYPERLINK\s*\(\s*("([^"]+)"|'([^']+)')/i);
// 		if (!m) return null;
// 		return m[2] || m[3] || null;
// 	}

//     // Helper to get link from cell
// 	function getCellHyperlink(cell: XLSX.CellObject | undefined): string | null {
// 		if (!cell) return null;

// 		// 1. Native hyperlink object (l.Target)
// 		const l: any = (cell as any).l;
// 		if (l?.Target && typeof l.Target === "string") return l.Target;

// 		// 2. Hyperlink formula
// 		const urlFromFormula = extractUrlFromHyperlinkFormula((cell as any).f);
// 		if (urlFromFormula) return urlFromFormula;

// 		// 3. Cell value itself is a URL
// 		const v: any = (cell as any).v;
// 		if (typeof v === "string" && /^https?:\/\/\S+/i.test(v)) return v;

// 		return null;
// 	}

// 	const readExcelFile = (file: File): Promise<ExerciseImportData[]> => {
// 		return new Promise((resolve, reject) => {
// 			const reader = new FileReader();

// 			reader.onload = () => {
// 				try {
// 					const buf = reader.result as ArrayBuffer;
// 					if (!buf) throw new Error("No data read from file");

// 					const workbook = XLSX.read(buf, {
// 						type: "array",
// 						cellFormula: true,
// 						cellText: true,
// 					});

// 					const sheetName = workbook.SheetNames[0];
// 					if (!sheetName) return resolve([]);

// 					const ws = workbook.Sheets[sheetName];
// 					const ref = ws["!ref"];
// 					if (!ref) return resolve([]);

// 					const range = XLSX.utils.decode_range(ref);
//                     const result: ExerciseImportData[] = [];

//                     for (let r = range.s.r + 1; r <= range.e.r; ++r) {
//                         const rowObj: ExerciseImportData = { title: "" };

//                         // Column 0: Title & Link
//                         const colTitleIdx = range.s.c;
//                         const titleAddr = XLSX.utils.encode_cell({ r, c: colTitleIdx });
//                         const titleCell = ws[titleAddr];

//                         if (!titleCell) continue;

//                         rowObj.title = String(titleCell.v || "").trim();

//                         const link = getCellHyperlink(titleCell);
//                         rowObj.videoLink = link || ""; // Default to empty string to match Postman payload

//                         // Column 1: Instructions
//                         const colDescIdx = range.s.c + 1;
//                         let instructions = "";
//                         if (colDescIdx <= range.e.c) {
//                              const descAddr = XLSX.utils.encode_cell({ r, c: colDescIdx });
//                              const descCell = ws[descAddr];
//                              if (descCell) {
//                                   instructions = String(descCell.v || "").trim();
//                              }
//                         }
//                         rowObj.instructions = instructions;

//                         if (rowObj.title) {
//                             result.push(rowObj);
//                         }
//                     }

// 					resolve(result);
// 				} catch (err) {
// 					reject(err);
// 				}
// 			};

// 			reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
// 			reader.readAsArrayBuffer(file);
// 		});
// 	};

// 	return (
// 		<div className="flex items-center gap-2">
// 			<input
// 				type="file"
// 				accept=".xlsx,.xls"
// 				ref={fileInputRef}
// 				className="hidden"
// 				onChange={handleFileChange}
// 			/>

// 			<Button
// 				variant="outline"
// 				className="border-dashed border-2 bg-yellow-50/50 hover:bg-yellow-100/50 text-yellow-700 border-yellow-200"
// 				onClick={handleButtonClick}
//                 disabled={uploading}
// 			>
// 				<Icon icon="solar:file-text-bold-duotone" className="mr-2 h-4 w-4" />
// 				{fileName ? `Re-import: ${fileName}` : "Temp: Import Excel"}
// 			</Button>

//             {extractedData.length > 0 && (
//                 <Button
//                     variant="default"
//                     onClick={handleUpload}
//                     disabled={uploading}
//                 >
//                     {uploading ? (
//                         <>
//                             <Icon icon="eos-icons:loading" className="mr-2 h-4 w-4 animate-spin" />
//                             Uploading...
//                         </>
//                     ) : (
//                         <>
//                             <Icon icon="solar:cloud-upload-bold-duotone" className="mr-2 h-4 w-4" />
//                             Upload {extractedData.length} Items to Server
//                         </>
//                     )}
//                 </Button>
//             )}
// 		</div>
// 	);
// }

import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

export interface ExerciseImportData {
	title: string;
	instructions?: string;
	videoLink?: string;
	[key: string]: any;
}

/**
 * TEMPORARY COMPONENT
 * This component is used to parse Excel files and upload exercise data to the backend.
 * It uses a direct axios call to a specific local backend port (8002).
 */
export default function TempExcelUploader() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [fileName, setFileName] = useState<string | null>(null);
	const [extractedData, setExtractedData] = useState<ExerciseImportData[]>([]);
	const [uploading, setUploading] = useState(false);

	const handleButtonClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setFileName(file.name);
		setExtractedData([]); // Clear previous data

		try {
			const data = await readExcelFile(file);
			console.log("Extracted Excel Data:", data);
			setExtractedData(data);
			toast.success(`Successfully extracted ${data.length} rows from ${file.name}. Ready to upload.`);
		} catch (error) {
			console.error("Error reading excel file:", error);
			toast.error("Failed to read Excel file");
		} finally {
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};

	const handleCopyData = async () => {
		if (!extractedData.length) {
			toast.warning("No data to copy");
			return;
		}

		try {
			// Format the data as JSON with proper indentation
			const jsonString = JSON.stringify(extractedData, null, 2);

			// Copy to clipboard
			await navigator.clipboard.writeText(jsonString);

			toast.success(`Copied ${extractedData.length} items to clipboard!`);
		} catch (error) {
			console.error("Failed to copy:", error);
			toast.error("Failed to copy data to clipboard");
		}
	};

	const handleUpload = async () => {
		if (!extractedData.length) {
			toast.warning("No data to upload");
			return;
		}

		setUploading(true);
		try {
			// Using axios directly to avoid Auth headers injected by apiClient
			// Hardcoded URL as requested by user
			const url = "http://localhost:8002/api/v1/exercise/bulk-import";

			console.log("Submitting payload to:", url);
			// console.log("Payload:", JSON.stringify(extractedData, null, 2));

			const response = await axios.post(url, extractedData, {
				headers: {
					"Content-Type": "application/json",
				},
			});

			console.log("Upload Success:", response.data);
			toast.success("Successfully uploaded exercises to server!");
			setExtractedData([]);
			setFileName(null);
		} catch (error: any) {
			console.error("Upload failed details:", error);
			// Extract specific error message if available
			let msg = error.response?.data?.error?.detail || error.message || "Unknown error";
			if (error.response?.status === 500) {
				msg += " (Check server logs for 'general_error')";
			}
			toast.error(`Upload failed: ${msg}`);
		} finally {
			setUploading(false);
		}
	};

	// Helper to extract URL from HYPERLINK formula
	function extractUrlFromHyperlinkFormula(formula?: string): string | null {
		if (!formula) return null;
		const f = formula.trim();
		if (!/^=*\s*HYPERLINK\s*\(/i.test(f)) return null;

		const m = f.match(/HYPERLINK\s*\(\s*("([^"]+)"|'([^']+)')/i);
		if (!m) return null;
		return m[2] || m[3] || null;
	}

	// Helper to get link from cell
	function getCellHyperlink(cell: XLSX.CellObject | undefined): string | null {
		if (!cell) return null;

		// 1. Native hyperlink object (l.Target)
		const l: any = (cell as any).l;
		if (l?.Target && typeof l.Target === "string") return l.Target;

		// 2. Hyperlink formula
		const urlFromFormula = extractUrlFromHyperlinkFormula((cell as any).f);
		if (urlFromFormula) return urlFromFormula;

		// 3. Cell value itself is a URL
		const v: any = (cell as any).v;
		if (typeof v === "string" && /^https?:\/\/\S+/i.test(v)) return v;

		return null;
	}

	const readExcelFile = (file: File): Promise<ExerciseImportData[]> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = () => {
				try {
					const buf = reader.result as ArrayBuffer;
					if (!buf) throw new Error("No data read from file");

					const workbook = XLSX.read(buf, {
						type: "array",
						cellFormula: true,
						cellText: true,
					});

					const sheetName = workbook.SheetNames[0];
					if (!sheetName) return resolve([]);

					const ws = workbook.Sheets[sheetName];
					const ref = ws["!ref"];
					if (!ref) return resolve([]);

					const range = XLSX.utils.decode_range(ref);
					const result: ExerciseImportData[] = [];

					for (let r = range.s.r + 1; r <= range.e.r; ++r) {
						const rowObj: ExerciseImportData = { title: "" };

						// Column 0: Title & Link
						const colTitleIdx = range.s.c;
						const titleAddr = XLSX.utils.encode_cell({ r, c: colTitleIdx });
						const titleCell = ws[titleAddr];

						if (!titleCell) continue;

						rowObj.title = String(titleCell.v || "").trim();

						const link = getCellHyperlink(titleCell);
						rowObj.videoLink = link || ""; // Default to empty string to match Postman payload

						// Column 1: Instructions
						const colDescIdx = range.s.c + 1;
						let instructions = "";
						if (colDescIdx <= range.e.c) {
							const descAddr = XLSX.utils.encode_cell({ r, c: colDescIdx });
							const descCell = ws[descAddr];
							if (descCell) {
								instructions = String(descCell.v || "").trim();
							}
						}
						rowObj.instructions = instructions;

						if (rowObj.title) {
							result.push(rowObj);
						}
					}

					resolve(result);
				} catch (err) {
					reject(err);
				}
			};

			reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
			reader.readAsArrayBuffer(file);
		});
	};

	return (
		<div className="flex items-center gap-2">
			<input type="file" accept=".xlsx,.xls" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

			<Button
				variant="outline"
				className="border-dashed border-2 bg-yellow-50/50 hover:bg-yellow-100/50 text-yellow-700 border-yellow-200"
				onClick={handleButtonClick}
				disabled={uploading}
			>
				<Icon icon="solar:file-text-bold-duotone" className="mr-2 h-4 w-4" />
				{fileName ? `Re-import: ${fileName}` : "Temp: Import Excel"}
			</Button>

			{extractedData.length > 0 && (
				<>
					<Button
						variant="outline"
						onClick={handleCopyData}
						disabled={uploading}
						className="border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 text-blue-700"
					>
						<Icon icon="solar:copy-bold-duotone" className="mr-2 h-4 w-4" />
						Copy {extractedData.length} Items
					</Button>

					<Button variant="default" onClick={handleUpload} disabled={uploading}>
						{uploading ? (
							<>
								<Icon icon="eos-icons:loading" className="mr-2 h-4 w-4 animate-spin" />
								Uploading...
							</>
						) : (
							<>
								<Icon icon="solar:cloud-upload-bold-duotone" className="mr-2 h-4 w-4" />
								Upload to Server
							</>
						)}
					</Button>
				</>
			)}
		</div>
	);
}
