import logo from '@/assets/logo.png';
import CardNav from './CardNav';

const navMenuItems = [
	{
		label: "Learn",
		bgColor: "#191970",
		textColor: "#fff",
		links: [
			{ label: "About Company", ariaLabel: "About Company", href: "#features" },
			{ label: 'Features', ariaLabel: 'Features', href: '#features' },
            { label: "Use Cases", ariaLabel: "Use Cases", href: "#tutorials" },
			{ label: "FAQ", ariaLabel: "FAQ", href: "#faq" }
		]
	},
	{
		label: "Pricing",
		bgColor: "#191970",
		textColor: "#fff",
		links: [
			{ label: "Plans", ariaLabel: "Pricing Plans", href: "#pricing" },
			{ label: "Compare", ariaLabel: "Compare Plans", href: "#compare" }
		]
	},
/* 	{
		label: "Brands",
		bgColor: "#191970",
		textColor: "#fff",
		links: [
			{ label: "Our Brands", ariaLabel: "Our Brands", href: "#brands" },
			{ label: "Join as Brand", ariaLabel: "Join as Brand", href: "#join-brand" }
		]
	},
	{
		label: "Tutorials",
		bgColor: "#191970",
		textColor: "#fff",
		links: [
			{ label: "Video Guides", ariaLabel: "Video Guides", href: "#video-guides" },
			{ label: "Tips & Tricks", ariaLabel: "Tips & Tricks", href: "#tips" }
		]
	},
	{
		label: "Contact",
		bgColor: "#191970",
		textColor: "#fff",
		links: [
			{ label: "Email", ariaLabel: "Email us", href: "mailto:hello@cxperia.com" },
			{ label: "Instagram", ariaLabel: "Instagram", href: "https://instagram.com/cxperia" },
			{ label: "Support", ariaLabel: "Support", href: "#support" }
		]
	} */
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
