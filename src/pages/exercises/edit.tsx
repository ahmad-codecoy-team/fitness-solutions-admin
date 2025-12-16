import { Helmet } from "react-helmet-async";
import ExerciseForm from "./components/exercise-form";
import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { useNavigate, useParams } from "react-router";
import { mockExercises } from "@/mocks/exercises";
import { useMemo } from "react";

export default function EditExercisePage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const exercise = useMemo(() => {
        return mockExercises.find(e => e.id === id);
    }, [id]);

    if (!exercise) {
        return <div className="p-6">Exercise not found</div>;
    }

	return (
		<div className="flex flex-col gap-4 p-6 max-w-3xl mx-auto w-full">
			<Helmet>
				<title>Edit Exercise - Fitness Solutions Admin</title>
			</Helmet>

            <div className="flex items-center gap-4 mb-2">
                <Button variant="ghost" size="icon" onClick={() => navigate("/exercises")}>
                    <Icon icon="solar:arrow-left-outline" className="h-6 w-6" />
                </Button>
                 <div>
					<h1 className="text-2xl font-bold text-foreground">Edit Exercise</h1>
					<p className="text-muted-foreground">Update the details of this exercise.</p>
				</div>
            </div>

            <ExerciseForm initialData={exercise} isEdit />
		</div>
	);
}
