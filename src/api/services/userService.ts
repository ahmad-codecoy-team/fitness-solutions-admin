import type { UserInfo, UserToken } from "#/entity";
import apiClient from "../apiClient";

export interface SignInReq {
	email: string;
	password: string;
}

export interface SignUpReq extends SignInReq {
	email: string;
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
	SignUp = "/auth/signup",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
	User = "/user",
	ToggleStatus = "/user/toggle/status/:id", // ✅ added live toggle endpoint
}

const signin = (data: SignInReq) =>
	apiClient.post<SignInRes>({
		url: UserApi.SignIn,
		data,
	});

const signup = (data: SignUpReq) =>
	apiClient.post<SignInRes>({
		url: UserApi.SignUp,
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

// ✅ Updated to match your Postman setup
const toggleUserStatus = (userId: string) => {
	return apiClient.get({
		url: `/user/toggle/status/${userId}`,
	});
};

export default {
	signin,
	signup,
	findById,
	getAllUsers,
	toggleUserStatus,
	logout,
};
