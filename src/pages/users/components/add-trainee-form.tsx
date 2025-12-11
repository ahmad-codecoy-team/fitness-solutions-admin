import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Icon } from "@/components/icon";
import { toast } from "sonner";

interface AddTraineeFormProps {
	open: boolean;
	onClose: () => void;
	trainerId: string;
	trainerName: string;
	onTraineeAdded?: (trainee: any) => void;
}

interface TraineeFormData {
	name: string;
	email: string;
	phone: string;
	gender: "male" | "female" | "other" | "";
	dateOfBirth: string;
	fitnessLevel: "beginner" | "intermediate" | "advanced" | "";
	goals: string;
	medicalConditions: string;
	emergencyContact: string;
	emergencyPhone: string;
}

export default function AddTraineeForm({ open, onClose, trainerId, trainerName, onTraineeAdded }: AddTraineeFormProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formData, setFormData] = useState<TraineeFormData>({
		name: "",
		email: "",
		phone: "",
		gender: "",
		dateOfBirth: "",
		fitnessLevel: "",
		goals: "",
		medicalConditions: "",
		emergencyContact: "",
		emergencyPhone: "",
	});

	const handleInputChange = (field: keyof TraineeFormData, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		// Basic validation
		if (!formData.name || !formData.email) {
			toast.error("Name and email are required");
			return;
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(formData.email)) {
			toast.error("Please enter a valid email address");
			return;
		}

		setIsSubmitting(true);

		try {
			// TODO: Replace with actual API call
			const newTrainee = {
				id: `trainee-${Date.now()}`,
				name: formData.name,
				email: formData.email,
				phone: formData.phone || undefined,
				avatar: undefined,
				status: "active" as const,
				trainerId,
				trainerName,
				createdAt: new Date().toISOString(),
				lastActive: new Date().toISOString(),
				programsEnrolled: 0,
				completedWorkouts: 0,
				currentProgram: undefined,
				// Additional fields for the form
				gender: formData.gender || undefined,
				dateOfBirth: formData.dateOfBirth || undefined,
				fitnessLevel: formData.fitnessLevel || undefined,
				goals: formData.goals || undefined,
				medicalConditions: formData.medicalConditions || undefined,
				emergencyContact: formData.emergencyContact || undefined,
				emergencyPhone: formData.emergencyPhone || undefined,
			};

			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 1000));

			toast.success("Trainee added successfully!");
			
			// Call the callback if provided
			onTraineeAdded?.(newTrainee);
			
			// Reset form
			setFormData({
				name: "",
				email: "",
				phone: "",
				gender: "",
				dateOfBirth: "",
				fitnessLevel: "",
				goals: "",
				medicalConditions: "",
				emergencyContact: "",
				emergencyPhone: "",
			});
			
			onClose();
		} catch (error) {
			console.error("Error adding trainee:", error);
			toast.error("Failed to add trainee. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		if (!isSubmitting) {
			onClose();
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Icon icon="solar:user-plus-bold-duotone" />
						Add New Trainee
					</DialogTitle>
					<DialogDescription>
						Add a new trainee under {trainerName}. Fill in the required information below.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Basic Information */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Basic Information</h3>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="name">Full Name *</Label>
								<Input
									id="name"
									type="text"
									value={formData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									placeholder="Enter full name"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email Address *</Label>
								<Input
									id="email"
									type="email"
									value={formData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									placeholder="Enter email address"
									required
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phone">Phone Number</Label>
								<Input
									id="phone"
									type="tel"
									value={formData.phone}
									onChange={(e) => handleInputChange("phone", e.target.value)}
									placeholder="Enter phone number"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="gender">Gender</Label>
								<Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
									<SelectTrigger>
										<SelectValue placeholder="Select gender" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="male">Male</SelectItem>
										<SelectItem value="female">Female</SelectItem>
										<SelectItem value="other">Other</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="dateOfBirth">Date of Birth</Label>
								<Input
									id="dateOfBirth"
									type="date"
									value={formData.dateOfBirth}
									onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="fitnessLevel">Fitness Level</Label>
								<Select value={formData.fitnessLevel} onValueChange={(value) => handleInputChange("fitnessLevel", value)}>
									<SelectTrigger>
										<SelectValue placeholder="Select fitness level" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="beginner">Beginner</SelectItem>
										<SelectItem value="intermediate">Intermediate</SelectItem>
										<SelectItem value="advanced">Advanced</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="goals">Fitness Goals</Label>
							<Input
								id="goals"
								type="text"
								value={formData.goals}
								onChange={(e) => handleInputChange("goals", e.target.value)}
								placeholder="e.g., Weight loss, Muscle gain, General fitness"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="medicalConditions">Medical Conditions / Notes</Label>
							<Input
								id="medicalConditions"
								type="text"
								value={formData.medicalConditions}
								onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
								placeholder="Any medical conditions or special considerations"
							/>
						</div>
					</div>

					{/* Emergency Contact */}
					<div className="space-y-4">
						<h3 className="text-lg font-semibold">Emergency Contact</h3>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="emergencyContact">Emergency Contact Name</Label>
								<Input
									id="emergencyContact"
									type="text"
									value={formData.emergencyContact}
									onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
									placeholder="Enter emergency contact name"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
								<Input
									id="emergencyPhone"
									type="tel"
									value={formData.emergencyPhone}
									onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
									placeholder="Enter emergency contact phone"
								/>
							</div>
						</div>
					</div>

					{/* Form Actions */}
					<div className="flex justify-end gap-3 pt-4 border-t">
						<Button 
							type="button" 
							variant="outline" 
							onClick={handleClose}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button 
							type="submit" 
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<>
									<Icon icon="solar:loading-bold-duotone" className="h-4 w-4 mr-2 animate-spin" />
									Adding Trainee...
								</>
							) : (
								<>
									<Icon icon="solar:user-plus-bold-duotone" className="h-4 w-4 mr-2" />
									Add Trainee
								</>
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}