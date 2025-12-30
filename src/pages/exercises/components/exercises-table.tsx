import { Icon } from "@/components/icon";
import type { Exercise, ExerciseStatus } from "@/types/entity";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { useState, useMemo } from "react";
import { useExercises, useUpdateExerciseStatus, useDeleteExercise } from "@/hooks";
import ExercisesFilters from "./exercises-filters";
import ExerciseRow from "./exercise-row";
import { Button } from "@/ui/button";

export default function ExercisesTable() {
	const [currentPage, setCurrentPage] = useState(1);
	const [limit] = useState(20); // Set initial limit to 20

	// Use React Query hooks
	const { data: exerciseData, isLoading, error } = useExercises(currentPage, limit);
	const updateExerciseStatusMutation = useUpdateExerciseStatus();
	const deleteExerciseMutation = useDeleteExercise();

	// Extract data from query result
	const exercises = exerciseData?.exercises || [];
	const pagination = exerciseData?.pagination;

	const [searchTerm, setSearchTerm] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState<keyof Exercise>("updatedAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	// Update exercise status
	const handleStatusUpdate = (exerciseId: string, newStatus: ExerciseStatus) => {
		updateExerciseStatusMutation.mutate({
			exerciseId,
			status: { status: newStatus },
		});
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleDelete = (exerciseId: string) => {
		deleteExerciseMutation.mutate(exerciseId);
	};

	// Filter and sort exercises using useMemo for better performance
	const filteredExercises = useMemo(() => {
		return (exercises || [])
			.filter((exercise) => {
				const exerciseTypes = !exercise.type || exercise.type.length === 0 ? ["general"] : exercise.type;
				const exerciseStatus = exercise.status || "approved"; // Backward compatibility

				const matchesSearch =
					exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					exerciseTypes.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
				const matchesType = typeFilter === "all" || exerciseTypes.includes(typeFilter);
				const matchesStatus = statusFilter === "all" || exerciseStatus === statusFilter;
				return matchesSearch && matchesType && matchesStatus;
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
	}, [exercises, searchTerm, typeFilter, statusFilter, sortBy, sortOrder]);

	const handleSort = (column: keyof Exercise) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(column);
			setSortOrder("asc");
		}
	};

	// Get unique exercise types for filtering - ensure exercises is defined
	const uniqueTypes = useMemo(() => {
		return Array.from(
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
	}, [exercises]);

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
			<ExercisesFilters
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				typeFilter={typeFilter}
				setTypeFilter={setTypeFilter}
				statusFilter={statusFilter}
				setStatusFilter={setStatusFilter}
				uniqueTypes={uniqueTypes}
			/>

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
									<TableHead>Status</TableHead>
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
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-8">
											<Icon icon="solar:refresh-bold-duotone" className="h-6 w-6 animate-spin mx-auto mb-2" />
											Loading exercises...
										</TableCell>
									</TableRow>
								) : error ? (
									<TableRow>
										<TableCell colSpan={6} className="text-center py-8">
											<Icon icon="solar:danger-circle-bold-duotone" className="h-12 w-12 text-red-500 mx-auto mb-4" />
											<h3 className="text-lg font-medium text-red-600">Failed to load exercises</h3>
											<p className="text-muted-foreground">Please try refreshing the page</p>
										</TableCell>
									</TableRow>
								) : filteredExercises.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6}>
											<div className="text-center py-8">
												<Icon
													icon="solar:dumbbell-bold-duotone"
													className="h-12 w-12 text-muted-foreground mx-auto mb-4"
												/>
												<h3 className="text-lg font-medium">No exercises found</h3>
												<p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
											</div>
										</TableCell>
									</TableRow>
								) : (
									filteredExercises.map((exercise) => (
										<ExerciseRow
											key={exercise._id}
											exercise={exercise}
											onStatusUpdate={handleStatusUpdate}
											onDelete={handleDelete}
											updatingStatus={updateExerciseStatusMutation.isPending ? exercise._id : null}
										/>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{filteredExercises.length === 0 && !isLoading && (
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
									disabled={!pagination.hasPrev || isLoading}
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
												disabled={isLoading}
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
									disabled={!pagination.hasNext || isLoading}
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
