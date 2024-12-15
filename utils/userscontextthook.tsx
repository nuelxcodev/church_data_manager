import React, { createContext, ReactNode, useContext, useState, useEffect } from "react";
import bcrypt from "bcryptjs-react";

interface AuthContextType {
  user: User | null;
  isloggedIn: boolean;
  register: (userinfo: Userinfo) => string;
  login: (userdata: User) => string;
  logout: () => void;
}

interface User {
  email: string;
  password: string;
}

interface Userinfo {
  username: string;
  password: string;
  email: string;
  phone: string;
}

const initialData: AuthContextType = {
  user: null,
  register: () => "",
  isloggedIn: false,
  login: () => "",
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(initialData);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isloggedIn, setIsloggedIn] = useState(false);

  // Fetch users from sessionStorage
  const getStoredUsers = (): Userinfo[] => {
    const users = sessionStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  };

  // Save users to sessionStorage
  const saveUsers = (users: Userinfo[]) => {
    sessionStorage.setItem("users", JSON.stringify(users));
  };

  const register = (userinfo: Userinfo): string => {
    const users = getStoredUsers();

    // Check if email already exists
    if (users.find((u) => u.email === userinfo.email)) {
      return "User already exists";
    }

    // Hash the password before saving
    const hashedPassword = bcrypt.hashSync(userinfo.password, bcrypt.genSaltSync(10));
    const newUser = { ...userinfo, password: hashedPassword };

    // Save to storage
    users.push(newUser);
    saveUsers(users);

    return "Registration successful";
  };

  const login = (userdata: User): string => {
    const users = getStoredUsers();

    const existingUser = users.find((u) => u.email === userdata.email);

    if (!existingUser) {
      return "User not found";
    }

    // Verify password
    const isPasswordValid = bcrypt.compareSync(userdata.password, existingUser.password);
    if (!isPasswordValid) {
      return "Invalid credentials";
    }

    // Set user state
    setUser({ email: existingUser.email, password: existingUser.password });
    setIsloggedIn(true);

    // Save session
    sessionStorage.setItem("sessionUser", JSON.stringify({ email: existingUser.email }));

    return "Login successful";
  };

  const logout = () => {
    setIsloggedIn(false);
    setUser(null);

    // Clear session
    sessionStorage.removeItem("sessionUser");
  };

  useEffect(() => {
    // Restore session on load
    const sessionUser = sessionStorage.getItem("sessionUser");
    if (sessionUser) {
      const userEmail = JSON.parse(sessionUser).email;
      const users = getStoredUsers();
      const existingUser = users.find((u) => u.email === userEmail);
      if (existingUser) {
        setUser({ email: existingUser.email, password: existingUser.password });
        setIsloggedIn(true);
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, isloggedIn, user, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};
