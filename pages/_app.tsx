// pages/_app.tsx
import { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "../utils/authContext";
import Layout from "../components/Layout";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AuthProvider>
			<ThemeProvider attribute='class'>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</ThemeProvider>
		</AuthProvider>
	);
}

export default MyApp;
