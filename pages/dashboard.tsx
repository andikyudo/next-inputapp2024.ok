import { useState, useEffect } from "react";
import { supabase } from "../utils/supabase";
import ProtectedRoute from "../components/ProtectedRoute";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

interface Session {
	id: string;
	username: string;
	login_time: string;
	logout_time: string | null;
	is_active: boolean;
	nama: string;
}

const ITEMS_PER_PAGE = 10;

export default function Dashboard() {
	const [totalUsers, setTotalUsers] = useState(500);
	const [sessions, setSessions] = useState<Session[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

	useEffect(() => {
		fetchSessions();
	}, [currentPage]);

	const fetchSessions = async () => {
		try {
			const { count } = await supabase
				.from("user_session")
				.select("*", { count: "exact" });

			setTotalUsers(count || 500);
			setTotalPages(Math.ceil((count || 500) / ITEMS_PER_PAGE));

			const { data, error } = await supabase
				.from("user_session")
				.select(
					`
          *,
          custom_users!inner(nama)
        `
				)
				.range(
					(currentPage - 1) * ITEMS_PER_PAGE,
					currentPage * ITEMS_PER_PAGE - 1
				)
				.order("login_time", { ascending: false });

			if (error) throw error;

			const formattedSessions = data.map((session) => ({
				...session,
				nama: session.custom_users.nama,
			}));

			setSessions(formattedSessions);
		} catch (error) {
			console.error("Error fetching sessions:", error);
		}
	};

	const activeUsers = sessions.filter((s) => s.is_active).length;
	const loggedOutUsers = sessions.filter((s) => !s.is_active).length;

	const loginData = [
		{ name: "Logged In", value: activeUsers },
		{ name: "Not Logged In", value: totalUsers - activeUsers },
	];

	const logoutData = [
		{ name: "Logged Out", value: loggedOutUsers },
		{ name: "Not Logged Out", value: totalUsers - loggedOutUsers },
	];

	const COLORS = ["#0088FE", "#00C49F"];

	const renderCustomizedLabel = ({
		cx,
		cy,
		midAngle,
		innerRadius,
		outerRadius,
		percent,
	}) => {
		const RADIAN = Math.PI / 180;
		const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
		const x = cx + radius * Math.cos(-midAngle * RADIAN);
		const y = cy + radius * Math.sin(-midAngle * RADIAN);

		return (
			<text
				x={x}
				y={y}
				fill='white'
				textAnchor={x > cx ? "start" : "end"}
				dominantBaseline='central'
			>
				{`${(percent * 100).toFixed(0)}%`}
			</text>
		);
	};

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	return (
		<ProtectedRoute>
			<div className='container mx-auto px-4 py-8'>
				<h1 className='text-2xl font-bold mb-4 text-gray-800 dark:text-white'>
					Monitoring Command Center
				</h1>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
					<div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>
						<h2 className='text-lg font-semibold mb-2 text-gray-800 dark:text-white'>
							Login Status
						</h2>
						<ResponsiveContainer width='100%' height={200}>
							<PieChart>
								<Pie
									data={loginData}
									cx='50%'
									cy='50%'
									labelLine={false}
									label={renderCustomizedLabel}
									outerRadius={80}
									fill='#8884d8'
									dataKey='value'
								>
									{loginData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Legend />
							</PieChart>
						</ResponsiveContainer>
						<p className='text-center mt-2 text-gray-600 dark:text-gray-300'>
							{activeUsers} out of {totalUsers} users logged in
						</p>
					</div>

					<div className='bg-white dark:bg-gray-800 p-4 rounded-lg shadow'>
						<h2 className='text-lg font-semibold mb-2 text-gray-800 dark:text-white'>
							Logout Status
						</h2>
						<ResponsiveContainer width='100%' height={200}>
							<PieChart>
								<Pie
									data={logoutData}
									cx='50%'
									cy='50%'
									labelLine={false}
									label={renderCustomizedLabel}
									outerRadius={80}
									fill='#8884d8'
									dataKey='value'
								>
									{logoutData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Legend />
							</PieChart>
						</ResponsiveContainer>
						<p className='text-center mt-2 text-gray-600 dark:text-gray-300'>
							{loggedOutUsers} out of {totalUsers} users logged out
						</p>
					</div>
				</div>

				<div className='overflow-x-auto'>
					<table className='w-full border-collapse'>
						<thead>
							<tr className='bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'>
								<th className='p-3 text-left'>No</th>
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
									key={session.id}
									className='border-b border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'
								>
									<td className='p-3 align-middle'>
										{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
									</td>
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

				<div className='mt-4 flex justify-center'>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
						<button
							key={page}
							onClick={() => handlePageChange(page)}
							className={`mx-1 px-3 py-1 rounded ${
								currentPage === page
									? "bg-blue-500 text-white"
									: "bg-gray-200 text-gray-700 hover:bg-gray-300"
							}`}
						>
							{page}
						</button>
					))}
				</div>
			</div>
		</ProtectedRoute>
	);
}
