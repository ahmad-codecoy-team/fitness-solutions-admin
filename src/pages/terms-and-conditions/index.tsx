import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Icon } from "@/components/icon";
import { mockLegalContent } from "@/mocks/legal";
import { format } from "date-fns";

export default function TermsAndConditions() {
	const termsAndConditions = mockLegalContent.find(content => content.type === 'terms-and-conditions');

	if (!termsAndConditions) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<h2 className="text-2xl font-semibold">Terms and Conditions Not Found</h2>
				<p className="text-muted-foreground">The terms and conditions content is not available.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 p-6">
			<Helmet>
				<title>Terms and Conditions - Fitness Solutions Admin</title>
			</Helmet>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Terms and Conditions</h1>
					<p className="text-muted-foreground">Manage terms and conditions content</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<Icon icon="solar:document-text-bold-duotone" className="h-5 w-5 text-primary" />
								{termsAndConditions.title}
							</CardTitle>
							<div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
								<div className="flex items-center gap-1">
									<Icon icon="solar:calendar-bold-duotone" className="h-4 w-4" />
									Last updated: {format(new Date(termsAndConditions.lastUpdated), 'MMM dd, yyyy')}
								</div>
								<div className="flex items-center gap-1">
									<Icon icon="solar:user-bold-duotone" className="h-4 w-4" />
									By: {termsAndConditions.updatedBy}
								</div>
								<div className="flex items-center gap-1">
									<Icon icon="solar:tag-bold-duotone" className="h-4 w-4" />
									Version: {termsAndConditions.version}
								</div>
							</div>
						</div>
						<Badge variant={termsAndConditions.status === 'published' ? 'default' : 'secondary'}>
							{termsAndConditions.status}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="prose prose-gray max-w-none dark:prose-invert">
						<div 
							className="whitespace-pre-wrap"
							dangerouslySetInnerHTML={{ 
								__html: termsAndConditions.content.replace(/\n/g, '<br />').replace(/#{1,6}/g, '') 
							}} 
						/>
					</div>
				</CardContent>
			</Card>

			{/* Action Buttons */}
			<div className="flex items-center gap-2">
				<button 
					className="inline-flex items-center gap-2 px-4 py-2 bg-[#5942d9] text-white rounded-md hover:bg-[#5942d9]/90 transition-colors"
					onClick={() => console.log('Edit terms and conditions')}
				>
					<Icon icon="solar:pen-bold-duotone" className="h-4 w-4" />
					Edit Terms
				</button>
				<button 
					className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
					onClick={() => console.log('Preview terms and conditions')}
				>
					<Icon icon="solar:eye-bold-duotone" className="h-4 w-4" />
					Preview
				</button>
			</div>
		</div>
	);
}