import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import ProtectedRoute from "../components/ProtectedRoute";

interface Session {
	id: string;
	username: string;
	login_time: string;
	logout_time: string | null;
	is_active: boolean;
	nama: string;
}

export default function Dashboard() {
	const [sessions, setSessions] = useState<Session[]>([]);

	useEffect(() => {
		fetchSessions();
	}, []);

	const fetchSessions = async () => {
		try {
			const { data, error } = await supabase
				.from("user_session")
				.select(
					`
          *,
          custom_users!inner(nama)
        `
				)
				.order("login_time", { ascending: false });

			if (error) throw error;

			const uniqueSessions = data?.reduce((acc, current) => {
				const x = acc.find((item) => item.username === current.username);
				if (!x) {
					return acc.concat([{ ...current, nama: current.custom_users.nama }]);
				} else {
					return acc;
				}
			}, []);

			setSessions(uniqueSessions);
		} catch (error) {
			console.error("Error fetching sessions:", error);
		}
	};

	return (
		<ProtectedRoute>
			<div className='container mx-auto px-4 py-8'>
				<h1 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white'>
					Monitoring Command Center
				</h1>
				<div className='overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr className='bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'>
								<th className='p-3 text-left'>Name</th>
								<th className='p-3 text-left'>Username</th>
								<th className='p-3 text-left'>Login Time</th>
								<th className='p-3 text-left'>Logout Time</th>
								<th className='p-3 text-left'>Status</th>
							</tr>
						</thead>
						<tbody>
							{sessions.map((session, index) => (
								<tr
									key={index}
									className='border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'
								>
									<td className='p-3 align-middle'>{session.nama}</td>
									<td className='p-3 align-middle'>{session.username}</td>
									<td className='p-3 align-middle'>
										{new Date(session.login_time).toLocaleString()}
									</td>
									<td className='p-3 align-middle'>
										{session.logout_time
											? new Date(session.logout_time).toLocaleString()
											: "N/A"}
									</td>
									<td className='p-3 align-middle'>
										<span
											className={`px-2 py-1 rounded ${
												session.is_active ? "bg-green-500" : "bg-red-500"
											} text-white`}
										>
											{session.is_active ? "Active" : "Logged Out"}
										</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</ProtectedRoute>
	);

	// ... (kode lainnya tetap sama)
}
