import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { Icon } from "@/components/icon";
import { mockLegalContent } from "@/mocks/legal";
import { format } from "date-fns";

export default function PrivacyPolicy() {
	const privacyPolicy = mockLegalContent.find(content => content.type === 'privacy-policy');

	if (!privacyPolicy) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<h2 className="text-2xl font-semibold">Privacy Policy Not Found</h2>
				<p className="text-muted-foreground">The privacy policy content is not available.</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-6 p-6">
			<Helmet>
				<title>Privacy Policy - Fitness Solutions Admin</title>
			</Helmet>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
					<p className="text-muted-foreground">Manage privacy policy content</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<CardTitle className="flex items-center gap-2">
								<Icon icon="solar:shield-check-bold-duotone" className="h-5 w-5 text-primary" />
								{privacyPolicy.title}
							</CardTitle>
							<div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
								<div className="flex items-center gap-1">
									<Icon icon="solar:calendar-bold-duotone" className="h-4 w-4" />
									Last updated: {format(new Date(privacyPolicy.lastUpdated), 'MMM dd, yyyy')}
								</div>
								<div className="flex items-center gap-1">
									<Icon icon="solar:user-bold-duotone" className="h-4 w-4" />
									By: {privacyPolicy.updatedBy}
								</div>
								<div className="flex items-center gap-1">
									<Icon icon="solar:tag-bold-duotone" className="h-4 w-4" />
									Version: {privacyPolicy.version}
								</div>
							</div>
						</div>
						<Badge variant={privacyPolicy.status === 'published' ? 'default' : 'secondary'}>
							{privacyPolicy.status}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<div className="prose prose-gray max-w-none dark:prose-invert">
						<div 
							className="whitespace-pre-wrap"
							dangerouslySetInnerHTML={{ 
								__html: privacyPolicy.content.replace(/\n/g, '<br />').replace(/#{1,6}/g, '') 
							}} 
						/>
					</div>
				</CardContent>
			</Card>

			{/* Action Buttons */}
			<div className="flex items-center gap-2">
				<button 
					className="inline-flex items-center gap-2 px-4 py-2 bg-[#5942d9] text-white rounded-md hover:bg-[#5942d9]/90 transition-colors"
					onClick={() => console.log('Edit privacy policy')}
				>
					<Icon icon="solar:pen-bold-duotone" className="h-4 w-4" />
					Edit Privacy Policy
				</button>
				<button 
					className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
					onClick={() => console.log('Preview privacy policy')}
				>
					<Icon icon="solar:eye-bold-duotone" className="h-4 w-4" />
					Preview
				</button>
			</div>
		</div>
	);
}