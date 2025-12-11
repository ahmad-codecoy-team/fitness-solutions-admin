import { Navigate, type RouteObject } from "react-router";
import { authRoutes } from "./auth";
import { dashboardRoutes } from "./dashboard";
import { mainRoutes } from "./main";

export const routesSection: RouteObject[] = [
	// Auth routes (explicit paths)
	...authRoutes,
	// Main routes  
	...mainRoutes,
	// Dashboard (protected routes)
	...dashboardRoutes,
	// No Match
	{ path: "*", element: <Navigate to="/404" replace /> },
];
