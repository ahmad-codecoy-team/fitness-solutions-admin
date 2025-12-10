import DashboardLayout from "@/layouts/dashboard";
import LoginAuthGuard from "@/routes/components/login-auth-guard";
import { Navigate, type RouteObject } from "react-router";
import { frontendDashboardRoutes } from "./frontend";

export const dashboardRoutes: RouteObject[] = [
	{
		path: "/",
		element: (
			<LoginAuthGuard>
				<DashboardLayout />
			</LoginAuthGuard>
		),
		children: [{ index: true, element: <Navigate to="overview" replace /> }, ...frontendDashboardRoutes],
	},
];
