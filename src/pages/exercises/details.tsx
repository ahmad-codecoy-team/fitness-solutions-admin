import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { format } from "date-fns";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import { useState, useEffect } from "react";
import exerciseService from "@/api/services/exercises";

// API Response Type (matching actual API structure from logs.md)
interface ExerciseDetails {
	_id: string;
	trainer: string | null;
	title: string;
	description: string;
	video_link: string;
	pattern: string[];
	type: string[];
	primary_muscle: string[];
	plane: string[];
	photo: string;
	exercise_type: string;
	__v: number;
	createdAt: string;
	updatedAt: string;
}

export default function ExerciseDetails() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [exercise, setExercise] = useState<ExerciseDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchExerciseData = async () => {
			if (!id) {
				setError("No exercise ID provided");
				setLoading(false);
				return;
			}

			try {
				console.log("🔵 Fetching exercise with ID:", id);
				const exerciseData = await exerciseService.getExerciseById(id);
				setExercise(exerciseData.data);
				setError(null);
			} catch (err) {
				console.error("❌ Failed to fetch exercise data:", err);
				setError("Failed to load exercise data");
				setExercise(null);
			} finally {
				setLoading(false);
			}
		};

		fetchExerciseData();
	}, [id]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
					<p>Loading exercise details...</p>
				</div>
			</div>
		);
	}

	if (error || !exercise) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<Icon icon="solar:dumbbell-bold-duotone" className="h-12 w-12 mx-auto mb-4 text-destructive" />
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

	const getTypeBadges = (types: string[]) => {
		const exerciseTypes = !types || types.length === 0 ? ["general"] : types;
		return (
			<div className="flex flex-wrap gap-2">
				{exerciseTypes.map((type, index) => (
					<Badge key={index} variant="outline">
						{type}
					</Badge>
				))}
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-6 p-6">
			<Helmet>
				<title>{exercise.title} - Exercise Details</title>
			</Helmet>

			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Button variant="outline" onClick={() => navigate("/exercises")}>
						<Icon icon="solar:arrow-left-bold-duotone" className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-3xl font-bold text-foreground">{exercise.title}</h1>
						<p className="text-muted-foreground">Exercise details and information</p>
					</div>
				</div>
				<div className="flex gap-2">
					<Button variant="outline" onClick={() => navigate(`/exercises/${exercise._id}/edit`)}>
						<Icon icon="solar:pen-bold-duotone" className="h-4 w-4 mr-2" />
						Edit Exercise
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Basic Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Icon icon="solar:info-circle-bold-duotone" />
								Exercise Information
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div>
								<h3 className="font-semibold text-lg mb-2">{exercise.title}</h3>
								<p className="text-muted-foreground leading-relaxed">{exercise.description}</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div>
									<span className="text-sm font-medium text-muted-foreground">Exercise Type</span>
									<p className="text-sm capitalize">{exercise.exercise_type || "general"}</p>
								</div>
								<div>
									<span className="text-sm font-medium text-muted-foreground">Last Updated</span>
									<p className="text-sm">{format(new Date(exercise.updatedAt), "MMM dd, yyyy 'at' HH:mm")}</p>
								</div>
							</div>

							<div>
								<span className="text-sm font-medium text-muted-foreground">Types</span>
								<div className="mt-2">{getTypeBadges(exercise.type)}</div>
							</div>
						</CardContent>
					</Card>

					{/* Video */}
					{exercise.video_link && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Icon icon="solar:video-library-bold-duotone" />
									Exercise Video
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
									<a
										href={exercise.video_link}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
									>
										<Icon icon="solar:play-bold-duotone" className="h-8 w-8" />
										<span className="font-medium">Watch Exercise Video</span>
									</a>
								</div>
								<p className="text-sm text-muted-foreground mt-2">Click to open video in a new tab</p>
							</CardContent>
						</Card>
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Exercise Categories */}
					{(exercise.primary_muscle.length > 0 || exercise.pattern.length > 0 || exercise.plane.length > 0) && (
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Icon icon="solar:target-bold-duotone" />
									Exercise Categories
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								{exercise.primary_muscle.length > 0 && (
									<div>
										<span className="text-sm font-medium text-muted-foreground">Primary Muscles</span>
										<div className="flex flex-wrap gap-1 mt-1">
											{exercise.primary_muscle.map((muscle, index) => (
												<Badge key={index} variant="secondary" className="text-xs">
													{muscle}
												</Badge>
											))}
										</div>
									</div>
								)}

								{exercise.pattern.length > 0 && (
									<div>
										<span className="text-sm font-medium text-muted-foreground">Movement Patterns</span>
										<div className="flex flex-wrap gap-1 mt-1">
											{exercise.pattern.map((pat, index) => (
												<Badge key={index} variant="secondary" className="text-xs">
													{pat}
												</Badge>
											))}
										</div>
									</div>
								)}

								{exercise.plane.length > 0 && (
									<div>
										<span className="text-sm font-medium text-muted-foreground">Movement Planes</span>
										<div className="flex flex-wrap gap-1 mt-1">
											{exercise.plane.map((pl, index) => (
												<Badge key={index} variant="secondary" className="text-xs">
													{pl}
												</Badge>
											))}
										</div>
									</div>
								)}
							</CardContent>
						</Card>
					)}

					{/* Metadata */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Icon icon="solar:calendar-bold-duotone" />
								Metadata
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Created</span>
								<span className="text-sm">{format(new Date(exercise.createdAt), "MMM dd, yyyy")}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Updated</span>
								<span className="text-sm">{format(new Date(exercise.updatedAt), "MMM dd, yyyy")}</span>
							</div>
							<div className="flex justify-between">
								<span className="text-sm text-muted-foreground">Exercise ID</span>
								<span className="text-xs font-mono text-muted-foreground">{exercise._id}</span>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
