import { Helmet } from "react-helmet-async";
import ExercisesTable from "./components/exercises-table";

export default function ExercisesPage() {
	return (
		<div className="flex flex-col gap-4 p-6">
			<Helmet>
				<title>Exercises - Fitness Solutions Admin</title>
			</Helmet>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Exercises Management</h1>
					<p className="text-muted-foreground">Add new exercises and edit every detail of the existing ones.</p>
				</div>
			</div>

			<ExercisesTable />
		</div>
	);
}
