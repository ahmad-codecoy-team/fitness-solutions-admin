import { Helmet } from "react-helmet-async";
import TrainersTable from "./components/trainers-table";

export default function UserPage() {
	return (
		<div className="flex flex-col gap-4 p-6">
			<Helmet>
				<title>Trainers - Fitness Solutions Admin</title>
			</Helmet>

			<TrainersTable />
		</div>
	);
}