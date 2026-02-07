import { createContext, useContext, useState, useEffect} from "react";
import type { ReactNode } from "react";
import AuthService from "../service/AuthService";
import type { User } from "../service/AuthService";

interface AuthContextType {
    user: User | null;
    loading: boolean,
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: ReactNode}) {
    const [user,setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        try{
            const currentUser = await AuthService.getCurrentUser();
            setUser(currentUser);
        }catch(error) {
            setUser(null);
        }
    };

    useEffect(() => {
        refreshUser().finally(() => setLoading(false));
    }, []);

    const login = async( email:string, password: string) => {
        const user = await AuthService.login({email, password});
        setUser(user);
    };

    const logout = async () => {
        await AuthService.logout();
        setUser(null);
    };

  return (
        <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
          {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

