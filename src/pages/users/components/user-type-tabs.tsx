import { useState } from "react";
import { useNavigate } from "react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Avatar } from "@/ui/avatar";
import { Icon } from "@/components/icon";
import { mockTrainers, mockTrainees, type Trainer, type Trainee } from "@/mocks/users";
import { format } from "date-fns";

interface TrainerCardProps {
	trainer: Trainer;
	onViewDetails: (id: string) => void;
	onToggleStatus: (id: string, currentStatus: string) => void;
}

const TrainerCard = ({ trainer, onViewDetails, onToggleStatus }: TrainerCardProps) => (
	<Card className="transition-all duration-200 hover:shadow-md">
		<CardContent className="p-6">
			<div className="flex items-start gap-4">
				<Avatar className="h-12 w-12">
					<img 
						src={trainer.avatar || "/src/assets/images/avatars/avatar-1.png"} 
						alt={trainer.name}
						className="object-cover"
					/>
				</Avatar>
				
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<div>
							<h3 className="font-semibold text-foreground">{trainer.name}</h3>
							<p className="text-sm text-muted-foreground">{trainer.email}</p>
							<p className="text-sm text-muted-foreground">{trainer.signupDetails.location}</p>
						</div>
						
						<Badge 
							variant={trainer.status === 'active' ? 'default' : trainer.status === 'suspended' ? 'destructive' : 'secondary'}
							className="shrink-0"
						>
							{trainer.status}
						</Badge>
					</div>
					
					<div className="mt-3 grid grid-cols-2 gap-4 text-sm">
						<div className="flex items-center gap-2">
							<Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-4 w-4 text-muted-foreground" />
							<span>{trainer.traineesCount} trainees</span>
						</div>
						<div className="flex items-center gap-2">
							<Icon icon="solar:crown-bold-duotone" className="h-4 w-4 text-muted-foreground" />
							<span className="capitalize">{trainer.subscription.plan}</span>
						</div>
						<div className="flex items-center gap-2">
							<Icon icon="solar:calendar-bold-duotone" className="h-4 w-4 text-muted-foreground" />
							<span>Joined {format(new Date(trainer.createdAt), 'MMM yyyy')}</span>
						</div>
						<div className="flex items-center gap-2">
							<Icon icon="solar:dollar-bold-duotone" className="h-4 w-4 text-muted-foreground" />
							<span>${trainer.totalRevenue}</span>
						</div>
					</div>
					
					<div className="mt-4 flex gap-2">
						<Button 
							variant="outline" 
							size="sm"
							onClick={() => onViewDetails(trainer.id)}
						>
							<Icon icon="solar:eye-bold-duotone" className="h-4 w-4 mr-1" />
							View Details
						</Button>
						<Button 
							variant={trainer.status === 'suspended' ? 'default' : 'destructive'}
							size="sm"
							onClick={() => onToggleStatus(trainer.id, trainer.status)}
						>
							<Icon 
								icon={trainer.status === 'suspended' ? "solar:play-bold-duotone" : "solar:pause-bold-duotone"} 
								className="h-4 w-4 mr-1" 
							/>
							{trainer.status === 'suspended' ? 'Activate' : 'Suspend'}
						</Button>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
);

interface TraineeCardProps {
	trainee: Trainee;
	onViewDetails: (id: string) => void;
}

const TraineeCard = ({ trainee, onViewDetails }: TraineeCardProps) => (
	<Card className="transition-all duration-200 hover:shadow-md">
		<CardContent className="p-6">
			<div className="flex items-start gap-4">
				<Avatar className="h-12 w-12">
					<img 
						src={trainee.avatar || "/src/assets/images/avatars/avatar-4.png"} 
						alt={trainee.name}
						className="object-cover"
					/>
				</Avatar>
				
				<div className="flex-1 min-w-0">
					<div className="flex items-start justify-between gap-2">
						<div>
							<h3 className="font-semibold text-foreground">{trainee.name}</h3>
							<p className="text-sm text-muted-foreground">{trainee.email}</p>
							<p className="text-sm text-muted-foreground">Under {trainee.trainerName}</p>
						</div>
						
						<Badge 
							variant={trainee.status === 'active' ? 'default' : 'secondary'}
							className="shrink-0"
						>
							{trainee.status}
						</Badge>
					</div>
					
					<div className="mt-3 grid grid-cols-2 gap-4 text-sm">
						<div className="flex items-center gap-2">
							<Icon icon="solar:clipboard-list-bold-duotone" className="h-4 w-4 text-muted-foreground" />
							<span>{trainee.programsEnrolled} programs</span>
						</div>
						<div className="flex items-center gap-2">
							<Icon icon="solar:fire-bold-duotone" className="h-4 w-4 text-muted-foreground" />
							<span>{trainee.completedWorkouts} workouts</span>
						</div>
						<div className="flex items-center gap-2">
							<Icon icon="solar:calendar-bold-duotone" className="h-4 w-4 text-muted-foreground" />
							<span>Joined {format(new Date(trainee.createdAt), 'MMM yyyy')}</span>
						</div>
						<div className="flex items-center gap-2">
							<Icon icon="solar:clock-circle-bold-duotone" className="h-4 w-4 text-muted-foreground" />
							<span>Active {format(new Date(trainee.lastActive), 'MMM dd')}</span>
						</div>
					</div>
					
					{trainee.currentProgram && (
						<div className="mt-3 p-2 bg-muted/50 rounded-md">
							<p className="text-sm font-medium">Current Program</p>
							<p className="text-sm text-muted-foreground">{trainee.currentProgram}</p>
						</div>
					)}
					
					<div className="mt-4">
						<Button 
							variant="outline" 
							size="sm"
							onClick={() => onViewDetails(trainee.id)}
						>
							<Icon icon="solar:eye-bold-duotone" className="h-4 w-4 mr-1" />
							View Details
						</Button>
					</div>
				</div>
			</div>
		</CardContent>
	</Card>
);

export default function UserTypeTabs() {
	const navigate = useNavigate();
	const [trainers] = useState(mockTrainers);
	const [trainees] = useState(mockTrainees);

	const handleViewTrainerDetails = (id: string) => {
		navigate(`/users/trainer/${id}`);
	};

	const handleViewTraineeDetails = (id: string) => {
		console.log('View trainee details:', id);
		// Navigate to trainee details page
	};

	const handleToggleTrainerStatus = (id: string, currentStatus: string) => {
		console.log('Toggle trainer status:', id, currentStatus);
		// API call to suspend/activate trainer
	};

	const activeTrainers = trainers.filter(t => t.status === 'active').length;
	const suspendedTrainers = trainers.filter(t => t.status === 'suspended').length;
	const activeTrainees = trainees.filter(t => t.status === 'active').length;
	const inactiveTrainees = trainees.filter(t => t.status === 'inactive').length;

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Users</h1>
					<p className="text-muted-foreground">Manage trainers and trainees</p>
				</div>
			</div>

			<Tabs defaultValue="trainers" className="w-full">
				<TabsList className="grid w-full max-w-md grid-cols-2">
					<TabsTrigger value="trainers" className="flex items-center gap-2">
						<Icon icon="solar:user-star-bold-duotone" className="h-4 w-4" />
						Trainers ({trainers.length})
					</TabsTrigger>
					<TabsTrigger value="trainees" className="flex items-center gap-2">
						<Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-4 w-4" />
						Trainees ({trainees.length})
					</TabsTrigger>
				</TabsList>

				<TabsContent value="trainers" className="space-y-4">
					{/* Stats Cards */}
					<div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">Total Trainers</CardTitle>
							</CardHeader>
							<CardContent className="pb-4">
								<div className="text-2xl font-bold">{trainers.length}</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
							</CardHeader>
							<CardContent className="pb-4">
								<div className="text-2xl font-bold text-green-600">{activeTrainers}</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">Suspended</CardTitle>
							</CardHeader>
							<CardContent className="pb-4">
								<div className="text-2xl font-bold text-red-600">{suspendedTrainers}</div>
							</CardContent>
						</Card>
					</div>

					{/* Trainers List */}
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
						{trainers.map((trainer) => (
							<TrainerCard 
								key={trainer.id}
								trainer={trainer}
								onViewDetails={handleViewTrainerDetails}
								onToggleStatus={handleToggleTrainerStatus}
							/>
						))}
					</div>
				</TabsContent>

				<TabsContent value="trainees" className="space-y-4">
					{/* Stats Cards */}
					<div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">Total Trainees</CardTitle>
							</CardHeader>
							<CardContent className="pb-4">
								<div className="text-2xl font-bold">{trainees.length}</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
							</CardHeader>
							<CardContent className="pb-4">
								<div className="text-2xl font-bold text-green-600">{activeTrainees}</div>
							</CardContent>
						</Card>
						<Card>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">Inactive</CardTitle>
							</CardHeader>
							<CardContent className="pb-4">
								<div className="text-2xl font-bold text-gray-600">{inactiveTrainees}</div>
							</CardContent>
						</Card>
					</div>

					{/* Trainees List */}
					<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
						{trainees.map((trainee) => (
							<TraineeCard 
								key={trainee.id}
								trainee={trainee}
								onViewDetails={handleViewTraineeDetails}
							/>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}