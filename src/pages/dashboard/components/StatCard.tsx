import { m } from "motion/react";
import { Card, CardContent } from "@/ui/card";
import { Icon } from "@/components/icon";
import { Badge } from "@/ui/badge";

export interface StatCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: string;
	color: string;
	badge?: {
		text: string;
		variant: "default" | "secondary" | "destructive" | "outline";
	};
	index?: number;
}

const StatCard = ({ title, value, subtitle, icon, color, badge, index }: StatCardProps) => (
	<m.div
		initial={{ opacity: 0, y: 30 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{
			duration: 0.6,
			ease: "easeOut",
			delay: (index || 0) * 0.1,
		}}
		whileHover={{
			y: -4,
			transition: { duration: 0.2 },
		}}
		className="group"
	>
		<Card className="h-full transition-all duration-200 group-hover:shadow-lg">
			<CardContent className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
							<Icon icon={icon} style={{ color }} className="shrink-0" />
							<span>{title}</span>
							{badge && !badge && (
								<Badge variant={badge.variant} className="text-xs">
									{badge.text}
								</Badge>
							)}
						</div>
						<div className="text-2xl font-bold text-foreground">{value}</div>
						{subtitle && <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>}
					</div>
				</div>
			</CardContent>
		</Card>
	</m.div>
);

export default StatCard;
