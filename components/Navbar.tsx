import Link from "next/link";
import { useAuth } from "../utils/authContext";

export default function NavBar() {
	const { user, logout } = useAuth();

	return (
		<nav className='bg-blue-500 p-4'>
			<div className='container mx-auto flex justify-between items-center'>
				<Link href='/' className='text-white font-bold'>
					Voting App
				</Link>
				<div>
					{user ? (
						<>
							<Link href='/dashboard' className='text-white mr-4'>
								Dashboard
							</Link>
							<Link href='/locations' className='text-white mr-4'>
								Locations
							</Link>
							<button onClick={logout} className='text-white'>
								Logout
							</button>
						</>
					) : (
						<Link href='/login' className='text-white'>
							Login
						</Link>
					)}
				</div>
			</div>
		</nav>
	);
}
