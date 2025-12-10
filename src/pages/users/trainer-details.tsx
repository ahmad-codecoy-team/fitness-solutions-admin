import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Avatar } from "@/ui/avatar";
import { Icon } from "@/components/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";
import { mockTrainers, mockTrainees, type Trainer, type Trainee, type PaymentRecord } from "@/mocks/users";

export default function TrainerDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	
	// Find trainer by ID
	const trainer = mockTrainers.find(t => t.id === id);
	
	// Get trainees under this trainer
	const trainerTrainees = mockTrainees.filter(t => t.trainerId === id);
	
	if (!trainer) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<h2 className="text-2xl font-semibold">Trainer Not Found</h2>
				<Button onClick={() => navigate('/users')}>
					Back to Users
				</Button>
			</div>
		);
	}

	const handleToggleStatus = () => {
		console.log('Toggle trainer status:', trainer.id);
		// API call to suspend/activate trainer
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active': return 'default';
			case 'suspended': return 'destructive';
			case 'inactive': return 'secondary';
			default: return 'secondary';
		}
	};

	const getPaymentStatusColor = (status: string) => {
		switch (status) {
			case 'completed': return 'default';
			case 'pending': return 'secondary';
			case 'failed': return 'destructive';
			case 'refunded': return 'outline';
			default: return 'secondary';
		}
	};

	return (
		<div className="flex flex-col gap-6 p-6">
			<Helmet>
				<title>{trainer.name} - Trainer Details - Fitness Solutions Admin</title>
			</Helmet>

			{/* Header */}
			<div className="flex items-center gap-4">
				<Button 
					variant="ghost" 
					size="sm"
					onClick={() => navigate('/users')}
				>
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
									<p className="text-muted-foreground">{trainer.phone}</p>
									<p className="text-muted-foreground">{trainer.signupDetails.location}</p>
								</div>
								
								<div className="flex items-center gap-2">
									<Badge variant={getStatusColor(trainer.status) as any}>
										{trainer.status}
									</Badge>
									<Button 
										variant={trainer.status === 'suspended' ? 'default' : 'destructive'}
										onClick={handleToggleStatus}
									>
										<Icon 
											icon={trainer.status === 'suspended' ? "solar:play-bold-duotone" : "solar:pause-bold-duotone"} 
											className="h-4 w-4 mr-1" 
										/>
										{trainer.status === 'suspended' ? 'Activate' : 'Suspend'}
									</Button>
								</div>
							</div>
							
							<div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
								<div>
									<p className="text-sm text-muted-foreground">Trainees</p>
									<p className="text-lg font-semibold">{trainer.traineesCount}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Total Revenue</p>
									<p className="text-lg font-semibold">${trainer.totalRevenue}</p>
								</div>
								<div>
									<p className="text-sm text-muted-foreground">Plan</p>
									<p className="text-lg font-semibold capitalize">{trainer.subscription.plan}</p>
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
				<TabsList className="grid w-full max-w-2xl grid-cols-4">
					<TabsTrigger value="profile">Profile</TabsTrigger>
					<TabsTrigger value="subscription">Subscription</TabsTrigger>
					<TabsTrigger value="payments">Payments</TabsTrigger>
					<TabsTrigger value="trainees">Trainees</TabsTrigger>
				</TabsList>

				{/* Profile Tab */}
				<TabsContent value="profile" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Signup Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<label className="text-sm font-medium text-muted-foreground">First Name</label>
									<p className="text-foreground">{trainer.signupDetails.firstName}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">Last Name</label>
									<p className="text-foreground">{trainer.signupDetails.lastName}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
									<p className="text-foreground">{format(new Date(trainer.signupDetails.dateOfBirth), 'MMM dd, yyyy')}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">Gender</label>
									<p className="text-foreground capitalize">{trainer.signupDetails.gender}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">Experience</label>
									<p className="text-foreground">{trainer.signupDetails.experience}</p>
								</div>
								<div>
									<label className="text-sm font-medium text-muted-foreground">Location</label>
									<p className="text-foreground">{trainer.signupDetails.location}</p>
								</div>
							</div>
							
							<div>
								<label className="text-sm font-medium text-muted-foreground">Specializations</label>
								<div className="flex flex-wrap gap-2 mt-1">
									{trainer.signupDetails.specialization.map((spec) => (
										<Badge key={spec} variant="outline">{spec}</Badge>
									))}
								</div>
							</div>
							
							<div>
								<label className="text-sm font-medium text-muted-foreground">Certifications</label>
								<div className="flex flex-wrap gap-2 mt-1">
									{trainer.signupDetails.certification.map((cert) => (
										<Badge key={cert} variant="outline">{cert}</Badge>
									))}
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Subscription Tab */}
				<TabsContent value="subscription" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Subscription Information</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div className="space-y-4">
									<div>
										<label className="text-sm font-medium text-muted-foreground">Plan</label>
										<p className="text-lg font-semibold capitalize">{trainer.subscription.plan}</p>
									</div>
									<div>
										<label className="text-sm font-medium text-muted-foreground">Status</label>
										<Badge variant={trainer.subscription.status === 'active' ? 'default' : 'secondary'}>
											{trainer.subscription.status}
										</Badge>
									</div>
									<div>
										<label className="text-sm font-medium text-muted-foreground">Price</label>
										<p className="text-lg font-semibold">
											{trainer.subscription.price === 0 ? 'Free' : `$${trainer.subscription.price}/year`}
										</p>
									</div>
								</div>
								
								<div className="space-y-4">
									<div>
										<label className="text-sm font-medium text-muted-foreground">Start Date</label>
										<p className="text-foreground">{format(new Date(trainer.subscription.startDate), 'MMM dd, yyyy')}</p>
									</div>
									<div>
										<label className="text-sm font-medium text-muted-foreground">End Date</label>
										<p className="text-foreground">{format(new Date(trainer.subscription.endDate), 'MMM dd, yyyy')}</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				{/* Payments Tab */}
				<TabsContent value="payments" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Payment History</CardTitle>
						</CardHeader>
						<CardContent>
							{trainer.paymentHistory.length === 0 ? (
								<div className="text-center py-8 text-muted-foreground">
									<Icon icon="solar:card-bold-duotone" className="h-12 w-12 mx-auto mb-2 opacity-50" />
									<p>No payment history available</p>
								</div>
							) : (
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Date</TableHead>
											<TableHead>Description</TableHead>
											<TableHead>Amount</TableHead>
											<TableHead>Payment Method</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Transaction ID</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{trainer.paymentHistory.map((payment) => (
											<TableRow key={payment.id}>
												<TableCell>{format(new Date(payment.date), 'MMM dd, yyyy')}</TableCell>
												<TableCell>{payment.description}</TableCell>
												<TableCell className="font-medium">${payment.amount}</TableCell>
												<TableCell>{payment.paymentMethod}</TableCell>
												<TableCell>
													<Badge variant={getPaymentStatusColor(payment.status) as any}>
														{payment.status}
													</Badge>
												</TableCell>
												<TableCell className="font-mono text-sm">{payment.transactionId}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				{/* Trainees Tab */}
				<TabsContent value="trainees" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Trainees ({trainerTrainees.length})</CardTitle>
						</CardHeader>
						<CardContent>
							{trainerTrainees.length === 0 ? (
								<div className="text-center py-8 text-muted-foreground">
									<Icon icon="solar:users-group-two-rounded-bold-duotone" className="h-12 w-12 mx-auto mb-2 opacity-50" />
									<p>No trainees assigned to this trainer</p>
								</div>
							) : (
								<div className="grid gap-4">
									{trainerTrainees.map((trainee) => (
										<Card key={trainee.id}>
											<CardContent className="p-4">
												<div className="flex items-center gap-4">
													<Avatar className="h-10 w-10">
														<img 
															src={trainee.avatar || "/src/assets/images/avatars/avatar-4.png"} 
															alt={trainee.name}
															className="object-cover"
														/>
													</Avatar>
													
													<div className="flex-1">
														<div className="flex items-start justify-between">
															<div>
																<h4 className="font-semibold">{trainee.name}</h4>
																<p className="text-sm text-muted-foreground">{trainee.email}</p>
															</div>
															<Badge variant={trainee.status === 'active' ? 'default' : 'secondary'}>
																{trainee.status}
															</Badge>
														</div>
														
														<div className="mt-2 flex gap-4 text-sm text-muted-foreground">
															<span>{trainee.programsEnrolled} programs</span>
															<span>{trainee.completedWorkouts} workouts</span>
															<span>Last active {format(new Date(trainee.lastActive), 'MMM dd')}</span>
														</div>
														
														{trainee.currentProgram && (
															<div className="mt-2">
																<span className="text-sm font-medium">Current: </span>
																<span className="text-sm text-muted-foreground">{trainee.currentProgram}</span>
															</div>
														)}
													</div>
												</div>
											</CardContent>
										</Card>
									))}
								</div>
							)}
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}