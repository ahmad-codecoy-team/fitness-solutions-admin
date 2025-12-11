import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Icon } from "@/components/icon";
import { Helmet } from "react-helmet-async";

export default function AboutUsPage() {
	return (
		<div className="flex flex-col gap-6 p-6">
			<Helmet>
				<title>About Us - Fitness Solutions Admin</title>
			</Helmet>

			{/* Header */}
			<div className="flex items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold text-foreground">About Us</h1>
					<p className="text-muted-foreground">Learn more about our fitness solutions platform</p>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Company Overview */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Icon icon="solar:buildings-bold-duotone" />
							Our Company
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<p className="text-muted-foreground">
							Welcome to Fitness Solutions - the premier platform connecting fitness trainers with their clients. 
							Our mission is to revolutionize the fitness industry by providing powerful tools that help trainers 
							manage their clients, programs, and progress tracking efficiently.
						</p>
						<p className="text-muted-foreground">
							Founded in 2024, we've grown to become a trusted partner for fitness professionals worldwide, 
							helping thousands of trainers deliver exceptional results to their clients.
						</p>
					</CardContent>
				</Card>

				{/* Platform Features */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Icon icon="solar:star-bold-duotone" />
							Platform Features
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-3">
							<div className="flex items-start gap-3">
								<Icon icon="solar:user-bold-duotone" className="h-5 w-5 text-primary mt-0.5" />
								<div>
									<h4 className="font-medium">Client Management</h4>
									<p className="text-sm text-muted-foreground">Comprehensive tools to manage client profiles and progress</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Icon icon="solar:dumbbell-small-bold-duotone" className="h-5 w-5 text-primary mt-0.5" />
								<div>
									<h4 className="font-medium">Program Creation</h4>
									<p className="text-sm text-muted-foreground">Build custom workout and nutrition programs</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<Icon icon="solar:chart-bold-duotone" className="h-5 w-5 text-primary mt-0.5" />
								<div>
									<h4 className="font-medium">Progress Tracking</h4>
									<p className="text-sm text-muted-foreground">Monitor client progress with detailed analytics</p>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Mission Statement */}
				<Card className="lg:col-span-2">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Icon icon="solar:target-bold-duotone" />
							Our Mission
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="bg-muted p-6 rounded-lg">
							<blockquote className="text-lg font-medium text-center italic">
								"To empower fitness professionals with innovative technology that enhances their ability to 
								transform lives through personalized fitness solutions."
							</blockquote>
						</div>
					</CardContent>
				</Card>

				{/* Statistics */}
				{/* <Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Icon icon="solar:graph-up-bold-duotone" />
							Platform Statistics
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div className="text-center p-3 bg-muted rounded-lg">
								<div className="text-2xl font-bold text-primary">500+</div>
								<div className="text-sm text-muted-foreground">Active Trainers</div>
							</div>
							<div className="text-center p-3 bg-muted rounded-lg">
								<div className="text-2xl font-bold text-primary">2,500+</div>
								<div className="text-sm text-muted-foreground">Happy Clients</div>
							</div>
							<div className="text-center p-3 bg-muted rounded-lg">
								<div className="text-2xl font-bold text-primary">15K+</div>
								<div className="text-sm text-muted-foreground">Workouts Created</div>
							</div>
							<div className="text-center p-3 bg-muted rounded-lg">
								<div className="text-2xl font-bold text-primary">98%</div>
								<div className="text-sm text-muted-foreground">Satisfaction Rate</div>
							</div>
						</div>
					</CardContent>
				</Card> */}

				{/* Contact Information */}
				{/* <Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Icon icon="solar:phone-bold-duotone" />
							Contact Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex items-center gap-3">
							<Icon icon="solar:letter-bold-duotone" className="h-5 w-5 text-primary" />
							<div>
								<div className="font-medium">Email</div>
								<div className="text-sm text-muted-foreground">support@fitnesssolutions.com</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Icon icon="solar:phone-bold-duotone" className="h-5 w-5 text-primary" />
							<div>
								<div className="font-medium">Phone</div>
								<div className="text-sm text-muted-foreground">+1 (555) 123-FITNESS</div>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Icon icon="solar:map-point-bold-duotone" className="h-5 w-5 text-primary" />
							<div>
								<div className="font-medium">Address</div>
								<div className="text-sm text-muted-foreground">
									123 Fitness Street<br />
									Health City, HC 12345<br />
									United States
								</div>
							</div>
						</div>
					</CardContent>
				</Card> */}
			</div>
		</div>
	);
}