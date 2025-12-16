import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { type Exercise } from "@/mocks/exercises";

interface ExerciseFormProps {
    initialData?: Exercise;
    isEdit?: boolean;
}

export default function ExerciseForm({ initialData, isEdit = false }: ExerciseFormProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<Partial<Exercise>>(initialData || {
        name: "",
        category: "",
        difficulty: "Beginner",
        description: "",
        videoUrl: "",
    });

    const handleChange = (field: keyof Exercise, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        toast.success(isEdit ? "Exercise updated successfully" : "Exercise created successfully");
        setLoading(false);
        navigate("/exercises");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Exercise Name</Label>
                            <Input 
                                id="name" 
                                placeholder="e.g. Push Up" 
                                value={formData.name} 
                                onChange={(e) => handleChange("name", e.target.value)} 
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Input 
                                    id="category" 
                                    placeholder="e.g. Chest" 
                                    value={formData.category} 
                                    onChange={(e) => handleChange("category", e.target.value)} 
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="difficulty">Difficulty</Label>
                                <Select 
                                    value={formData.difficulty} 
                                    onValueChange={(value) => handleChange("difficulty", value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                         <div className="grid gap-2">
                            <Label htmlFor="videoUrl">Video URL</Label>
                            <Input 
                                id="videoUrl" 
                                placeholder="https://..." 
                                value={formData.videoUrl} 
                                onChange={(e) => handleChange("videoUrl", e.target.value)} 
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                                id="description" 
                                placeholder="Describe the exercise..." 
                                value={formData.description} 
                                onChange={(e) => handleChange("description", e.target.value)} 
                                className="min-h-[150px]"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => navigate("/exercises")}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? "Saving..." : (isEdit ? "Update Exercise" : "Create Exercise")}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
