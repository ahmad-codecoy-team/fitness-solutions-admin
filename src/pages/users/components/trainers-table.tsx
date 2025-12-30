import { Icon } from "@/components/icon";
import type { Trainer } from "@/types/entity";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { useState, useMemo } from "react";
import { useTrainers, useUpdateTrainerStatus } from "@/hooks";
import TrainersFilters from "./trainers-filters";
import TrainerRow from "./trainer-row";

export default function TrainersTable() {
	// Use React Query hooks
	const { data: trainers = [], isLoading, error } = useTrainers();
	const updateTrainerStatusMutation = useUpdateTrainerStatus();

	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState<keyof Trainer>("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	// Filter and sort trainers using useMemo for better performance
	const filteredTrainers = useMemo(() => {
		return (trainers || [])
			.filter((trainer) => {
				const fullName = `${trainer.first_name} ${trainer.last_name}`;
				const matchesSearch =
					fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
					trainer.role.name.toLowerCase().includes(searchTerm.toLowerCase());

				// Handle missing status field for old users (show as 'active')
				const trainerStatus = trainer.status || "active";
				const matchesStatus = statusFilter === "all" || trainerStatus === statusFilter;
				return matchesSearch && matchesStatus;
			})
			.sort((a, b) => {
				let aValue = a[sortBy];
				let bValue = b[sortBy];

				// Handle nested properties
				if (sortBy === "createdAt") {
					aValue = new Date(a.createdAt).getTime();
					bValue = new Date(b.createdAt).getTime();
				}

				if (sortOrder === "asc") {
					return aValue > bValue ? 1 : -1;
				} else {
					return aValue < bValue ? 1 : -1;
				}
			});
	}, [trainers, searchTerm, statusFilter, sortBy, sortOrder]);

	const handleSort = (column: keyof Trainer) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(column);
			setSortOrder("asc");
		}
	};

	const handleToggleStatus = (trainerId: string, currentStatus: string) => {
		const newStatus = currentStatus === "suspended" ? "active" : "suspended";
		updateTrainerStatusMutation.mutate({
			trainerId,
			status: { status: newStatus as "active" | "suspended" }
		});
	};

	const getSortIcon = (column: keyof Trainer) => {
		if (sortBy !== column) {
			return "solar:sort-vertical-bold-duotone";
		}
		return sortOrder === "asc"
			? "solar:sort-from-bottom-to-top-bold-duotone"
			: "solar:sort-from-top-to-bottom-bold-duotone";
	};

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Trainers</h1>
					<p className="text-muted-foreground">Manage fitness trainers and their accounts</p>
				</div>
			</div>

			{/* Filters */}
			<TrainersFilters
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				statusFilter={statusFilter}
				setStatusFilter={setStatusFilter}
			/>

			{/* Trainers Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Icon icon="solar:users-group-two-rounded-bold-duotone" />
						Trainers ({filteredTrainers.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Trainer</TableHead>
									<TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("status")}>
										<div className="flex items-center gap-1">
											Status
											<Icon icon={getSortIcon("status")} className="h-4 w-4" />
										</div>
									</TableHead>
									<TableHead>Role</TableHead>
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
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center py-8">
											<Icon icon="solar:refresh-bold-duotone" className="h-6 w-6 animate-spin mx-auto mb-2" />
											Loading trainers...
										</TableCell>
									</TableRow>
								) : error ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center py-8">
											<Icon icon="solar:danger-circle-bold-duotone" className="h-12 w-12 text-red-500 mx-auto mb-4" />
											<h3 className="text-lg font-medium text-red-600">Failed to load trainers</h3>
											<p className="text-muted-foreground">Please try refreshing the page</p>
										</TableCell>
									</TableRow>
								) : filteredTrainers.length === 0 ? (
									<TableRow>
										<TableCell colSpan={5}>
											<div className="text-center py-8">
												<Icon
													icon="solar:users-group-two-rounded-bold-duotone"
													className="h-12 w-12 text-muted-foreground mx-auto mb-4"
												/>
												<h3 className="text-lg font-medium">No trainers found</h3>
												<p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
											</div>
										</TableCell>
									</TableRow>
								) : (
									filteredTrainers.map((trainer) => (
										<TrainerRow
											key={trainer._id}
											trainer={trainer}
											onToggleStatus={handleToggleStatus}
										/>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
