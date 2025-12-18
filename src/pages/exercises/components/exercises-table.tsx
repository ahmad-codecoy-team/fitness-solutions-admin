import exerciseService from "@/api/services/exercises";
import { Icon } from "@/components/icon";
import type { Exercise } from "@/types/entity";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ExercisesTable() {
	const navigate = useNavigate();
	const [exercises, setExercises] = useState<Exercise[]>([]);
	const [loading, setLoading] = useState(true);
	const [pagination, setPagination] = useState<{
		total: number;
		page: number;
		limit: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	} | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [limit] = useState(20); // Set initial limit to 20

	const [searchTerm, setSearchTerm] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [sortBy, setSortBy] = useState<keyof Exercise>("updatedAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	// Fetch exercises from API with pagination
	const fetchExercises = async (page = 1) => {
		try {
			setLoading(true);
			console.log("🔵 Fetching exercises - page:", page, "limit:", limit);
			const data = await exerciseService.getAllExercises(page, limit);
			console.log("✅ Exercises fetched:", data);

			// Handle different API response formats
			if (data && data.data && Array.isArray(data.data) && data.meta) {
				// Paginated response with { data: [...], meta: {...} }
				setExercises(data.data);
				setPagination(data.meta);
				setCurrentPage(data.meta.page);
			} else if (Array.isArray(data)) {
				// Direct array response (fallback for non-paginated APIs)
				setExercises(data);
				setPagination(null);
				setCurrentPage(page);
			} else {
				// Unexpected response format
				setExercises([]);
				setPagination(null);
			}
		} catch (error: any) {
			toast.error("Failed to fetch exercises");
			// Reset to safe state on error
			setExercises([]);
			setPagination(null);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchExercises(1);
	}, []);

	const handlePageChange = (page: number) => {
		fetchExercises(page);
	};

	// Filter and sort exercises - ensure exercises is defined and is an array
	const filteredExercises = (exercises || [])
		.filter((exercise) => {
			const exerciseTypes = !exercise.type || exercise.type.length === 0 ? ["general"] : exercise.type;

			const matchesSearch =
				exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
				exerciseTypes.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
			const matchesType = typeFilter === "all" || exerciseTypes.includes(typeFilter);
			return matchesSearch && matchesType;
		})
		.sort((a, b) => {
			let aValue = a[sortBy] || "";
			let bValue = b[sortBy] || "";

			if (sortBy === "updatedAt" || sortBy === "createdAt") {
				aValue = new Date(a[sortBy]).getTime();
				bValue = new Date(b[sortBy]).getTime();
			}

			if (sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

	console.log("Filtered exercises from exercises-table--->", filteredExercises);

	const handleSort = (column: keyof Exercise) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(column);
			setSortOrder("asc");
		}
	};

	const handleDelete = async (id: string) => {
		if (confirm("Are you sure you want to delete this exercise?")) {
			try {
				await exerciseService.deleteExercise(id);
				setExercises((prev) => prev.filter((e) => e._id !== id));
				toast.success("Exercise deleted successfully");
			} catch (error: any) {
				toast.error(error?.response?.data?.message || "Failed to delete exercise");
			}
		}
	};

	const handleEdit = (id: string) => {
		navigate(`/exercises/${id}/edit`);
	};

	const getTypeBadges = (types: string[] | undefined) => {
		// Handle exercises with no type - show as 'general'
		const exerciseTypes = !types || types.length === 0 ? ["general"] : types;

		return (
			<div className="flex flex-wrap gap-1">
				{exerciseTypes.map((type, index) => (
					<Badge key={index} variant="outline" className="text-xs">
						{type}
					</Badge>
				))}
			</div>
		);
	};

	// Get unique exercise types for filtering - ensure exercises is defined
	const uniqueTypes = Array.from(
		new Set(
			(exercises || []).flatMap((exercise) => {
				// Handle exercises with no type - show as 'general'
				if (!exercise || !exercise.type || exercise.type.length === 0) {
					return ["general"];
				}
				return exercise.type;
			}),
		),
	);

	const getSortIcon = (column: keyof Exercise) => {
		if (sortBy !== column) {
			return "solar:sort-vertical-bold-duotone";
		}
		return sortOrder === "asc"
			? "solar:sort-from-bottom-to-top-bold-duotone"
			: "solar:sort-from-top-to-bottom-bold-duotone";
	};

	return (
		<div className="flex flex-col gap-6">
			{/* Filters */}
			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg">Filters</CardTitle>
						<Button onClick={() => navigate("/exercises/new")}>
							<Icon icon="solar:add-circle-bold-duotone" className="mr-2 h-4 w-4" />
							Add New Exercise
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<Input
								placeholder="Search exercises by title, description, or type..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full"
							/>
						</div>
						<Select value={typeFilter} onValueChange={setTypeFilter}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Exercise Type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								{uniqueTypes.map((type) => (
									<SelectItem key={type} value={type}>
										{type.charAt(0).toUpperCase() + type.slice(1)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Exercises Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Icon icon="solar:dumbbell-bold-duotone" />
						Exercises ({pagination?.total})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto max-h-[600px] overflow-y-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("title")}>
										<div className="flex items-center gap-1">
											Exercise Title
											<Icon icon={getSortIcon("title")} className="h-4 w-4" />
										</div>
									</TableHead>
									<TableHead>Exercise Types</TableHead>
									<TableHead>Video</TableHead>
									<TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("updatedAt")}>
										<div className="flex items-center gap-1">
											Last Updated
											<Icon icon={getSortIcon("updatedAt")} className="h-4 w-4" />
										</div>
									</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{loading ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center py-8">
											<Icon icon="solar:refresh-bold-duotone" className="h-6 w-6 animate-spin mx-auto mb-2" />
											Loading exercises...
										</TableCell>
									</TableRow>
								) : (
									filteredExercises.map((exercise) => (
										<TableRow key={exercise._id} className="hover:bg-muted/50">
											<TableCell>
												<div className="font-medium">{exercise.title}</div>
												<div className="text-xs text-muted-foreground truncate max-w-[300px]">
													{exercise.description}
												</div>
											</TableCell>
											<TableCell>{getTypeBadges(exercise.type)}</TableCell>
											<TableCell>
												{exercise.video_link ? (
													<a
														href={exercise.video_link}
														target="_blank"
														rel="noopener noreferrer"
														className="text-blue-600 hover:text-blue-800 text-sm"
													>
														<Icon icon="solar:video-library-bold-duotone" className="h-4 w-4 inline mr-1" />
														View Video
													</a>
												) : (
													<span className="text-muted-foreground text-sm">No video</span>
												)}
											</TableCell>
											<TableCell>
												<span className="text-sm">{format(new Date(exercise.updatedAt), "MMM dd, yyyy")}</span>
											</TableCell>
											<TableCell className="text-right">
												<div className="flex justify-end gap-2">
													<Button variant="outline" size="sm" onClick={() => navigate(`/exercises/${exercise._id}`)}>
														<Icon icon="solar:eye-bold-duotone" className="h-4 w-4" />
													</Button>
													<Button variant="outline" size="sm" onClick={() => handleEdit(exercise._id)}>
														<Icon icon="solar:pen-bold-duotone" className="h-4 w-4" />
													</Button>
													<Button variant="destructive" size="sm" onClick={() => handleDelete(exercise._id)}>
														<Icon icon="solar:trash-bin-trash-bold-duotone" className="h-4 w-4" />
													</Button>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{filteredExercises.length === 0 && !loading && (
						<div className="text-center py-8">
							<Icon icon="solar:dumbbell-bold-duotone" className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium">No exercises found</h3>
							<p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
						</div>
					)}

					{/* Pagination Controls */}
					{pagination && (
						<div className="flex items-center justify-between px-2 py-4 border-t">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<span>
									Showing {exercises?.length || 0} of {pagination.total} exercises
								</span>
								<span>•</span>
								<span>
									Page {pagination.page} of {pagination.totalPages}
								</span>
							</div>

							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={!pagination.hasPrev || loading}
								>
									<Icon icon="solar:arrow-left-bold-duotone" className="h-4 w-4 mr-1" />
									Previous
								</Button>

								<div className="flex items-center gap-1">
									{[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
										let pageNum = i + 1;

										// Smart pagination display logic
										if (pagination.totalPages > 5) {
											if (currentPage <= 3) {
												pageNum = i + 1;
											} else if (currentPage >= pagination.totalPages - 2) {
												pageNum = pagination.totalPages - 4 + i;
											} else {
												pageNum = currentPage - 2 + i;
											}
										}

										return (
											<Button
												key={pageNum}
												variant={pageNum === pagination.page ? "default" : "outline"}
												size="sm"
												onClick={() => handlePageChange(pageNum)}
												disabled={loading}
												className="w-8 h-8 p-0"
											>
												{pageNum}
											</Button>
										);
									})}
								</div>

								<Button
									variant="outline"
									size="sm"
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={!pagination.hasNext || loading}
								>
									Next
									<Icon icon="solar:arrow-right-bold-duotone" className="h-4 w-4 ml-1" />
								</Button>
							</div>
						</div>
					)}

					{/* Fallback info when no pagination available */}
					{!pagination && exercises && exercises.length > 0 && (
						<div className="flex items-center justify-center px-2 py-4 border-t text-sm text-muted-foreground">
							Showing {exercises.length} exercises
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
