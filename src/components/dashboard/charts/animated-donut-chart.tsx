import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/ui/card";
import { m } from "motion/react";
import { useEffect, useState } from "react";

interface DonutChartData {
	label: string;
	value: number;
	color: string;
	percentage: number;
}

interface AnimatedDonutChartProps {
	title: string;
	data: DonutChartData[];
	centerValue?: number;
	centerLabel?: string;
}

export function AnimatedDonutChart({ title, data, centerValue, centerLabel }: AnimatedDonutChartProps) {
	const [animatedData, setAnimatedData] = useState<DonutChartData[]>([]);
	const [animatedCenter, setAnimatedCenter] = useState(0);

	const radius = 80;
	const strokeWidth = 14;
	const normalizedRadius = radius - strokeWidth * 2;
	const circumference = normalizedRadius * 2 * Math.PI;

	useEffect(() => {
		const timer = setTimeout(() => {
			setAnimatedData(data);
			if (centerValue) setAnimatedCenter(centerValue);
		}, 300);

		return () => clearTimeout(timer);
	}, [data, centerValue]);

	let cumulativePercentage = 0;

	return (
		<Card className="shadow-sm h-full border-2 border-gray-300 dark:border-gray-600">
			<CardContent className="p-4">
				<div className="flex items-center gap-2 mb-4">
					<div className="p-1.5 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
						<Icon icon="solar:pie-chart-2-bold" size={18} className="text-purple-600" />
					</div>
					<h3 className="text-base font-semibold text-foreground">{title}</h3>
				</div>

				<div className="flex flex-col lg:flex-row items-center gap-6">
					{/* Donut Chart */}
					<div className="relative flex-shrink-0">
						<svg height={radius * 2} width={radius * 2} className="transform -rotate-90" aria-label="Donut chart">
							<title>Donut Chart</title>
							{/* Background circle */}
							<circle
								stroke="currentColor"
								className="text-gray-100 dark:text-gray-800"
								fill="transparent"
								strokeWidth={strokeWidth}
								r={normalizedRadius}
								cx={radius}
								cy={radius}
							/>

							{/* Data segments */}
							{animatedData.map((segment, index) => {
								const strokeDasharray = `${(segment.percentage * circumference) / 100} ${circumference}`;
								const strokeDashoffset = (-cumulativePercentage * circumference) / 100;
								cumulativePercentage += segment.percentage;

								// Get direct color values for reliable rendering
								const getStrokeColor = (colorClass: string) => {
									switch (colorClass) {
										case "bg-green-500":
											return "#10b981"; // Green-500
										case "bg-gray-500":
											return "#6b7280"; // Gray-500
										default:
											return "#6b7280"; // Default gray
									}
								};

								return (
									<m.circle
										key={segment.label}
										stroke={getStrokeColor(segment.color)}
										fill="transparent"
										strokeWidth={strokeWidth}
										strokeLinecap="round"
										r={normalizedRadius}
										cx={radius}
										cy={radius}
										initial={{ strokeDasharray: `0 ${circumference}` }}
										animate={{ strokeDasharray }}
										style={{ strokeDashoffset }}
										transition={{
											delay: index * 0.2,
											duration: 1,
											ease: "easeOut",
										}}
									/>
								);
							})}
						</svg>

						{/* Center content */}
						{centerValue && (
							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<m.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.8, duration: 0.5 }}
									className="text-center"
								>
									<div className="text-xl font-bold text-foreground">{animatedCenter}</div>
									{centerLabel && <div className="text-[10px] text-muted-foreground">{centerLabel}</div>}
								</m.div>
							</div>
						)}
					</div>

					{/* Legend */}
					<div className="flex-1 w-full space-y-3">
						{animatedData.map((item, index) => (
							<m.div
								key={item.label}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: index * 0.15 + 0.6, duration: 0.6 }}
								className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
							>
								<div className="flex items-center gap-2 min-w-0">
									<div className={`w-3 h-3 rounded-full ${item.color} shadow-sm flex-shrink-0`} />
									<span className="text-xs font-medium text-foreground truncate">{item.label}</span>
								</div>
								<div className="text-right flex-shrink-0 ml-2">
									<div className="text-sm font-bold text-foreground">{item.value}</div>
									<div className="text-[10px] text-muted-foreground font-medium">{item.percentage.toFixed(1)}%</div>
								</div>
							</m.div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}