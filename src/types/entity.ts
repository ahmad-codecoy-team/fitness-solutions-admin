import type { NavItemDataProps } from "@/components/nav/types";
import type { BasicStatus, PermissionType } from "./enum";

export interface UserToken {
	accessToken?: string;
	refreshToken?: string;
}

export interface UserInfo {
	_id: string;
	email: string;
	fullname: string;
	password?: string;
	image?: string;
	phoneNo?: string;
	role: {
		_id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
		__v?: number;
	};
	isActive: boolean;
	isProfileCompleted: boolean;
	notifications: boolean;
	firebaseId: string;
	accountType: string;
	subscriptionType: string;
	subscriptionDate?: string | null;
	subscriptionExpiryDate?: string | null;
	createdAt: string;
	updatedAt: string;
	__v?: number;
	// Legacy properties for compatibility
	id?: string;
	username?: string;
	avatar?: string;
	roles?: Role[];
	status?: BasicStatus;
	permissions?: Permission[];
	menu?: MenuTree[];
}

export interface Permission_Old {
	id: string;
	parentId: string;
	name: string;
	label: string;
	type: PermissionType;
	route: string;
	status?: BasicStatus;
	order?: number;
	icon?: string;
	component?: string;
	hide?: boolean;
	hideTab?: boolean;
	frameSrc?: URL;
	newFeature?: boolean;
	children?: Permission_Old[];
}

export interface Role_Old {
	id: string;
	name: string;
	code: string;
	status: BasicStatus;
	order?: number;
	desc?: string;
	permission?: Permission_Old[];
}

export interface CommonOptions {
	status?: BasicStatus;
	desc?: string;
	createdAt?: string;
	updatedAt?: string;
}
export interface User extends CommonOptions {
	id: string; // uuid
	username: string;
	password: string;
	email: string;
	phone?: string;
	avatar?: string;
}

export interface Role extends CommonOptions {
	id: string; // uuid
	name: string;
	code: string;
}

export interface Permission extends CommonOptions {
	id: string; // uuid
	name: string;
	code: string; // resource:action  example: "user-management:read"
}

export interface Menu extends CommonOptions, MenuMetaInfo {
	id: string; // uuid
	parentId: string;
	name: string;
	code: string;
	order?: number;
	type: PermissionType;
}

export type MenuMetaInfo = Partial<
	Pick<NavItemDataProps, "path" | "icon" | "caption" | "info" | "disabled" | "auth" | "hidden">
> & {
	externalLink?: URL;
	component?: string;
};

export type MenuTree = Menu & {
	children?: MenuTree[];
};

// Exercise types based on API documentation
export interface Exercise {
	_id: string;
	trainer: string | null;
	title: string;
	description: string;
	video_link: string;
	pattern: string[];
	type: string[];
	primary_muscle: string[];
	plane: string[];
	photo: string;
	exercise_type: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface ExerciseCreateRequest {
	title: string;
	description: string;
	video_link: string;
	type: string | string[];
}

export interface ExerciseUpdateRequest {
	title?: string;
	description?: string;
	video_link?: string;
	type?: string | string[];
}

export interface ExerciseResponse {
	success: boolean;
	code: number;
	data: Exercise;
}

export interface ExercisesListResponse {
	success: boolean;
	code: number;
	data: Exercise[];
	meta: {
		total: number;
	};
}

// User types based on API documentation
export interface Trainer {
	_id: string;
	first_name: string;
	last_name: string;
	avatar: string;
	email: string;
	role: {
		_id: string;
		name: string;
		createdAt: string;
		updatedAt: string;
		__v?: number;
	};
	status: "active" | "suspended";
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface Client {
	_id: string;
	first_name: string;
	last_name: string;
	dob: string | null;
	email: string;
	trainer: string | Trainer;
	phone: string;
	gender: "male" | "female" | "other";
	start_weight: number;
	current_weight: number;
	target_weight: number;
	signature: string;
	status: "IN_PROGRESS" | string;
	attachments: Array<{ title: string; file: string }>;
	questions: Array<{
		question: string;
		answer: boolean;
		description: string;
	}>;
	createdAt: string;
	updatedAt: string;
	__v: number;
}

export interface TrainersListResponse {
	success: boolean;
	code: number;
	data: Trainer[];
	meta: {
		total: number;
	};
}

export interface TrainerResponse {
	success: boolean;
	code: number;
	data: Trainer;
}

export interface ClientsListResponse {
	success: boolean;
	code: number;
	data: Client[];
}

export interface ClientResponse {
	success: boolean;
	code: number;
	data: Client;
}

export interface UserStatusUpdateRequest {
	status: "active" | "suspended";
}

export interface UserStatusUpdateResponse {
	success: boolean;
	code: number;
	data: Trainer | Client;
}
