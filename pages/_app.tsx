import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import "../styles/globals.css";
import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<ThemeProvider attribute='class'>
			<div className='min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300'>
				<Header />
				<Component {...pageProps} />
			</div>
		</ThemeProvider>
	);
}

export default MyApp;
