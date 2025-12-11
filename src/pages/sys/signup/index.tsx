import Logo from "@/components/logo";
import SettingButton from "@/layouts/components/setting-button";
import SignupForm from "./signup-form";

function SignupPage() {
	// Allow access to signup page even if user has a token
	// This is useful for testing or if someone wants to create another account

	return (
		<div className="relative flex min-h-svh bg-background">
			<div className="flex flex-col gap-4 p-6 md:p-10 w-full">
				<div className="flex justify-center gap-2">
					<div className="flex items-center gap-2 font-medium cursor-pointer">
						<Logo size={64} className="transition-transform hover:scale-105" />
					</div>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-md">
						<SignupForm />
					</div>
				</div>
			</div>

			<div className="absolute right-2 top-0 flex flex-row">
				<SettingButton />
			</div>
		</div>
	);
}

export default SignupPage;
