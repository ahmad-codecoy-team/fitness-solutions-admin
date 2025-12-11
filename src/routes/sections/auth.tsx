import { Suspense, lazy } from "react";
import type { RouteObject } from "react-router";

const LoginPage = lazy(() => import("@/pages/sys/login"));
const SignupPage = lazy(() => import("@/pages/sys/signup"));

export const authRoutes: RouteObject[] = [
	{
		path: "login",
		element: (
			<Suspense>
				<LoginPage />
			</Suspense>
		),
	},
	{
		path: "signup", 
		element: (
			<Suspense>
				<SignupPage />
			</Suspense>
		),
	},
];
