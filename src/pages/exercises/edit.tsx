import { Helmet } from "react-helmet-async";
import ExerciseForm from "./components/exercise-form";
import { Icon } from "@/components/icon";
import { Button } from "@/ui/button";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import exerciseService from "@/api/services/exercises";
import type { Exercise } from "@/types/entity";

export default function EditExercisePage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [exercise, setExercise] = useState<Exercise | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExercise = async () => {
            if (!id) {
                setError("No exercise ID provided");
                setLoading(false);
                return;
            }

            try {
                console.log("🔵 Fetching exercise with ID:", id);
                const exerciseData = await exerciseService.getExerciseById(id);
                setExercise(exerciseData);
                setError(null);
            } catch (err) {
                console.error("❌ Failed to fetch exercise:", err);
                setError("Failed to load exercise data");
                setExercise(null);
            } finally {
                setLoading(false);
            }
        };

        fetchExercise();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p>Loading exercise...</p>
                </div>
            </div>
        );
    }

    if (error || !exercise) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Icon icon="solar:danger-bold-duotone" className="h-12 w-12 mx-auto mb-4 text-destructive" />
                    <h3 className="text-lg font-medium mb-2">Exercise not found</h3>
                    <p className="text-muted-foreground mb-4">{error || "The exercise you're looking for doesn't exist."}</p>
                    <Button onClick={() => navigate("/exercises")}>
                        <Icon icon="solar:arrow-left-bold-duotone" className="h-4 w-4 mr-2" />
                        Back to Exercises
                    </Button>
                </div>
            </div>
        );
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
