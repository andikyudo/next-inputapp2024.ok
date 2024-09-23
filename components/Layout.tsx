import Header from "./Header";

export default function Layout({ children }) {
	return (
		<div className='min-h-screen bg-gray-100 dark:bg-gray-900'>
			<Header />
			<main className='container mx-auto mt-4 p-4'>{children}</main>
		</div>
	);
}
