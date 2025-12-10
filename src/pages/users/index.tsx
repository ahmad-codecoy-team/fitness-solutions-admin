import { Helmet } from "react-helmet-async";
import UserTypeTabs from "./components/user-type-tabs";

export default function UserPage() {
	return (
		<div className="flex flex-col gap-4 p-6">
			<Helmet>
				<title>Users - Fitness Solutions Admin</title>
			</Helmet>

			<UserTypeTabs />
		</div>
	);
}