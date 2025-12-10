export interface Trainer {
	id: string;
	name: string;
	email: string;
	phone: string;
	avatar?: string;
	status: 'active' | 'suspended' | 'inactive';
	createdAt: string;
	subscription: {
		plan: 'free' | 'premium' | 'pro';
		status: 'active' | 'expired' | 'cancelled';
		startDate: string;
		endDate: string;
		price: number;
	};
	paymentHistory: PaymentRecord[];
	traineesCount: number;
	totalRevenue: number;
	signupDetails: {
		firstName: string;
		lastName: string;
		dateOfBirth: string;
		gender: 'male' | 'female' | 'other';
		location: string;
		specialization: string[];
		experience: string;
		certification: string[];
	};
}

export interface Trainee {
	id: string;
	name: string;
	email: string;
	phone?: string;
	avatar?: string;
	status: 'active' | 'inactive';
	trainerId: string;
	trainerName: string;
	createdAt: string;
	lastActive: string;
	programsEnrolled: number;
	completedWorkouts: number;
	currentProgram?: string;
}

export interface PaymentRecord {
	id: string;
	amount: number;
	currency: string;
	status: 'completed' | 'pending' | 'failed' | 'refunded';
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
		phone: "+1-555-0123",
		avatar: "/src/assets/images/avatars/avatar-1.png",
		status: "active",
		createdAt: "2024-01-15T10:30:00Z",
		subscription: {
			plan: "premium",
			status: "active",
			startDate: "2024-01-15T00:00:00Z",
			endDate: "2025-01-15T00:00:00Z",
			price: 29.99
		},
		paymentHistory: [
			{
				id: "pay-001",
				amount: 29.99,
				currency: "USD",
				status: "completed",
				date: "2024-01-15T10:30:00Z",
				description: "Premium Plan - Annual",
				paymentMethod: "Credit Card (**** 4242)",
				transactionId: "txn_1234567890"
			},
			{
				id: "pay-002",
				amount: 29.99,
				currency: "USD",
				status: "completed",
				date: "2023-01-15T10:30:00Z",
				description: "Premium Plan - Annual",
				paymentMethod: "Credit Card (**** 4242)",
				transactionId: "txn_0987654321"
			}
		],
		traineesCount: 15,
		totalRevenue: 59.98,
		signupDetails: {
			firstName: "John",
			lastName: "Smith",
			dateOfBirth: "1985-03-20",
			gender: "male",
			location: "New York, NY",
			specialization: ["Weight Training", "Cardio", "Nutrition"],
			experience: "5+ years",
			certification: ["NASM-CPT", "ACSM Certified"]
		}
	},
	{
		id: "tr-002",
		name: "Sarah Johnson",
		email: "sarah.johnson@example.com",
		phone: "+1-555-0124",
		avatar: "/src/assets/images/avatars/avatar-2.png",
		status: "active",
		createdAt: "2024-02-10T14:15:00Z",
		subscription: {
			plan: "pro",
			status: "active",
			startDate: "2024-02-10T00:00:00Z",
			endDate: "2025-02-10T00:00:00Z",
			price: 49.99
		},
		paymentHistory: [
			{
				id: "pay-003",
				amount: 49.99,
				currency: "USD",
				status: "completed",
				date: "2024-02-10T14:15:00Z",
				description: "Pro Plan - Annual",
				paymentMethod: "PayPal",
				transactionId: "txn_1122334455"
			}
		],
		traineesCount: 28,
		totalRevenue: 49.99,
		signupDetails: {
			firstName: "Sarah",
			lastName: "Johnson",
			dateOfBirth: "1990-07-12",
			gender: "female",
			location: "Los Angeles, CA",
			specialization: ["Yoga", "Pilates", "Flexibility Training"],
			experience: "8+ years",
			certification: ["RYT-500", "PMA-CPT"]
		}
	},
	{
		id: "tr-003",
		name: "Michael Brown",
		email: "michael.brown@example.com",
		phone: "+1-555-0125",
		avatar: "/src/assets/images/avatars/avatar-3.png",
		status: "suspended",
		createdAt: "2024-03-05T09:20:00Z",
		subscription: {
			plan: "free",
			status: "active",
			startDate: "2024-03-05T00:00:00Z",
			endDate: "2025-03-05T00:00:00Z",
			price: 0
		},
		paymentHistory: [],
		traineesCount: 5,
		totalRevenue: 0,
		signupDetails: {
			firstName: "Michael",
			lastName: "Brown",
			dateOfBirth: "1988-11-30",
			gender: "male",
			location: "Chicago, IL",
			specialization: ["CrossFit", "Functional Training"],
			experience: "3+ years",
			certification: ["CF-L1"]
		}
	}
];

export const mockTrainees: Trainee[] = [
	{
		id: "te-001",
		name: "Emily Davis",
		email: "emily.davis@example.com",
		phone: "+1-555-0201",
		avatar: "/src/assets/images/avatars/avatar-4.png",
		status: "active",
		trainerId: "tr-001",
		trainerName: "John Smith",
		createdAt: "2024-01-20T16:45:00Z",
		lastActive: "2024-12-10T08:30:00Z",
		programsEnrolled: 3,
		completedWorkouts: 45,
		currentProgram: "Weight Loss Program"
	},
	{
		id: "te-002",
		name: "Robert Wilson",
		email: "robert.wilson@example.com",
		avatar: "/src/assets/images/avatars/avatar-5.png",
		status: "active",
		trainerId: "tr-001",
		trainerName: "John Smith",
		createdAt: "2024-02-01T11:20:00Z",
		lastActive: "2024-12-09T19:15:00Z",
		programsEnrolled: 2,
		completedWorkouts: 28,
		currentProgram: "Strength Building"
	},
	{
		id: "te-003",
		name: "Lisa Anderson",
		email: "lisa.anderson@example.com",
		phone: "+1-555-0203",
		avatar: "/src/assets/images/avatars/avatar-6.png",
		status: "inactive",
		trainerId: "tr-002",
		trainerName: "Sarah Johnson",
		createdAt: "2024-02-15T13:10:00Z",
		lastActive: "2024-11-20T14:00:00Z",
		programsEnrolled: 1,
		completedWorkouts: 8,
		currentProgram: "Yoga Basics"
	},
	{
		id: "te-004",
		name: "David Martinez",
		email: "david.martinez@example.com",
		avatar: "/src/assets/images/avatars/avatar-7.png",
		status: "active",
		trainerId: "tr-002",
		trainerName: "Sarah Johnson",
		createdAt: "2024-03-01T10:30:00Z",
		lastActive: "2024-12-10T20:45:00Z",
		programsEnrolled: 4,
		completedWorkouts: 67,
		currentProgram: "Advanced Pilates"
	},
	{
		id: "te-005",
		name: "Jennifer Lee",
		email: "jennifer.lee@example.com",
		phone: "+1-555-0205",
		avatar: "/src/assets/images/avatars/avatar-8.png",
		status: "active",
		trainerId: "tr-003",
		trainerName: "Michael Brown",
		createdAt: "2024-03-10T15:20:00Z",
		lastActive: "2024-12-08T07:30:00Z",
		programsEnrolled: 2,
		completedWorkouts: 22,
		currentProgram: "CrossFit Fundamentals"
	}
];