import { Helmet } from "react-helmet-async";
import ExerciseForm from "./components/exercise-form";
import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { useNavigate } from "react-router";

export default function CreateExercisePage() {
    const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-4 p-6 max-w-3xl mx-auto w-full">
			<Helmet>
				<title>Create Exercise - Fitness Solutions Admin</title>
			</Helmet>

            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="icon" onClick={() => navigate("/exercises")}>
                    <Icon icon="solar:arrow-left-outline" className="h-6 w-6" />
                </Button>
                <div>
					<h1 className="text-2xl font-bold text-foreground">Add New Exercise</h1>
					<p className="text-muted-foreground">Fill in the details to create a new exercise.</p>
				</div>
            </div>

            <ExerciseForm />
		</div>
	);
}
