import { Icon } from "@/components/icon";
import { Card } from "@/ui/card";

export function DashboardHeader() {
	return (
		<Card className="relative overflow-hidden">
			<div className="relative p-6 md:p-8">
				{/* Background Pattern/Gradient */}
				<div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
				
				{/* Content */}
				<div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					{/* Left Section - Welcome Message */}
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<div className="p-2 bg-primary/10 rounded-lg">
								<Icon 
									icon="solar:dumbbell-large-minimalistic-bold-duotone" 
									className="h-8 w-8 text-primary"
								/>
							</div>
							<div>
								<h1 className="text-2xl md:text-3xl font-bold text-foreground">
									Fitness Solutions Admin
								</h1>
								<p className="text-sm text-muted-foreground">
									Manage your fitness platform with ease
								</p>
							</div>
						</div>
					</div>

					{/* Right Section - Quick Stats */}
					<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
						<div className="p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50">
							<div className="flex items-center gap-2 mb-1">
								<Icon icon="solar:users-group-rounded-bold-duotone" className="h-4 w-4 text-primary" />
								<span className="text-xs font-medium text-muted-foreground">Total Users</span>
							</div>
							<p className="text-2xl font-bold text-foreground">1,250</p>
						</div>

						<div className="p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50">
							<div className="flex items-center gap-2 mb-1">
								<Icon icon="solar:calendar-bold-duotone" className="h-4 w-4 text-primary" />
								<span className="text-xs font-medium text-muted-foreground">Programs</span>
							</div>
							<p className="text-2xl font-bold text-foreground">85</p>
						</div>

						<div className="hidden md:block p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50">
							<div className="flex items-center gap-2 mb-1">
								<Icon icon="solar:check-circle-bold-duotone" className="h-4 w-4 text-green-500" />
								<span className="text-xs font-medium text-muted-foreground">Active</span>
							</div>
							<p className="text-2xl font-bold text-foreground">938</p>
						</div>
					</div>
				</div>

				{/* Decorative Elements */}
				<div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
				<div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" />
			</div>
		</Card>
	);
}
