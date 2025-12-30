import type { UserInfo, UserToken } from "#/entity";
import type {
	Trainer,
	Client,
	TrainersListResponse,
	TrainerResponse,
	ClientsListResponse,
	ClientResponse,
	UserStatusUpdateRequest,
	UserStatusUpdateResponse
} from "@/types/entity";
import apiClient from "../apiClient";

export interface SignInReq {
	email: string;
	password: string;
}

export type SignInRes = UserToken & { user: UserInfo };

export interface AppUser {
	_id: string;
	image: string;
	fullname: string;
	email: string;
	password: string;
	role: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export enum UserApi {
	SignIn = "/auth/login",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
	User = "/user",
	AdminBase = "/admin",
	Trainers = "/admin/trainers",
	Clients = "/admin/clients",
	TotalClients = "/client/get_total_client",
	UserStatus = "/admin/users",
	ToggleStatus = "/user/toggle/status/:id", // Legacy endpoint
}

// Auth endpoints (existing)
const signin = (data: SignInReq) =>
	apiClient.post<SignInRes>({
		url: UserApi.SignIn,
		data,
	});

const logout = () =>
	apiClient.get({
		url: UserApi.Logout,
	});

const findById = (id: string) =>
	apiClient.get<UserInfo[]>({
		url: `${UserApi.User}/${id}`,
	});

const getAllUsers = () =>
	apiClient.get<AppUser[]>({
		url: UserApi.User,
	});

// New Admin API endpoints for trainers
const getAllTrainers = () => {
	console.log("🔵 userService.getAllTrainers called, URL:", UserApi.Trainers);
	return apiClient.get<Trainer[]>({
		url: UserApi.Trainers,
	}).then(result => {
		console.log("✅ getAllTrainers result:", result);
		return result;
	}).catch(error => {
		console.error("❌ getAllTrainers error:", error);
		throw error;
	});
};

const getTrainerById = (trainerId: string) =>
	apiClient.get<Trainer>({
		url: `${UserApi.Trainers}/${trainerId}`,
	});

const getClientsByTrainerId = (trainerId: string) =>
	apiClient.get<Client[]>({
		url: `${UserApi.Trainers}/${trainerId}/clients`,
	});

// New Admin API endpoints for clients
const getClientById = (clientId: string) =>
	apiClient.get<Client>({
		url: `${UserApi.Clients}/${clientId}`,
	});

const getTotalClients = () => {
	console.log("🔵 userService.getTotalClients called, URL:", UserApi.TotalClients);
	return apiClient.get<Client[]>({
		url: UserApi.TotalClients,
	}).then(result => {
		console.log("✅ getTotalClients result:", result);
		return result;
	}).catch(error => {
		console.error("❌ getTotalClients error:", error);
		throw error;
	});
};

// User status management
const updateUserStatus = (userId: string, data: UserStatusUpdateRequest) =>
	apiClient.patch<UserStatusUpdateResponse>({
		url: `${UserApi.UserStatus}/${userId}/status`,
		data,
	});

// Legacy toggle status (keeping for backward compatibility)
const toggleUserStatus = (userId: string) => {
	return apiClient.get({
		url: `/user/toggle/status/${userId}`,
	});
};

export default {
	// Auth
	signin,
	logout,
	findById,
	getAllUsers,
	
	// Admin - Trainers
	getAllTrainers,
	getTrainerById,
	getClientsByTrainerId,
	
	// Admin - Clients
	getClientById,
	getTotalClients,
	
	// User Management
	updateUserStatus,
	toggleUserStatus, // Legacy
};
