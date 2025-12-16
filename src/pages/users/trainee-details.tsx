import { Icon } from "@/components/icon";
import { mockTrainees } from "@/mocks/users";
import { Avatar } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";

export default function TraineeDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();

	// Find trainee by ID
	const trainee = mockTrainees.find((t) => t.id === id);

	if (!trainee) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<Icon
						icon="solar:users-group-rounded-bold-duotone"
						className="h-12 w-12 mx-auto mb-4 text-muted-foreground"
					/>
					<h3 className="text-lg font-medium">Trainee not found</h3>
					<p className="text-muted-foreground mb-4">The trainee you're looking for doesn't exist.</p>
					<Button onClick={() => navigate("/users")}>
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
				<title>{trainee.name} - Trainee Details</title>
			</Helmet>

			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="outline" onClick={() => navigate("/users")}>
						<Icon icon="solar:arrow-left-bold-duotone" className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold text-foreground">Trainee Details</h1>
						<p className="text-muted-foreground">View and manage trainee information</p>
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
								<img
									src={trainee.avatar || "/src/assets/images/avatars/avatar-4.png"}
									alt={trainee.name}
									className="object-cover"
								/>
							</Avatar>
							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<h2 className="text-2xl font-bold">{trainee.name}</h2>
									{getStatusBadge(trainee.status)}
								</div>
								<div className="grid gap-3 md:grid-cols-2">
									<div className="flex items-center gap-2 text-muted-foreground">
										<Icon icon="solar:letter-bold-duotone" className="h-4 w-4" />
										<span>{trainee.email}</span>
									</div>
									{trainee.phone && (
										<div className="flex items-center gap-2 text-muted-foreground">
											<Icon icon="solar:phone-bold-duotone" className="h-4 w-4" />
											<span>{trainee.phone}</span>
										</div>
									)}
									{trainee.gender && (
										<div className="flex items-center gap-2 text-muted-foreground">
											<Icon icon={getGenderIcon(trainee.gender)} className="h-4 w-4" />
											<span className="capitalize">{trainee.gender}</span>
										</div>
									)}
									<div className="flex items-center gap-2 text-muted-foreground">
										<Icon icon="solar:calendar-bold-duotone" className="h-4 w-4" />
										<span>Joined {format(new Date(trainee.createdAt), "MMM dd, yyyy")}</span>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Trainer Information */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Icon icon="solar:user-check-bold-duotone" />
							Assigned Trainer
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex items-center gap-3">
							<Icon icon="solar:user-bold-duotone" className="h-10 w-10 text-primary" />
							<div>
								<h3 className="font-semibold">{trainee.trainerName}</h3>
								<p className="text-sm text-muted-foreground">Personal Trainer</p>
							</div>
							<div className="ml-auto">
								<Button variant="outline" size="sm" onClick={() => navigate(`/users/trainer/${trainee.trainerId}`)}>
									<Icon icon="solar:eye-bold-duotone" className="h-4 w-4 mr-2" />
									View Trainer
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Current Program */}
				{trainee.currentProgram && (
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
									<h3 className="font-semibold">{trainee.currentProgram}</h3>
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
