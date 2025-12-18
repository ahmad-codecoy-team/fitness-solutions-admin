import userService from "@/api/services/userService";
import { Icon } from "@/components/icon";
import { getImageUrl } from "@/utils";

// API Response Types (matching actual API structure)
interface ApiTrainer {
	_id: string;
	first_name: string;
	last_name: string;
	avatar: string;
	email: string;
	role: {
		_id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
		__v: number;
	};
	status: string; // "active" | "suspended"
	createdAt: string;
	updatedAt: string;
	__v: number;
}

interface ApiClient {
	_id: string;
	first_name: string;
	last_name: string;
	dob: string | null;
	email: string;
	trainer: string | ApiTrainer; // Can be ID or populated object
	phone: string;
	gender: string;
	start_weight: number;
	current_weight: number;
	target_weight: number;
	signature: string;
	status: string;
	attachments: Array<{ title: string; file: string }>;
	questions: Array<any>;
	createdAt: string;
	updatedAt: string;
	__v: number;
}
import { Avatar } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import AddTraineeForm from "./components/add-trainee-form";
import TraineesTable from "./components/trainees-table";

export default function TrainerDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [addTraineeDialogOpen, setAddTraineeDialogOpen] = useState(false);
	const [trainer, setTrainer] = useState<ApiTrainer | null>(null);
	const [trainerClients, setTrainerClients] = useState<ApiClient[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchTrainerData = async () => {
			if (!id) {
				setError("No trainer ID provided");
				setLoading(false);
				return;
			}

			try {
				console.log("🔵 Fetching trainer with ID:", id);

				// Fetch trainer details and their clients
				const [trainerData, clientsData] = await Promise.all([
					userService.getTrainerById(id),
					userService.getClientsByTrainerId(id),
				]);

				console.log("✅ Trainer data received:", trainerData);
				console.log("✅ Clients data received:", clientsData);

				setTrainer(trainerData as ApiTrainer);
				setTrainerClients(clientsData as ApiClient[]);
				setError(null);
			} catch (err) {
				console.error("❌ Failed to fetch trainer data:", err);
				setError("Failed to load trainer data");
				setTrainer(null);
			} finally {
				setLoading(false);
			}
		};

		fetchTrainerData();
	}, [id]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
					<p>Loading trainer details...</p>
				</div>
			</div>
		);
	}

	if (error || !trainer) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<Icon icon="solar:user-cross-bold-duotone" className="h-12 w-12 text-destructive" />
				<h2 className="text-2xl font-semibold">Trainer Not Found</h2>
				<p className="text-muted-foreground">{error || "The trainer you're looking for doesn't exist."}</p>
				<Button onClick={() => navigate("/users")}>
					<Icon icon="solar:arrow-left-bold-duotone" className="h-4 w-4 mr-2" />
					Back to Users
				</Button>
			</div>
		);
	}

	const handleToggleStatus = () => {
		// console.log("Toggle trainer status:", trainer.id);
		// API call to suspend/activate trainer
	};

	const handleTraineeAdded = (newTrainee: any) => {
		setTrainerClients((prev) => [...prev, newTrainee]);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "default";
			case "inactive":
				return "secondary";
			default:
				return "secondary";
		}
	};

	return (
		<div className="flex flex-col gap-6 p-6">
			<Helmet>
				<title>
					{trainer.first_name} {trainer.last_name} - Trainer Details - Fitness Solutions Admin
				</title>
			</Helmet>

			{/* Header */}
			<div className="flex items-center gap-4">
				<Button variant="ghost" size="sm" onClick={() => navigate("/users")}>
					<Icon icon="solar:arrow-left-bold-duotone" className="h-4 w-4 mr-1" />
					Back to Users
				</Button>
			</div>

			{/* Trainer Info Card */}
			<Card>
				<CardContent className="p-6">
					<div className="flex items-start gap-6">
						<Avatar className="h-20 w-20">
							<img
								src={getImageUrl(trainer.avatar)}
								alt={`${trainer.first_name} ${trainer.last_name}`}
								className="object-cover"
							/>
						</Avatar>

						<div className="flex-1">
							<div className="flex items-start justify-between">
								<div>
									<h1 className="text-3xl font-bold text-foreground">
										{trainer.first_name} {trainer.last_name}
									</h1>
									<p className="text-lg text-muted-foreground">{trainer.email}</p>
								</div>

								<div className="flex items-center gap-2">
									<Badge variant={getStatusColor(trainer.status || "active") as any}>
										{trainer.status || "active"}
									</Badge>
									<Button
										variant={trainer.status === "inactive" ? "default" : "destructive"}
										size="sm"
										onClick={handleToggleStatus}
									>
										<Icon
											icon={trainer.status === "inactive" ? "solar:play-bold-duotone" : "solar:pause-bold-duotone"}
											className="h-4 w-4 mr-1"
										/>
										{trainer.status === "inactive" ? "Activate" : "Deactivate"}
									</Button>
								</div>
							</div>

							<div className="mt-4 grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Clients</p>
									<p className="text-lg font-semibold">{trainerClients.length}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Joined</p>
									<p className="text-lg font-semibold">{format(new Date(trainer.createdAt), "MMM dd, yyyy")}</p>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Tabs Section */}
			<Tabs defaultValue="profile" className="w-full">
				<TabsList className="grid w-full max-w-lg grid-cols-2">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					{/* <TabsTrigger value=\"trainees\">Clients ({trainerClients.length})</TabsTrigger> */}
					<TabsTrigger value="trainees">Clients ({trainerClients.length})</TabsTrigger>
				</TabsList>

				{/* Profile Tab */}
				<TabsContent value="profile" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Personal Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div>
										<span className="text-sm font-medium text-muted-foreground">First Name</span>
										<p className="text-lg font-semibold">{trainer.first_name}</p>
									</div>
									<div>
										<span className="text-sm font-medium text-muted-foreground">Last Name</span>
										<p className="text-lg font-semibold">{trainer.last_name}</p>
									</div>
									<div>
										<span className="text-sm font-medium text-muted-foreground">Email</span>
										<p className="text-foreground">{trainer.email}</p>
									</div>
									<div className="flex gap-1">
										<span className="text-sm font-medium text-muted-foreground">Status</span>
										<Badge variant={getStatusColor(trainer.status || "active") as any}>
											{trainer.status || "active"}
										</Badge>
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<span className="text-sm font-medium text-muted-foreground">Joined Date</span>
										<p className="text-foreground">{format(new Date(trainer.createdAt), "MMM dd, yyyy")}</p>
									</div>
									<div>
										<span className="text-sm font-medium text-muted-foreground">Total Clients</span>
										<p className="text-foreground">{trainerClients.length}</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Clients Tab */}
				<TabsContent value="trainees" className="space-y-4">
					<TraineesTable
						trainees={trainerClients}
						onAddTrainee={() => setAddTraineeDialogOpen(true)}
						showAddButton={false}
					/>
				</TabsContent>
			</Tabs>

			{/* Add Trainee Dialog */}
			<AddTraineeForm
				open={addTraineeDialogOpen}
				onClose={() => setAddTraineeDialogOpen(false)}
				trainerId={trainer._id}
				trainerName={`${trainer.first_name} ${trainer.last_name}`}
				onTraineeAdded={handleTraineeAdded}
			/>
		</div>
	);
}
