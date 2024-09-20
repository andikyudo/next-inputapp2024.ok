import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

interface User {
	id: string;
	nama: string;
	nrp: number;
	password: string;
}

interface Session {
	id: string;
	user_id: string;
	login_time: string;
	logout_time: string | null;
	is_active: boolean;
}

interface CombinedUserData extends User {
	session?: Session;
}

const Dashboard: React.FC = () => {
	const [users, setUsers] = useState<CombinedUserData[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const usersPerPage = 10;

	useEffect(() => {
		fetchUsers();
		const interval = setInterval(fetchUsers, 30000); // Refresh every 30 seconds
		return () => clearInterval(interval);
	}, [currentPage]);

	const fetchUsers = async () => {
		try {
			setLoading(true);

			// Fetch users
			const {
				data: userData,
				error: userError,
				count,
			} = await supabase
				.from("custom_users")
				.select("*", { count: "exact" })
				.range((currentPage - 1) * usersPerPage, currentPage * usersPerPage - 1)
				.order("nama", { ascending: true });

			if (userError) throw userError;

			// Fetch latest session for each user
			const { data: sessionData, error: sessionError } = await supabase
				.from("user_session")
				.select("*")
				.in(
					"user_id",
					userData.map((user) => user.id)
				)
				.order("login_time", { ascending: false });

			if (sessionError) throw sessionError;

			// Combine user and latest session data
			const combinedData = userData.map((user) => ({
				...user,
				session: sessionData.find((session) => session.user_id === user.id),
			}));

			setUsers(combinedData);
			setTotalPages(Math.ceil((count || 0) / usersPerPage));
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	return (
		<div className='bg-gray-100 min-h-screen p-8'>
			<div className='max-w-7xl mx-auto'>
				<h1 className='text-4xl font-bold text-gray-800 mb-8'>
					User Dashboard
				</h1>
				<div className='bg-white shadow-lg rounded-lg overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									{[
										"NAMA",
										"NRP",
										"PASSWORD",
										"LOGIN TIME",
										"LOGOUT TIME",
										"STATUS",
									].map((header) => (
										<th
											key={header}
											className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											{header}
										</th>
									))}
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{users.map((user) => (
									<tr key={user.id} className='hover:bg-gray-50'>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
											{user.nama}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{user.nrp}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											••••••••
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{user.session?.login_time
												? new Date(user.session.login_time).toLocaleString()
												: "N/A"}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{user.session?.logout_time
												? new Date(user.session.logout_time).toLocaleString()
												: "N/A"}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<span
												className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
													user.session?.is_active
														? "bg-green-100 text-green-800"
														: "bg-red-100 text-red-800"
												}`}
											>
												{user.session?.is_active
													? "Sedang Login"
													: "Sudah Logout"}
											</span>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
				<div className='mt-6 flex justify-between items-center'>
					<button
						onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
						disabled={currentPage === 1}
						className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out'
					>
						Previous
					</button>
					<span className='text-gray-600 font-medium'>
						Page {currentPage} of {totalPages}
					</span>
					<button
						onClick={() =>
							setCurrentPage((prev) => Math.min(prev + 1, totalPages))
						}
						disabled={currentPage === totalPages}
						className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 ease-in-out'
					>
						Next
					</button>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
