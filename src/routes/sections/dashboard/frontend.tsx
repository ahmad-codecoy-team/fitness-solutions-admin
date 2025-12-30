import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import { Component } from "./utils";

export const frontendDashboardRoutes: RouteObject[] = [
	{ index: true, element: <Navigate to="overview" replace /> },
	{ path: "overview", element: Component("/pages/dashboard/overview") },
	{
		path: "users",
		children: [
			{ index: true, element: Component("/pages/users") },
			{ path: "trainer/:id", element: Component("/pages/users/trainer-details") },
			{ path: "trainee/:id", element: Component("/pages/users/trainee-details") },
		],
	},
	{
		path: "notifications",
		children: [
			{ index: true, element: Component("/pages/notifications") },
			{ path: ":id", element: Component("/pages/notifications/details") },
			{ path: "create", element: Component("/pages/notifications/create") },
			{ path: ":id/edit", element: Component("/pages/notifications/edit") },
		],
	},
	{
		path: "exercises",
		children: [
			{ index: true, element: Component("/pages/exercises") },
			{ path: "new", element: Component("/pages/exercises/create") },
			{ path: ":id", element: Component("/pages/exercises/details") },
			{ path: ":id/edit", element: Component("/pages/exercises/edit") },
		],
	},
	{ path: "financial", element: Component("/pages/financial") },
	{ path: "terms-and-conditions", element: Component("/pages/terms-and-conditions") },
	{ path: "privacy-policy", element: Component("/pages/privacy-policy") },
	{ path: "about-us", element: Component("/pages/about-us") },
	{
		path: "error",
		children: [
			{ index: true, element: <Navigate to="403" replace /> },
			{ path: "403", element: Component("/pages/sys/error/Page403") },
			{ path: "404", element: Component("/pages/sys/error/Page404") },
			{ path: "500", element: Component("/pages/sys/error/Page500") },
		],
	},
];
