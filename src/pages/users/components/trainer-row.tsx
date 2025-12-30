import { Icon } from "@/components/icon";
import type { Trainer } from "@/types/entity";
import { Avatar } from "@/ui/avatar";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { TableCell, TableRow } from "@/ui/table";
import { getImageUrl } from "@/utils";
import { format } from "date-fns";
import { useNavigate } from "react-router";

interface TrainerRowProps {
  trainer: Trainer;
  onToggleStatus: (trainerId: string, currentStatus: string) => void;
}

export default function TrainerRow({ trainer, onToggleStatus }: TrainerRowProps) {
  const navigate = useNavigate();
  const fullName = `${trainer.first_name} ${trainer.last_name}`;

  const getStatusBadge = (status?: string) => {
    // Handle missing status field for old users (show as 'active')
    const trainerStatus = status || "active";

    switch (trainerStatus) {
      case "active":
        return <Badge variant="default">Active</Badge>;
      case "suspended":
        return <Badge variant="destructive">Suspended</Badge>;
      default:
        return <Badge variant="default">Active</Badge>;
    }
  };

  const handleViewDetails = () => {
    navigate(`/users/trainer/${trainer._id}`);
  };

  const handleToggleStatus = () => {
    onToggleStatus(trainer._id, trainer.status || "active");
  };

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {trainer.avatar ? (
              <img
                src={getImageUrl(trainer.avatar)}
                alt={trainer.first_name}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-medium">
                {trainer.first_name.charAt(0)}
                {trainer.last_name.charAt(0)}
              </div>
            )}
          </Avatar>
          <div>
            <div className="font-medium">{fullName}</div>
            <div className="text-sm text-muted-foreground">{trainer.email}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>{getStatusBadge(trainer.status)}</TableCell>
      <TableCell>
        <Badge variant="outline" className="text-xs">
          {trainer.role.name}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm">{format(new Date(trainer.createdAt), "MMM dd, yyyy")}</span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={handleViewDetails}>
            <Icon icon="solar:eye-bold-duotone" className="h-4 w-4" />
          </Button>
          <Button
            variant={trainer.status === "suspended" ? "default" : "destructive"}
            size="sm"
            onClick={handleToggleStatus}
            className={
              trainer.status === "suspended" ? "bg-green-600 hover:bg-green-700 text-white" : ""
            }
          >
            {trainer.status === "suspended" ? (
              <Icon icon="solar:play-bold-duotone" className="h-4 w-4" />
            ) : (
              <Icon icon="solar:pause-bold-duotone" className="h-4 w-4" />
            )}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}