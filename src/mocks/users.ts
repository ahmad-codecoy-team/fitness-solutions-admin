export interface Trainer {
	id: string;
	name: string;
	email: string;
	avatar?: string;
	status: "active" | "suspended" | "inactive";
	createdAt: string;
	traineesCount: number;
	signupDetails: {
		firstName: string;
		lastName: string;
	};
}

export interface Trainee {
	id: string;
	name: string;
	email: string;
	phone?: string;
	avatar?: string;
	status: "active" | "inactive" | "in_progress";
	trainerId: string;
	trainerName: string;
	createdAt: string;
	programsEnrolled: number;
	completedWorkouts: number;
	currentProgram?: string;
	gender?: "male" | "female" | "other";
}

export interface PaymentRecord {
	id: string;
	amount: number;
	currency: string;
	status: "completed" | "pending" | "failed" | "refunded";
	date: string;
	description: string;
	paymentMethod: string;
	transactionId: string;
}

export const mockTrainers: Trainer[] = [
	{
		id: "tr-001",
		name: "John Smith",
		email: "john.smith@example.com",
		avatar: "/avatar-1.png",
		status: "active",
		createdAt: "2024-01-15T10:30:00Z",
		traineesCount: 15,
		signupDetails: {
			firstName: "John",
			lastName: "Smith",
		},
	},
	{
		id: "tr-002",
		name: "Sarah Johnson",
		email: "sarah.johnson@example.com",
		avatar: "/avatar-2.png",
		status: "active",
		createdAt: "2024-02-10T14:15:00Z",
		traineesCount: 28,
		signupDetails: {
			firstName: "Sarah",
			lastName: "Johnson",
		},
	},
	{
		id: "tr-003",
		name: "Michael Brown",
		email: "michael.brown@example.com",
		avatar: "/avatar-3.png",
		status: "suspended",
		createdAt: "2024-03-05T09:20:00Z",
		traineesCount: 5,
		signupDetails: {
			firstName: "Michael",
			lastName: "Brown",
		},
	},
];

export const mockTrainees: Trainee[] = [
	{
		id: "te-001",
		name: "Emily Davis",
		email: "emily.davis@example.com",
		phone: "+1-555-0201",
		avatar: "/avatar-4.png",
		status: "active",
		trainerId: "tr-001",
		trainerName: "John Smith",
		createdAt: "2024-01-20T16:45:00Z",
		programsEnrolled: 3,
		completedWorkouts: 45,
		currentProgram: "Weight Loss Program",
		gender: "female",
	},
	{
		id: "te-002",
		name: "Robert Wilson",
		email: "robert.wilson@example.com",
		avatar: "/avatar-5.png",
		status: "active",
		trainerId: "tr-001",
		trainerName: "John Smith",
		createdAt: "2024-02-01T11:20:00Z",
		programsEnrolled: 2,
		completedWorkouts: 28,
		currentProgram: "Strength Building",
		gender: "male",
	},
	{
		id: "te-003",
		name: "Lisa Anderson",
		email: "lisa.anderson@example.com",
		phone: "+1-555-0203",
		avatar: "/avatar-6.png",
		status: "inactive",
		trainerId: "tr-002",
		trainerName: "Sarah Johnson",
		createdAt: "2024-02-15T13:10:00Z",
		programsEnrolled: 1,
		completedWorkouts: 8,
		currentProgram: "Yoga Basics",
		gender: "female",
	},
	{
		id: "te-004",
		name: "David Martinez",
		email: "david.martinez@example.com",
		avatar: "/avatar-7.png",
		status: "active",
		trainerId: "tr-002",
		trainerName: "Sarah Johnson",
		createdAt: "2024-03-01T10:30:00Z",
		programsEnrolled: 4,
		completedWorkouts: 67,
		currentProgram: "Advanced Pilates",
		gender: "male",
	},
	{
		id: "te-005",
		name: "Mike Ford",
		email: "mikeford@example.com",
		phone: "+1 234 567 890",
		avatar: "/avatar-8.png",
		status: "in_progress",
		trainerId: "tr-003",
		trainerName: "Michael Brown",
		createdAt: "2024-03-10T15:20:00Z",
		programsEnrolled: 2,
		completedWorkouts: 22,
		currentProgram: "CrossFit Fundamentals",
		gender: "male",
	},
];
