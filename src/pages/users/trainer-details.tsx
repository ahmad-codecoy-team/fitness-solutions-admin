import { Icon } from "@/components/icon";
import { mockTrainees, mockTrainers } from "@/mocks/users";
import { Avatar } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import TraineesTable from "./components/trainees-table";
import AddTraineeForm from "./components/add-trainee-form";

export default function TrainerDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [addTraineeDialogOpen, setAddTraineeDialogOpen] = useState(false);
	const [trainerTrainees, setTrainerTrainees] = useState(() => mockTrainees.filter((t) => t.trainerId === id));

	// Find trainer by ID
	const trainer = mockTrainers.find((t) => t.id === id);

	if (!trainer) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<h2 className="text-2xl font-semibold">Trainer Not Found</h2>
				<Button onClick={() => navigate("/users")}>Back to Users</Button>
			</div>
		);
	}

	const handleToggleStatus = () => {
		console.log("Toggle trainer status:", trainer.id);
		// API call to suspend/activate trainer
	};

	const handleTraineeAdded = (newTrainee: any) => {
		setTrainerTrainees((prev) => [...prev, newTrainee]);
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "active":
				return "default";
			case "suspended":
				return "destructive";
			case "inactive":
				return "secondary";
			default:
				return "secondary";
		}
	};

	return (
		<div className="flex flex-col gap-6 p-6">
			<Helmet>
				<title>{trainer.name} - Trainer Details - Fitness Solutions Admin</title>
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
								src={trainer.avatar || "/src/assets/images/avatars/avatar-1.png"}
								alt={trainer.name}
								className="object-cover"
							/>
						</Avatar>

						<div className="flex-1">
							<div className="flex items-start justify-between">
								<div>
									<h1 className="text-3xl font-bold text-foreground">{trainer.name}</h1>
									<p className="text-lg text-muted-foreground">{trainer.email}</p>
								</div>

								<div className="flex items-center gap-2">
									<Badge variant={getStatusColor(trainer.status) as any}>{trainer.status}</Badge>
									<Button
										variant={trainer.status === "suspended" ? "default" : "destructive"}
										size="sm"
										onClick={handleToggleStatus}
									>
										<Icon
											icon={trainer.status === "suspended" ? "solar:play-bold-duotone" : "solar:pause-bold-duotone"}
											className="h-4 w-4 mr-1"
										/>
										{trainer.status === "suspended" ? "Activate" : "Suspend"}
									</Button>
								</div>
							</div>

							<div className="mt-4 grid grid-cols-2 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Trainees</p>
									<p className="text-lg font-semibold">{trainer.traineesCount}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Joined</p>
									<p className="text-lg font-semibold">{format(new Date(trainer.createdAt), 'MMM dd, yyyy')}</p>
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
					<TabsTrigger value="trainees">Trainees</TabsTrigger>
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
										<p className="text-lg font-semibold">{trainer.signupDetails.firstName}</p>
									</div>
									<div>
										<span className="text-sm font-medium text-muted-foreground">Last Name</span>
										<p className="text-lg font-semibold">{trainer.signupDetails.lastName}</p>
									</div>
									<div>
										<span className="text-sm font-medium text-muted-foreground">Email</span>
										<p className="text-foreground">{trainer.email}</p>
									</div>
									<div>
										<span className="text-sm font-medium text-muted-foreground">Status</span>
										<Badge variant={getStatusColor(trainer.status) as any}>{trainer.status}</Badge>
									</div>
								</div>

								<div className="space-y-4">
									<div>
										<span className="text-sm font-medium text-muted-foreground">Joined Date</span>
										<p className="text-foreground">
											{format(new Date(trainer.createdAt), "MMM dd, yyyy")}
										</p>
									</div>
									<div>
										<span className="text-sm font-medium text-muted-foreground">Total Trainees</span>
										<p className="text-foreground">{trainer.traineesCount}</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Trainees Tab */}
				<TabsContent value="trainees" className="space-y-4">
					<TraineesTable
						trainees={trainerTrainees}
						onAddTrainee={() => setAddTraineeDialogOpen(true)}
						showAddButton={true}
					/>
				</TabsContent>
			</Tabs>

			{/* Add Trainee Dialog */}
			<AddTraineeForm
				open={addTraineeDialogOpen}
				onClose={() => setAddTraineeDialogOpen(false)}
				trainerId={trainer.id}
				trainerName={trainer.name}
				onTraineeAdded={handleTraineeAdded}
			/>
		</div>
	);
}