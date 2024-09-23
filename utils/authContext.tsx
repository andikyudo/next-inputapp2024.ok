import { createContext, useContext, useState, useEffect } from "react";

// Definisikan tipe User
interface User {
	id: string;
	nrp: string;
	nama: string;
	// Tambahkan properti lain yang relevan untuk user Anda
}

type AuthContextType = {
	user: User | null;
	login: (userData: User) => void;
	logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	const login = (userData: User) => {
		setUser(userData);
		localStorage.setItem("user", JSON.stringify(userData));
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
