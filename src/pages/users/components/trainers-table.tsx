import { useState } from "react";
import { useNavigate } from "react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Avatar } from "@/ui/avatar";
import { Icon } from "@/components/icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { mockTrainers, type Trainer } from "@/mocks/users";
import { format } from "date-fns";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

export default function TrainersTable() {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [sortBy, setSortBy] = useState<keyof Trainer>("createdAt");
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

	// Filter and sort trainers
	const filteredTrainers = mockTrainers
		.filter((trainer) => {
			const matchesSearch = 
				trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
				trainer.signupDetails.location.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesStatus = statusFilter === "all" || trainer.status === statusFilter;
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

	const handleToggleStatus = (trainerId: string, currentStatus: string) => {
		console.log("Toggle trainer status:", trainerId, currentStatus);
		// TODO: API call to suspend/activate trainer
	};

	const handleViewDetails = (trainerId: string) => {
		navigate(`/users/trainer/${trainerId}`);
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return <Badge variant="default">Active</Badge>;
			case "suspended":
				return <Badge variant="destructive">Suspended</Badge>;
			case "inactive":
				return <Badge variant="secondary">Inactive</Badge>;
			default:
				return <Badge variant="secondary">{status}</Badge>;
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
								placeholder="Search trainers by name, email, or location..."
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
								<SelectItem value="inactive">Inactive</SelectItem>
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
									<TableHead 
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => handleSort("status")}
									>
										<div className="flex items-center gap-1">
											Status
											<Icon icon={getSortIcon("status")} className="h-4 w-4" />
										</div>
									</TableHead>
									<TableHead 
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => handleSort("traineesCount")}
									>
										<div className="flex items-center gap-1">
											Trainees
											<Icon icon={getSortIcon("traineesCount")} className="h-4 w-4" />
										</div>
									</TableHead>
									<TableHead>Subscription</TableHead>
									<TableHead 
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => handleSort("totalRevenue")}
									>
										<div className="flex items-center gap-1">
											Revenue
											<Icon icon={getSortIcon("totalRevenue")} className="h-4 w-4" />
										</div>
									</TableHead>
									<TableHead 
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => handleSort("createdAt")}
									>
										<div className="flex items-center gap-1">
											Joined
											<Icon icon={getSortIcon("createdAt")} className="h-4 w-4" />
										</div>
									</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredTrainers.map((trainer) => (
									<TableRow key={trainer.id} className="hover:bg-muted/50">
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10">
													<img 
														src={trainer.avatar || "/src/assets/images/avatars/avatar-1.png"} 
														alt={trainer.name}
														className="object-cover"
													/>
												</Avatar>
												<div>
													<div className="font-medium">{trainer.name}</div>
													<div className="text-sm text-muted-foreground">{trainer.email}</div>
													<div className="text-xs text-muted-foreground">{trainer.signupDetails.location}</div>
												</div>
											</div>
										</TableCell>
										<TableCell>
											{getStatusBadge(trainer.status)}
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2">
												<Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-4 w-4 text-muted-foreground" />
												<span>{trainer.traineesCount}</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex flex-col gap-1">
												<Badge 
													variant={trainer.subscription.status === "active" ? "default" : "secondary"}
													className="w-fit text-xs capitalize"
												>
													{trainer.subscription.plan}
												</Badge>
												<span className="text-xs text-muted-foreground capitalize">
													{trainer.subscription.status}
												</span>
											</div>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-1">
												<Icon icon="solar:dollar-bold-duotone" className="h-4 w-4 text-muted-foreground" />
												<span className="font-medium">${trainer.totalRevenue.toLocaleString()}</span>
											</div>
										</TableCell>
										<TableCell>
											<span className="text-sm">
												{format(new Date(trainer.createdAt), 'MMM dd, yyyy')}
											</span>
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button 
													variant="outline" 
													size="sm"
													onClick={() => handleViewDetails(trainer.id)}
												>
													<Icon icon="solar:eye-bold-duotone" className="h-4 w-4" />
												</Button>
												<Button 
													variant={trainer.status === 'suspended' ? 'default' : 'destructive'}
													size="sm"
													onClick={() => handleToggleStatus(trainer.id, trainer.status)}
												>
													<Icon 
														icon={trainer.status === 'suspended' ? "solar:play-bold-duotone" : "solar:pause-bold-duotone"} 
														className="h-4 w-4" 
													/>
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
					
					{filteredTrainers.length === 0 && (
						<div className="text-center py-8">
							<Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
							<h3 className="text-lg font-medium">No trainers found</h3>
							<p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}