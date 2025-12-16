import { Icon } from "@/components/icon";
import type { NavProps } from "@/components/nav";

export const frontendNavData: NavProps["data"] = [
	{
		name: "sys.nav.dashboard",
		items: [
			{
				title: "sys.nav.overview",
				path: "/overview",
				icon: <Icon icon="local:ic-dashboard" size="24" />,
			},
		],
	},
	{
		name: "sys.nav.management",
		items: [
			{
				title: "sys.nav.users",
				path: "/users",
				icon: <Icon icon="local:ic-user" size="24" />,
			},
			{
				title: "sys.nav.notifications",
				path: "/notifications",
				icon: <Icon icon="solar:bell-bold-duotone" size="24" />,
			},
			{
				title: "Exercises",
				path: "/exercises",
				icon: <Icon icon="solar:dumbbell-bold-duotone" size="24" />,
			},
			{
				title: "Financial",
				path: "/financial",
				icon: <Icon icon="solar:card-send-bold-duotone" size="24" />,
			},
		],
	},
	{
		name: "sys.nav.legal",
		items: [
			{
				title: "sys.nav.terms_and_conditions",
				path: "/terms-and-conditions",
				icon: <Icon icon="solar:document-text-bold-duotone" size="24" />,
			},
			{
				title: "sys.nav.privacy_policy",
				path: "/privacy-policy",
				icon: <Icon icon="solar:shield-check-bold-duotone" size="24" />,
			},
			{
				title: "sys.nav.about_us",
				path: "/about-us",
				icon: <Icon icon="solar:info-circle-bold-duotone" size="24" />,
			},
		],
	},
];
