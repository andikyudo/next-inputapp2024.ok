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
	}, [currentPage]);

	const fetchUsers = async () => {
		try {
			setLoading(true);

			// Try both table names for users
			const userTableNames = ["custom_users", "custom_user"];
			let userData = null;
			let userError = null;
			let count = 0;

			for (const tableName of userTableNames) {
				const result = await supabase
					.from(tableName)
					.select("*", { count: "exact" })
					.range(
						(currentPage - 1) * usersPerPage,
						currentPage * usersPerPage - 1
					)
					.order("nama", { ascending: true });

				if (!result.error) {
					userData = result.data;
					count = result.count || 0;
					break;
				} else {
					userError = result.error;
				}
			}

			if (userError && !userData) throw userError;

			// Try both table names for sessions
			const sessionTableNames = ["user_session", "user_sessions"];
			let sessionData = null;
			let sessionError = null;

			for (const tableName of sessionTableNames) {
				const result = await supabase
					.from(tableName)
					.select("*")
					.in(
						"user_id",
						userData.map((user) => user.id)
					);

				if (!result.error) {
					sessionData = result.data;
					break;
				} else {
					sessionError = result.error;
				}
			}

			if (sessionError && !sessionData) throw sessionError;

			// Combine user and session data
			const combinedData = userData.map((user) => ({
				...user,
				session: sessionData.find((session) => session.user_id === user.id),
			}));

			setUsers(combinedData);
			setTotalPages(Math.ceil(count / usersPerPage));
		} catch (error) {
			console.error("Error fetching data:", error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return <div className='text-center py-4'>Loading...</div>;
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-6'>User Dashboard</h1>
			<div className='overflow-x-auto'>
				<table className='min-w-full bg-white shadow-md rounded'>
					<thead className='bg-gray-200'>
						<tr>
							<th className='px-4 py-2 text-left'>NAMA</th>
							<th className='px-4 py-2 text-left'>NRP</th>
							<th className='px-4 py-2 text-left'>PASSWORD</th>
							<th className='px-4 py-2 text-left'>LOGIN TIME</th>
							<th className='px-4 py-2 text-left'>LOGOUT TIME</th>
							<th className='px-4 py-2 text-left'>STATUS</th>
						</tr>
					</thead>
					<tbody>
						{users.map((user) => (
							<tr key={user.id} className='border-b'>
								<td className='px-4 py-2'>{user.nama}</td>
								<td className='px-4 py-2'>{user.nrp}</td>
								<td className='px-4 py-2'>••••••••</td>
								<td className='px-4 py-2'>
									{user.session?.login_time
										? new Date(user.session.login_time).toLocaleString()
										: "N/A"}
								</td>
								<td className='px-4 py-2'>
									{user.session?.logout_time
										? new Date(user.session.logout_time).toLocaleString()
										: "N/A"}
								</td>
								<td className='px-4 py-2'>
									<span
										className={`px-2 py-1 rounded-full text-xs ${
											user.session?.is_active
												? "bg-green-200 text-green-800"
												: "bg-red-200 text-red-800"
										}`}
									>
										{user.session?.is_active ? "Sedang Login" : "Sudah Logout"}
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className='mt-4 flex justify-between items-center'>
				<button
					onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
					disabled={currentPage === 1}
					className='bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300'
				>
					Previous
				</button>
				<span>
					Page {currentPage} of {totalPages}
				</span>
				<button
					onClick={() =>
						setCurrentPage((prev) => Math.min(prev + 1, totalPages))
					}
					disabled={currentPage === totalPages}
					className='bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300'
				>
					Next
				</button>
			</div>
		</div>
	);
};

export default Dashboard;
