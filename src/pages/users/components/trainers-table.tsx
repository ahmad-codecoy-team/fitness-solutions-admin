import userService from "@/api/services/userService";
import { Icon } from "@/components/icon";
import type { Trainer } from "@/types/entity";
import { Avatar } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { getImageUrl } from "@/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function TrainersTable() {
	const navigate = useNavigate();
	const [trainers, setTrainers] = useState<Trainer[]>([]);
	const [loading, setLoading] = useState(true);

	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState<keyof Trainer>("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	// Fetch trainers from API
	useEffect(() => {
		const fetchTrainers = async () => {
			try {
				setLoading(true);
				const data = await userService.getAllTrainers();
				console.log("✅ Trainers fetched:", data);

				// Handle different API response formats
				if (data && data.data && Array.isArray(data.data) && data.meta) {
					// Paginated response with { data: [...], meta: {...} }
					console.log("📄 Paginated API response detected for trainers");
					setTrainers(data.data);
				} else if (Array.isArray(data)) {
					// Direct array response (fallback for non-paginated APIs)
					console.log("📄 Direct array response for trainers");
					setTrainers(data);
				} else {
					// Unexpected response format
					console.error("❌ Unexpected API response format:", data);
					setTrainers([]);
				}
			} catch (error: any) {
				toast.error("Failed to fetch trainers");
				console.error("Error fetching trainers:", error);
				setTrainers([]);
			} finally {
				setLoading(false);
			}
		};

		fetchTrainers();
	}, []);

	// Filter and sort trainers - ensure trainers is defined and is an array
	console.log("Trainers before filtering--->", trainers);
	const filteredTrainers = (trainers || [])
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

	const handleSort = (column: keyof Trainer) => {
		if (sortBy === column) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortBy(column);
			setSortOrder("asc");
		}
	};

	const getStatusBadge = (status?: string) => {
		// Handle missing status field for old users (show as 'active')
		const trainerStatus = status || "active";

		switch (trainerStatus) {
			case "active":
				return <Badge variant="default">Active</Badge>;
			case "suspended":
				return <Badge variant="destructive">Suspended</Badge>;
			default:
				return <Badge variant="default">Active</Badge>;
		}
	};

	const handleViewDetails = (trainerId: string) => {
		navigate(`/users/trainer/${trainerId}`);
	};

	const handleToggleStatus = async (trainerId: string, currentStatus: string) => {
		try {
			const newStatus = currentStatus === "suspended" ? "active" : "suspended";
			await userService.updateUserStatus(trainerId, { status: newStatus });

			// Update local state
			setTrainers((prev) =>
				prev.map((trainer) =>
					trainer._id === trainerId ? { ...trainer, status: newStatus as "active" | "suspended" } : trainer,
				),
			);

			toast.success(`Trainer status updated to ${newStatus}`);
		} catch (error: any) {
			toast.error(error?.response?.data?.message || "Failed to update status");
		}
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
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Filters</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<Input
								placeholder="Search trainers by name or email..."
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
								<SelectItem value="suspended">Suspended</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

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
								{loading ? (
									<TableRow>
										<TableCell colSpan={5} className="text-center py-8">
											<Icon icon="solar:refresh-bold-duotone" className="h-6 w-6 animate-spin mx-auto mb-2" />
											Loading trainers...
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
									filteredTrainers.map((trainer) => {
										const fullName = `${trainer.first_name} ${trainer.last_name}`;
										return (
											<TableRow key={trainer._id} className="hover:bg-muted/50">
												<TableCell>
													<div className="flex items-center gap-3">
														<Avatar className="h-10 w-10">
															{trainer.avatar ? (
																<img
																	src={getImageUrl(trainer.avatar)}
																	alt={trainer.first_name}
																	className="object-cover"
																/>
															) : (
																<div className="w-full h-full bg-linear-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-medium">
																	{trainer.first_name.charAt(0)}
																	{trainer.last_name.charAt(0)}
																</div>
															)}
														</Avatar>
														<div>
															<div className="font-medium">{fullName}</div>
															<div className="text-sm text-muted-foreground">{trainer.email}</div>
														</div>
													</div>
												</TableCell>
												<TableCell>{getStatusBadge(trainer.status)}</TableCell>
												<TableCell>
													<Badge variant="outline" className="text-xs">
														{trainer.role.name}
													</Badge>
												</TableCell>
												<TableCell>
													<span className="text-sm">{format(new Date(trainer.createdAt), "MMM dd, yyyy")}</span>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex justify-end gap-2">
														<Button variant="outline" size="sm" onClick={() => handleViewDetails(trainer._id)}>
															<Icon icon="solar:eye-bold-duotone" className="h-4 w-4" />
														</Button>
														<Button
															variant={trainer.status === "suspended" ? "default" : "destructive"}
															size="sm"
															onClick={() => handleToggleStatus(trainer._id, trainer.status)}
															className={
																trainer.status === "suspended" ? "bg-green-600 hover:bg-green-700 text-white" : ""
															}
														>
															{trainer.status === "suspended" ? (
																<Icon icon="solar:play-bold-duotone" className="h-4 w-4" />
															) : (
																<Icon icon="solar:pause-bold-duotone" className="h-4 w-4" />
															)}
														</Button>
													</div>
												</TableCell>
											</TableRow>
										);
									})
								)}
							</TableBody>
						</Table>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
