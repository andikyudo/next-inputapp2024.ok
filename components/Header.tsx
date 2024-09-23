// components/Header.tsx
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../utils/authContext";

export default function Header() {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();
	const { user, logout } = useAuth();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<header className='bg-white dark:bg-gray-800 shadow-md'>
			<nav className='container mx-auto px-6 py-3'>
				<div className='flex justify-between items-center'>
					<div className='text-xl font-semibold text-gray-800 dark:text-white'>
						<Link href='/'>Voting App</Link>
					</div>
					<div className='flex items-center'>
						<Link
							href='/dashboard'
							className='text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mx-4'
						>
							Dashboard
						</Link>
						<Link
							href='/locations'
							className='text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mx-4'
						>
							Locations
						</Link>
						{user && (
							<button
								onClick={logout}
								className='text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white mx-4'
							>
								Logout
							</button>
						)}
						<button
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							className='p-2 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'
						>
							{theme === "dark" ? "🌞" : "🌙"}
						</button>
					</div>
				</div>
			</nav>
		</header>
	);
}
