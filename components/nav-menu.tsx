import CardNav from './CardNav';
import logo from '@/assets/logo.png';

const navMenuItems = [
	{
		label: "About",
		bgColor: "#0D0716",
		textColor: "#fff",
		links: [
			{ label: "Company", ariaLabel: "About Company", href: "#" },
			{ label: "Careers", ariaLabel: "About Careers", href: "#" }
		]
	},
	{
		label: "Projects",
		bgColor: "#170D27",
		textColor: "#fff",
		links: [
			{ label: "Featured", ariaLabel: "Featured Projects", href: "#" },
			{ label: "Case Studies", ariaLabel: "Project Case Studies", href: "#" }
		]
	},
	{
		label: "Contact",
		bgColor: "#271E37",
		textColor: "#fff",
		links: [
			{ label: "Email", ariaLabel: "Email us", href: "#" },
			{ label: "Twitter", ariaLabel: "Twitter", href: "#" },
			{ label: "LinkedIn", ariaLabel: "LinkedIn", href: "#" }
		]
	}
];

export default function NavMenu() {
	return (
		<CardNav
			logo={logo.src}
			logoAlt="Cxperia"
			items={navMenuItems}
			baseColor="#fff"
			menuColor="#000"
			buttonBgColor="#111"
			buttonTextColor="#fff"
			ease="power3.out"
		/>
	);
}
