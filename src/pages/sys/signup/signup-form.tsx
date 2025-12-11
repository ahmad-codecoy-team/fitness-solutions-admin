import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { cn } from "@/utils";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Icon } from "@/components/icon";

interface SignupFormData {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export function SignupForm({ className, ...props }: React.ComponentPropsWithoutRef<"form">) {
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const form = useForm<SignupFormData>({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const handleSignup = async (values: SignupFormData) => {
		// Validate password confirmation
		if (values.password !== values.confirmPassword) {
			form.setError("confirmPassword", {
				type: "manual",
				message: "Passwords do not match"
			});
			return;
		}

		setLoading(true);
		try {
			// TODO: Replace with actual API call
			console.log("Signup data:", {
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				password: values.password,
			});

			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 1500));

			toast.success("Account created successfully!", {
				description: "Please check your email to verify your account.",
				closeButton: true,
			});

			// Redirect to login page
			navigate("/login");
		} catch (error) {
			console.error("Signup error:", error);
			toast.error("Failed to create account", {
				description: "Please try again later.",
				closeButton: true,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={cn("flex flex-col gap-6", className)}>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(handleSignup)} className="space-y-4">
					<div className="flex flex-col items-center gap-2 text-center">
						<Icon icon="solar:user-plus-bold-duotone" className="h-12 w-12 text-primary" />
						<h1 className="text-2xl font-bold">Create Trainer Account</h1>
						<p className="text-balance text-sm text-muted-foreground">
							Join our fitness platform and start managing your clients
						</p>
					</div>

					{/* First Name */}
					<FormField
						control={form.control}
						name="firstName"
						rules={{ required: "First name is required" }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input placeholder="Enter your first name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Last Name */}
					<FormField
						control={form.control}
						name="lastName"
						rules={{ required: "Last name is required" }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input placeholder="Enter your last name" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Email */}
					<FormField
						control={form.control}
						name="email"
						rules={{ 
							required: "Email is required",
							pattern: {
								value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
								message: "Please enter a valid email address"
							}
						}}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input placeholder="Enter your email" type="email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Password */}
					<FormField
						control={form.control}
						name="password"
						rules={{ 
							required: "Password is required",
							minLength: {
								value: 6,
								message: "Password must be at least 6 characters"
							}
						}}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="Create a password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Confirm Password */}
					<FormField
						control={form.control}
						name="confirmPassword"
						rules={{ required: "Please confirm your password" }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Confirm Password</FormLabel>
								<FormControl>
									<Input type="password" placeholder="Confirm your password" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					{/* Signup Button */}
					<Button type="submit" className="w-full" disabled={loading}>
						{loading && <Loader2 className="animate-spin mr-2" />}
						{loading ? "Creating Account..." : "Create Account"}
					</Button>

					{/* Login Link */}
					<div className="text-center">
						<p className="text-sm text-muted-foreground">
							Already have an account?{" "}
							<Button 
								variant="link" 
								className="p-0 h-auto font-semibold text-primary"
								onClick={() => navigate("/login")}
								type="button"
							>
								Sign In
							</Button>
						</p>
					</div>
				</form>
			</Form>
		</div>
	);
}

export default SignupForm;