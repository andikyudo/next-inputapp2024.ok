import NavBar from "./NavBar";

export default function Layout({ children }) {
	return (
		<div className='min-h-screen bg-gray-100'>
			<NavBar />
			<main className='container mx-auto mt-4 p-4'>{children}</main>
		</div>
	);
}
