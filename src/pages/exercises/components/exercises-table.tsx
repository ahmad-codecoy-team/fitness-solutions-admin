import { Icon } from "@/components/icon";
import { type Exercise, mockExercises } from "@/mocks/exercises";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function ExercisesTable() {
	const navigate = useNavigate();
	const [exercises, setExercises] = useState<Exercise[]>(mockExercises);

	const [searchTerm, setSearchTerm] = useState("");
	const [difficultyFilter, setDifficultyFilter] = useState("all");
	const [sortBy, setSortBy] = useState<keyof Exercise>("updatedAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	// Filter and sort exercises
	const filteredExercises = exercises
		.filter((exercise) => {
			const matchesSearch =
				exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				exercise.category.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesDifficulty = difficultyFilter === "all" || exercise.difficulty === difficultyFilter;
			return matchesSearch && matchesDifficulty;
		})
		.sort((a, b) => {
			let aValue = a[sortBy] || "";
			let bValue = b[sortBy] || "";

			if (sortBy === "updatedAt") {
				aValue = new Date(a.updatedAt).getTime();
				bValue = new Date(b.updatedAt).getTime();
			}

			if (sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

	const handleSort = (column: keyof Exercise) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(column);
			setSortOrder("asc");
		}
	};

	const handleDelete = (id: string) => {
        // In a real app, this would delete from backend
        // For now, just update local state
        if (confirm("Are you sure you want to delete this exercise?")) {
            setExercises(prev => prev.filter(e => e.id !== id));
            toast.success("Exercise deleted successfully");
        }
	};

	const handleEdit = (id: string) => {
		navigate(`/exercises/${id}/edit`);
	};

	const getDifficultyBadge = (difficulty: string) => {
		switch (difficulty) {
			case "Beginner":
				return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 hover:bg-green-100">{difficulty}</Badge>;
			case "Intermediate":
				return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-100">{difficulty}</Badge>;
			case "Advanced":
				return <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 hover:bg-red-100">{difficulty}</Badge>;
			default:
				return <Badge variant="secondary">{difficulty}</Badge>;
		}
	};

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
								placeholder="Search exercises by name or category..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full"
							/>
						</div>
						<Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Difficulty" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Levels</SelectItem>
								<SelectItem value="Beginner">Beginner</SelectItem>
								<SelectItem value="Intermediate">Intermediate</SelectItem>
								<SelectItem value="Advanced">Advanced</SelectItem>
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
						Exercises ({filteredExercises.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("name")}>
                                        <div className="flex items-center gap-1">
                                            Exercise Name
                                            <Icon icon={getSortIcon("name")} className="h-4 w-4" />
                                        </div>
                                    </TableHead>
									<TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("category")}>
										<div className="flex items-center gap-1">
											Category
											<Icon icon={getSortIcon("category")} className="h-4 w-4" />
										</div>
									</TableHead>
									<TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("difficulty")}>
										<div className="flex items-center gap-1">
											Difficulty
											<Icon icon={getSortIcon("difficulty")} className="h-4 w-4" />
										</div>
									</TableHead>
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
								{filteredExercises.map((exercise) => (
									<TableRow key={exercise.id} className="hover:bg-muted/50">
										<TableCell>
											<div className="font-medium">{exercise.name}</div>
                                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">{exercise.description}</div>
										</TableCell>
										<TableCell>
                                            <Badge variant="outline">{exercise.category}</Badge>
                                        </TableCell>
										<TableCell>{getDifficultyBadge(exercise.difficulty)}</TableCell>
										<TableCell>
											<span className="text-sm">{format(new Date(exercise.updatedAt), "MMM dd, yyyy")}</span>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button variant="outline" size="sm" onClick={() => handleEdit(exercise.id)}>
													<Icon icon="solar:pen-bold-duotone" className="h-4 w-4" />
												</Button>
                                                <Button variant="destructive" size="sm" onClick={() => handleDelete(exercise.id)}>
                                                    <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-4 w-4" />
                                                </Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{filteredExercises.length === 0 && (
						<div className="text-center py-8">
							<Icon
								icon="solar:dumbbell-bold-duotone"
								className="h-12 w-12 text-muted-foreground mx-auto mb-4"
							/>
							<h3 className="text-lg font-medium">No exercises found</h3>
							<p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
