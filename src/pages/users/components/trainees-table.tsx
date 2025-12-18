import { Icon } from "@/components/icon";
import type { Client } from "@/types/entity";
import { Avatar } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router";

interface TraineesTableProps {
	trainees: Client[];
	onAddTrainee?: () => void;
	showAddButton?: boolean;
	onStatusUpdate?: (clientId: string, status: "active" | "suspended") => void;
}

export default function TraineesTable({ trainees, onAddTrainee, showAddButton = false }: TraineesTableProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState<keyof Client>("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
	const navigate = useNavigate();

	console.log("Trainees from trainees-table--->", trainees);

	// Filter and sort trainees
	const filteredTrainees = trainees
		.filter((trainee) => {
			const fullName = `${trainee.first_name} ${trainee.last_name}`;
			const matchesSearch =
				fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				trainee.email.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus = statusFilter === "all" || trainee.status.toLowerCase() === statusFilter;
			return matchesSearch && matchesStatus;
		})
		.sort((a, b) => {
			let aValue = a[sortBy];
			let bValue = b[sortBy];

			// Handle date properties
			if (sortBy === "createdAt" || sortBy === "updatedAt") {
				aValue = new Date(a[sortBy]).getTime();
				bValue = new Date(b[sortBy]).getTime();
			}

			if (sortOrder === "asc") {
				return aValue > bValue ? 1 : -1;
			} else {
				return aValue < bValue ? 1 : -1;
			}
		});

	const handleSort = (column: keyof Client) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(column);
			setSortOrder("asc");
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status.toLowerCase()) {
			case "active":
				return <Badge variant="default">Active</Badge>;
			case "suspended":
				return <Badge variant="destructive">Suspended</Badge>;
			case "in_progress":
				return <Badge variant="outline">In Progress</Badge>;
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	const getSortIcon = (column: keyof Client) => {
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
								<SelectItem value="in_progress">In Progress</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="suspended">Suspended</SelectItem>
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
						Clients ({filteredTrainees.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Client Info</TableHead>
									<TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("status")}>
										<div className="flex items-center gap-1">
											Status
											<Icon icon={getSortIcon("status")} className="h-4 w-4" />
										</div>
									</TableHead>
									<TableHead>Weight Progress</TableHead>
									<TableHead>Contact</TableHead>
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
								{filteredTrainees.map((trainee) => {
									console.log("🔵 TraineesTable - Processing trainee:", {
										id: trainee._id,
										name: `${trainee.first_name} ${trainee.last_name}`,
										email: trainee.email,
										status: trainee.status,
									});
									const fullName = `${trainee.first_name} ${trainee.last_name}`;
									return (
										<TableRow key={trainee._id} className="hover:bg-muted/50">
											<TableCell>
												<div className="flex items-center gap-3">
													<Avatar className="h-10 w-10">
														<div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
															{(trainee.first_name?.charAt(0) || "U").toUpperCase()}
															{(trainee.last_name?.charAt(0) || "").toUpperCase()}
														</div>
													</Avatar>
													<div>
														<div className="font-medium">{fullName}</div>
														<div className="text-sm text-muted-foreground">{trainee.email}</div>
														{trainee.gender && (
															<div className="text-xs text-muted-foreground capitalize">{trainee.gender}</div>
														)}
													</div>
												</div>
											</TableCell>
											<TableCell>{getStatusBadge(trainee.status)}</TableCell>
											<TableCell>
												<div className="text-sm">
													<div>Start: {trainee.start_weight ? `${trainee.start_weight}kg` : "N/A"}</div>
													<div>Current: {trainee.current_weight ? `${trainee.current_weight}kg` : "N/A"}</div>
													<div>Target: {trainee.target_weight ? `${trainee.target_weight}kg` : "N/A"}</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="text-sm">
													{trainee.phone && <div>{trainee.phone}</div>}
													{/* {trainee.dob && (
														<div className="text-xs text-muted-foreground">
															Born: {format(new Date(trainee.dob), "MMM dd, yyyy")}
														</div>
													)} */}
												</div>
											</TableCell>
											<TableCell>
												<span className="text-sm">{format(new Date(trainee.createdAt), "MMM dd, yyyy")}</span>
											</TableCell>
											<TableCell className="text-right">
												<Button
													variant="outline"
													size="sm"
													onClick={() => navigate(`/users/trainee/${trainee._id}`)}
													title="View client details"
												>
													<Icon icon="solar:eye-bold-duotone" className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									);
								})}
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
