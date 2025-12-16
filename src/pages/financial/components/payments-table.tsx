import { Icon } from "@/components/icon";
import { type TrainerPayment, mockPayments } from "@/mocks/financial";
import { Badge } from "@/ui/badge";
import { Button } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Input } from "@/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

import { useState } from "react";
import { toast } from "sonner";

export default function PaymentsTable() {
	const [payments] = useState<TrainerPayment[]>(mockPayments);
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");

    // Calculate totals
    const totalPaid = payments.reduce((acc, curr) => acc + curr.paidAmount, 0);

	// Filter payments
	const filteredPayments = payments.filter((payment) => {
		const matchesSearch =
			payment.trainerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			payment.trainerEmail.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus = statusFilter === "all" || payment.subscriptionStatus === statusFilter;
		return matchesSearch && matchesStatus;
	});


	const getStatusBadge = (status: string) => {
		switch (status) {
			case "Active":
				return <Badge variant="default" className="bg-green-600 hover:bg-green-700">{status}</Badge>;
			case "Inactive":
				return <Badge variant="secondary">{status}</Badge>;
			case "Past Due":
				return <Badge variant="destructive">{status}</Badge>;
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	return (
		<div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue (This Month)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Active Subscriptions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{payments.filter(p => p.subscriptionStatus === "Active").length}</div>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader className="pb-2">
                         <CardTitle className="text-sm font-medium text-muted-foreground">Pending / Past Due</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{payments.filter(p => p.subscriptionStatus === "Past Due").length}</div>
                    </CardContent>
                 </Card>
            </div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Filters</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<Input
								placeholder="Search trainers..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full"
							/>
						</div>
						<Select value={statusFilter} onValueChange={setStatusFilter}>
							<SelectTrigger className="w-full sm:w-[180px]">
								<SelectValue placeholder="Subscription Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="Active">Active</SelectItem>
								<SelectItem value="Inactive">Inactive</SelectItem>
								<SelectItem value="Past Due">Past Due</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</CardContent>
			</Card>

			{/* Payments Table */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Icon icon="solar:card-send-bold-duotone" />
						Trainer Payments ({filteredPayments.length})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Trainer</TableHead>
									<TableHead>Month</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Paid Amount</TableHead>
                                    <TableHead>Payment Date</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredPayments.map((payment) => (
									<TableRow key={payment.id} className="hover:bg-muted/50">
										<TableCell>
											<div className="font-medium">{payment.trainerName}</div>
                                            <div className="text-xs text-muted-foreground">{payment.trainerEmail}</div>
										</TableCell>
                                        <TableCell>{payment.month}</TableCell>
										<TableCell>{getStatusBadge(payment.subscriptionStatus)}</TableCell>
										<TableCell>
                                            <span className="font-medium">
                                                {payment.currency === 'USD' ? '$' : payment.currency}
                                                {payment.paidAmount.toFixed(2)}
                                            </span>
										</TableCell>
                                        <TableCell>{payment.paymentDate}</TableCell>
										<TableCell className="text-right">
                                            <Button variant="ghost" size="sm" onClick={() => toast.info("View details not implemented")}>
                                                <Icon icon="solar:eye-bold-duotone" className="h-4 w-4" />
                                            </Button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{filteredPayments.length === 0 && (
						<div className="text-center py-8">
							<Icon
								icon="solar:card-send-bold-duotone"
								className="h-12 w-12 text-muted-foreground mx-auto mb-4"
							/>
							<h3 className="text-lg font-medium">No payments found</h3>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
