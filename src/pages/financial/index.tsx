import { Helmet } from "react-helmet-async";
import PaymentsTable from "./components/payments-table";

export default function FinancialPage() {
	return (
		<div className="flex flex-col gap-4 p-6">
			<Helmet>
				<title>Financial - Fitness Solutions Admin</title>
			</Helmet>

             <div className="flex items-center justify-between">
                <div>
					<h1 className="text-3xl font-bold text-foreground">Financial & Subscriptions</h1>
					<p className="text-muted-foreground">Track money, subscriptions, and payments from trainers.</p>
				</div>
            </div>

			<PaymentsTable />
		</div>
	);
}
