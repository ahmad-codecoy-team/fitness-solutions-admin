import { Icon } from "@/components/icon";
import type { Exercise, ExerciseStatus } from "@/types/entity";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { TableCell, TableRow } from "@/ui/table";
import { format } from "date-fns";
import { useNavigate } from "react-router";

interface ExerciseRowProps {
  exercise: Exercise;
  onStatusUpdate: (exerciseId: string, newStatus: ExerciseStatus) => void;
  onDelete: (exerciseId: string) => void;
  updatingStatus: string | null;
}

export default function ExerciseRow({ 
  exercise, 
  onStatusUpdate, 
  onDelete, 
  updatingStatus 
}: ExerciseRowProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status: ExerciseStatus | undefined) => {
    const actualStatus = status || 'approved'; // Backward compatibility: old exercises without status are treated as approved
    
    switch (actualStatus) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
    }
  };

  const getTypeBadges = (types: string[] | undefined) => {
    // Handle exercises with no type - show as 'general'
    const exerciseTypes = !types || types.length === 0 ? ["general"] : types;

    return (
      <div className="flex flex-wrap gap-1">
        {exerciseTypes.map((type, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {type}
          </Badge>
        ))}
      </div>
    );
  };

  const handleEdit = () => {
    navigate(`/exercises/${exercise._id}/edit`);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this exercise?")) {
      onDelete(exercise._id);
    }
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="w-60">
        <div className="font-medium truncate max-w-[200px]">{exercise.title}</div>
        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
          {exercise.description}
        </div>
      </TableCell>
      <TableCell>{getTypeBadges(exercise.type)}</TableCell>
      <TableCell className="w-32">
        <div className="flex flex-col gap-1">
          {getStatusBadge(exercise.status)}
          {(exercise.status === 'pending' || !exercise.status) && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStatusUpdate(exercise._id, 'approved')}
                disabled={updatingStatus === exercise._id}
                className="h-6 px-1.5 text-xs bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 gap-0.5"
                title="Approve Exercise"
              >
                {updatingStatus === exercise._id ? (
                  <Icon icon="solar:refresh-bold-duotone" className="h-3 w-3 animate-spin" />
                ) : (
                  <Icon icon="solar:check-circle-bold-duotone" className="h-3 w-3" />
                )}
                {updatingStatus === exercise._id ? "" : "Approve"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStatusUpdate(exercise._id, 'rejected')}
                disabled={updatingStatus === exercise._id}
                className="h-6 px-1.5 text-xs bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 gap-0.5"
                title="Reject Exercise"
              >
                {updatingStatus === exercise._id ? (
                  <Icon icon="solar:refresh-bold-duotone" className="h-3 w-3 animate-spin" />
                ) : (
                  <Icon icon="solar:close-circle-bold-duotone" className="h-3 w-3" />
                )}
                {updatingStatus === exercise._id ? "" : "Reject"}
              </Button>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell>
        {exercise.video_link ? (
          <a
            href={exercise.video_link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            <Icon icon="solar:video-library-bold-duotone" className="h-4 w-4 inline mr-1" />
            View Video
          </a>
        ) : (
          <span className="text-muted-foreground text-sm">No video</span>
        )}
      </TableCell>
      <TableCell>
        <span className="text-sm">{format(new Date(exercise.updatedAt), "MMM dd, yyyy")}</span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/exercises/${exercise._id}`)}>
            <Icon icon="solar:eye-bold-duotone" className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Icon icon="solar:pen-bold-duotone" className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Icon icon="solar:trash-bin-trash-bold-duotone" className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}