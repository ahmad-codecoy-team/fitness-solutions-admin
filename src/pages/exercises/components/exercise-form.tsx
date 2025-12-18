import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { type Exercise, type ExerciseCreateRequest, type ExerciseUpdateRequest } from "@/types/entity";
import exerciseService from "@/api/services/exercises";

interface ExerciseFormProps {
    initialData?: Exercise;
    isEdit?: boolean;
}

export default function ExerciseForm({ initialData, isEdit = false }: ExerciseFormProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        video_link: initialData?.video_link || "",
        type: initialData?.type?.join(", ") || "",
    });

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert type string to array
            const typeArray = formData.type.split(",").map(t => t.trim()).filter(t => t.length > 0);
            
            const requestData: ExerciseCreateRequest | ExerciseUpdateRequest = {
                title: formData.title,
                description: formData.description,
                video_link: formData.video_link,
                type: typeArray,
            };

            if (isEdit && initialData?._id) {
                await exerciseService.updateExercise(initialData._id, requestData);
                toast.success("Exercise updated successfully");
            } else {
                await exerciseService.createExercise(requestData as ExerciseCreateRequest);
                toast.success("Exercise created successfully");
            }

            navigate("/exercises");
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Exercise Title</Label>
                            <Input 
                                id="title" 
                                placeholder="e.g. Push Ups" 
                                value={formData.title} 
                                onChange={(e) => handleChange("title", e.target.value)} 
                                required
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

                        <div className="grid gap-2">
                            <Label htmlFor="video_link">Video Link</Label>
                            <Input 
                                id="video_link" 
                                placeholder="https://youtube.com/..." 
                                value={formData.video_link} 
                                onChange={(e) => handleChange("video_link", e.target.value)} 
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Exercise Types</Label>
                            <Input 
                                id="type" 
                                placeholder="e.g. strength, cardio, flexibility (comma-separated)" 
                                value={formData.type} 
                                onChange={(e) => handleChange("type", e.target.value)} 
                            />
                            <p className="text-sm text-muted-foreground">
                                Enter exercise types separated by commas (e.g., strength, cardio, flexibility)
                            </p>
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
