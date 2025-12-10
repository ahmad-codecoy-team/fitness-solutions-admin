import logoSvg from "@/assets/icons/logo.svg";
import { cn } from "@/utils";
import { NavLink } from "react-router";

interface Props {
	size?: number | string;
	className?: string;
}
function Logo({ size = 50, className }: Props) {
	return (
		<NavLink to="/overview" className={cn("flex items-center justify-center ", className)}>
			<img src={logoSvg} alt="Fitness Solutions" style={{ height: size }} className="object-contain" />
		</NavLink>
	);
}

export default Logo;
