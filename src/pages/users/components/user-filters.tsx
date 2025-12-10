import { Icon } from "@/components/icon";
import type { UserFilters } from "@/types/user";
import { USER_STATUS_LABELS, UserStatus } from "@/types/user";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";

interface UserFiltersProps {
	filters: UserFilters;
	onFiltersChange: (filters: UserFilters) => void;
	onReset: () => void;
}

export function UserFiltersComponent({ filters, onFiltersChange, onReset }: UserFiltersProps) {
	// Check if any filters are active
	const hasActiveFilters = filters.search || filters.status !== undefined;

	return (
		<div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
			{/* Search Input */}
			<div className="flex-1 min-w-0">
				<Input
					placeholder="Search by name or email..."
					value={filters.search || ""}
					onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
					className="w-full"
				/>
			</div>

			{/* Status Filter */}
			<div className="w-full sm:w-40">
				<Select
					value={filters.status !== undefined ? filters.status.toString() : "all"}
					onValueChange={(value) =>
						onFiltersChange({
							...filters,
							status: value === "all" ? undefined : (Number.parseInt(value) as UserStatus),
						})
					}
				>
					<SelectTrigger className="w-full">
						<SelectValue
							placeholder={
								<div className="flex items-center gap-2">
									<Icon icon="solar:filter-outline" size={16} />
									<span>Filters</span>
								</div>
							}
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value={UserStatus.ACTIVE.toString()}>Active</SelectItem>
						<SelectItem value={UserStatus.SUSPENDED.toString()}>Suspended</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Reset Button - only show when filters are active */}
			{hasActiveFilters && (
				<Button variant="outline" onClick={onReset} className="w-full sm:w-auto whitespace-nowrap">
					<Icon icon="solar:restart-bold" size={16} className="mr-2" />
					<span className="hidden sm:inline">Reset Filters</span>
					<span className="sm:hidden">Reset</span>
				</Button>
			)}
		</div>
	);
}
