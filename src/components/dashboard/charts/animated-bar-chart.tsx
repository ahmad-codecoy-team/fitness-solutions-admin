import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/ui/card";
import { m } from "motion/react";
import { useEffect, useState } from "react";

interface BarChartData {
	label: string;
	value: number;
	color: string;
	icon: string;
}

interface AnimatedBarChartProps {
	title: string;
	data: BarChartData[];
}

export function AnimatedBarChart({ title, data }: AnimatedBarChartProps) {
	const [animatedData, setAnimatedData] = useState<BarChartData[]>([]);
	const maxValue = Math.max(...data.map((d) => d.value));

	useEffect(() => {
		const timer = setTimeout(() => {
			setAnimatedData(data);
		}, 300);

		return () => clearTimeout(timer);
	}, [data]);

	return (
		<Card className="shadow-sm h-full border-2 border-gray-300 dark:border-gray-600">
			<CardContent className="p-6">
				<div className="flex items-center gap-3 mb-6">
					<div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
						<Icon icon="solar:chart-2-bold" size={20} className="text-blue-600" />
					</div>
					<h3 className="text-lg font-semibold text-foreground">{title}</h3>
				</div>

				<div className="space-y-4">
					{animatedData.map((item, index) => (
						<m.div
							key={item.label}
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: index * 0.1, duration: 0.6 }}
							className="flex items-center gap-4"
						>
							<div className="flex items-center gap-3 min-w-0 flex-1">
								<div
									className={`p-2 rounded-lg ${item.color.replace("bg-", "bg-").replace("-500", "-100")} dark:${item.color.replace("bg-", "bg-").replace("-500", "-900/20")}`}
								>
									<Icon icon={item.icon} size={16} className={item.color.replace("bg-", "text-")} />
								</div>
								<span className="text-sm font-medium text-foreground truncate">{item.label}</span>
							</div>

							<div className="flex items-center gap-3 flex-shrink-0">
								<div className="w-24 sm:w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
									<m.div
										initial={{ width: 0 }}
										animate={{ width: `${(item.value / maxValue) * 100}%` }}
										transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
										className={`h-full ${item.color} rounded-full`}
									/>
								</div>
								<span className="text-sm font-bold text-foreground w-8 text-right">{item.value}</span>
							</div>
						</m.div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
