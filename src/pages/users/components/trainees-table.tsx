import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Avatar } from "@/ui/avatar";
import { Icon } from "@/components/icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import type { Trainee } from "@/mocks/users";
import { format } from "date-fns";

interface TraineesTableProps {
	trainees: Trainee[];
	onAddTrainee?: () => void;
	showAddButton?: boolean;
}

export default function TraineesTable({ trainees, onAddTrainee, showAddButton = false }: TraineesTableProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState<keyof Trainee>("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	// Filter and sort trainees
	const filteredTrainees = trainees
		.filter((trainee) => {
			const matchesSearch =
				trainee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				trainee.email.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus = statusFilter === "all" || trainee.status === statusFilter;
			return matchesSearch && matchesStatus;
		})
		.sort((a, b) => {
			let aValue = a[sortBy];
			let bValue = b[sortBy];

			// Handle date properties
			if (sortBy === "createdAt") {
				aValue = new Date(a[sortBy]).getTime();
				bValue = new Date(b[sortBy]).getTime();
			}

			if (sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

	const handleSort = (column: keyof Trainee) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(column);
			setSortOrder("asc");
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return <Badge variant="default">Active</Badge>;
			case "inactive":
				return <Badge variant="secondary">Inactive</Badge>;
			case "in_progress":
				return <Badge variant="outline">In Progress</Badge>;
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	const getSortIcon = (column: keyof Trainee) => {
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
						{showAddButton && onAddTrainee && (
							<Button onClick={onAddTrainee}>
								<Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4 mr-2" />
								Add Trainee
							</Button>
						)}
					</div>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<Input
								placeholder="Search trainees by name or email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full"
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Trainees Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Icon icon="solar:users-group-rounded-bold-duotone" />
						Trainees ({filteredTrainees.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Trainee</TableHead>
									<TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("status")}>
										<div className="flex items-center gap-1">
											Status
											<Icon icon={getSortIcon("status")} className="h-4 w-4" />
										</div>
									</TableHead>
									<TableHead>Current Program</TableHead>
									<TableHead
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => handleSort("programsEnrolled")}
									>
										<div className="flex items-center gap-1">
											Programs
											<Icon icon={getSortIcon("programsEnrolled")} className="h-4 w-4" />
										</div>
									</TableHead>
									<TableHead
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => handleSort("completedWorkouts")}
									>
										<div className="flex items-center gap-1">
											Workouts
											<Icon icon={getSortIcon("completedWorkouts")} className="h-4 w-4" />
										</div>
									</TableHead>
									<TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("createdAt")}>
										<div className="flex items-center gap-1">
											Joined
											<Icon icon={getSortIcon("createdAt")} className="h-4 w-4" />
										</div>
									</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredTrainees.map((trainee) => (
									<TableRow key={trainee.id} className="hover:bg-muted/50">
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10">
													<img
														src={trainee.avatar || "/src/assets/images/avatars/avatar-1.png"}
														alt={trainee.name}
														className="object-cover"
													/>
												</Avatar>
												<div>
													<div className="font-medium">{trainee.name}</div>
													<div className="text-sm text-muted-foreground">{trainee.email}</div>
													{trainee.phone && <div className="text-xs text-muted-foreground">{trainee.phone}</div>}
												</div>
											</div>
										</TableCell>
										<TableCell>{getStatusBadge(trainee.status)}</TableCell>
										<TableCell>
											{trainee.currentProgram ? (
												<Badge variant="outline" className="text-xs">
													{trainee.currentProgram}
												</Badge>
											) : (
												<span className="text-muted-foreground text-sm">No program</span>
											)}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Icon icon="solar:calendar-bold-duotone" className="h-4 w-4 text-muted-foreground" />
												<span>{trainee.programsEnrolled}</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Icon icon="solar:dumbbell-small-bold-duotone" className="h-4 w-4 text-muted-foreground" />
												<span>{trainee.completedWorkouts}</span>
											</div>
										</TableCell>
										<TableCell>
											<span className="text-sm">{format(new Date(trainee.createdAt), "MMM dd, yyyy")}</span>
										</TableCell>
										<TableCell className="text-right">
											<Button
												variant="outline"
												size="sm"
												onClick={() => window.open(`/users/trainee/${trainee.id}`, "_self")}
											>
												<Icon icon="solar:eye-bold-duotone" className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{filteredTrainees.length === 0 && (
						<div className="text-center py-8">
							<Icon
								icon="solar:users-group-rounded-bold-duotone"
								className="h-12 w-12 text-muted-foreground mx-auto mb-4"
							/>
							<h3 className="text-lg font-medium">No trainees found</h3>
							<p className="text-muted-foreground">
								{trainees.length === 0
									? "This trainer has no trainees yet"
									: "Try adjusting your search or filter criteria"}
							</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
