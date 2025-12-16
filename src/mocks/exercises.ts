export interface Exercise {
  id: string;
  name: string;
  category: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  videoUrl?: string;
  updatedAt: string;
}

export const mockExercises: Exercise[] = [
  {
    id: "1",
    name: "Push Up",
    category: "Chest",
    description: "Standard push up exercise targeting pecs, delts, and triceps.",
    difficulty: "Beginner",
    videoUrl: "https://example.com/pushup",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Bodyweight Squat",
    category: "Legs",
    description: "Fundamental lower body exercise for quads and glutes.",
    difficulty: "Beginner",
    videoUrl: "https://example.com/squat",
    updatedAt: new Date().toISOString(),
  },
   {
    id: "3",
    name: "Pull Up",
    category: "Back",
    description: "Compound upper body pulling exercise.",
    difficulty: "Intermediate",
    videoUrl: "https://example.com/pullup",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Deadlift",
    category: "Legs/Back",
    description: "Posterior chain exercise.",
    difficulty: "Advanced",
    videoUrl: "https://example.com/deadlift",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Dumbbell Shoulder Press",
    category: "Shoulders",
    description: "Overhead press for shoulder development.",
    difficulty: "Intermediate",
    videoUrl: "https://example.com/shoulder-press",
    updatedAt: new Date().toISOString(),
  },
];
