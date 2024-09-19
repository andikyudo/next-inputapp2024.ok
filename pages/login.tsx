import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../utils/authContext";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();
	const { login } = useAuth();

	const handleSubmit = (e) => {
		e.preventDefault();
		// Dummy auth logic
		if (username === "admin" && password === "password") {
			login({ id: 1, username: "admin" });
			router.push("/dashboard");
		} else {
			alert("Invalid credentials");
		}
	};

	return (
		<div className='max-w-md mx-auto mt-10'>
			<form
				onSubmit={handleSubmit}
				className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'
			>
				<div className='mb-4'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='username'
					>
						Username
					</label>
					<input
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
						id='username'
						type='text'
						placeholder='Username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
				</div>
				<div className='mb-6'>
					<label
						className='block text-gray-700 text-sm font-bold mb-2'
						htmlFor='password'
					>
						Password
					</label>
					<input
						className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
						id='password'
						type='password'
						placeholder='******************'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className='flex items-center justify-between'>
					<button
						className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
						type='submit'
					>
						Sign In
					</button>
				</div>
			</form>
		</div>
	);
}
