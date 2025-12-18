import userService from "@/api/services/userService";
import { Icon } from "@/components/icon";
import type { Client } from "@/types/entity";
import { Avatar } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { getImageUrl } from "@/utils";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";

export default function TraineeDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [client, setClient] = useState<Client | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchClientData = async () => {
			if (!id) {
				setError("No client ID provided");
				setLoading(false);
				return;
			}

			try {
				console.log("🔵 Fetching client with ID:", id);
				const clientData = await userService.getClientById(id);
				setClient(clientData.data);
				setError(null);
			} catch (err) {
				console.error("❌ Failed to fetch client data:", err);
				setError("Failed to load client data");
				setClient(null);
			} finally {
				setLoading(false);
			}
		};

		fetchClientData();
	}, [id]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
					<p>Loading client details...</p>
				</div>
			</div>
		);
	}

	if (error || !client) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<Icon
						icon="solar:users-group-rounded-bold-duotone"
						className="h-12 w-12 mx-auto mb-4 text-muted-foreground"
					/>
					<h3 className="text-lg font-medium">Client not found</h3>
					<p className="text-muted-foreground mb-4">{error || "The client you're looking for doesn't exist."}</p>
					<Button onClick={() => navigate(-1)}>
						<Icon icon="solar:arrow-left-bold-duotone" className="h-4 w-4 mr-2" />
						Back to Users
					</Button>
				</div>
			</div>
		);
	}

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

	const getGenderIcon = (gender?: string) => {
		switch (gender) {
			case "male":
				return "solar:men-bold-duotone";
			case "female":
				return "solar:women-bold-duotone";
			default:
				return "solar:user-bold-duotone";
		}
	};

	return (
		<div className="flex flex-col gap-6 p-6">
			<Helmet>
				<title>{`${client.first_name}` || "Client"} - Client Details</title>
			</Helmet>

			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="outline" onClick={() => navigate("/users")}>
						<Icon icon="solar:arrow-left-bold-duotone" className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold text-foreground">Client Details</h1>
						<p className="text-muted-foreground">View and manage client information</p>
					</div>
				</div>
			</div>

			{/* Main Information */}
			<div className="space-y-6">
				{/* Basic Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Icon icon="solar:user-bold-duotone" />
							Basic Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex items-start gap-4">
							<Avatar className="h-20 w-20">
								<img src={getImageUrl(client.avatar)} alt={client.name || "Client"} className="object-cover" />
							</Avatar>
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<h2 className="text-2xl font-bold">
										{`${client.first_name} ${client.last_name}` || "Unknown Client"}
									</h2>
									{getStatusBadge(client.status || "inactive")}
								</div>
								<div className="grid gap-3 md:grid-cols-2">
									<div className="flex items-center gap-2 text-muted-foreground">
										<Icon icon="solar:letter-bold-duotone" className="h-4 w-4" />
										<span>{client.email || "No email"}</span>
									</div>
									{client.phone && (
										<div className="flex items-center gap-2 text-muted-foreground">
											<Icon icon="solar:phone-bold-duotone" className="h-4 w-4" />
											<span>{client.phone}</span>
										</div>
									)}
									{client.gender && (
										<div className="flex items-center gap-2 text-muted-foreground">
											<Icon icon={getGenderIcon(client.gender)} className="h-4 w-4" />
											<span className="capitalize">{client.gender}</span>
										</div>
									)}
									<div className="flex items-center gap-2 text-muted-foreground">
										<Icon icon="solar:calendar-bold-duotone" className="h-4 w-4" />
										<span>
											Joined {client.createdAt ? format(new Date(client.createdAt), "MMM dd, yyyy") : "Unknown"}
										</span>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Trainer Information */}
				{client.trainer && typeof client.trainer === "object" && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Icon icon="solar:user-check-bold-duotone" />
								Assigned Trainer
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-3">
								<Avatar className="h-12 w-12">
									<img
										src={getImageUrl(client.trainer.avatar)}
										alt={`${client.trainer.first_name} ${client.trainer.last_name}`}
										className="object-cover"
									/>
								</Avatar>
								<div className="flex-1">
									<h3 className="font-semibold">
										{client.trainer.first_name} {client.trainer.last_name}
									</h3>
									<p className="text-sm text-muted-foreground">{client.trainer.role?.name || "Personal Trainer"}</p>
									<p className="text-xs text-muted-foreground">{client.trainer.email}</p>
								</div>
								<div className="ml-auto">
									<Button variant="outline" size="sm" onClick={() => navigate(`/users/trainer/${client.trainer._id}`)}>
										<Icon icon="solar:eye-bold-duotone" className="h-4 w-4 mr-2" />
										View Trainer
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Current Program */}
				{client.currentProgram && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Icon icon="solar:clipboard-list-bold-duotone" />
								Current Program
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex items-center gap-3">
								<Icon icon="solar:dumbbell-small-bold-duotone" className="h-10 w-10 text-primary" />
								<div>
									<h3 className="font-semibold">{client.currentProgram}</h3>
									<p className="text-sm text-muted-foreground">Active fitness program</p>
								</div>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
