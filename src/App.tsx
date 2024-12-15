import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Home from "./component/Main";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../utils/userscontextthook";

function App() {
  const { login, register, isloggedIn } = useAuth();
  const [user, setUser] = useState({ email: "", password: "" });
  const [newUser, setNewUser] = useState({ username: "", email: "", password: "", phone: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleRegisterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prevNewUser) => ({ ...prevNewUser, [name]: value }));
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    login(user);
  };

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = register(newUser);
    console.log(result);
    setNewUser({ username: "", email: "", password: "", phone: "" });
    setIsRegistering(false);
  };

  useEffect(() => {
    if (isloggedIn) setUser({ email: "", password: "" });
  }, [isloggedIn]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  if (!isloggedIn) {
    return (
      <div className="w-screen h-screen flex justify-center items-center bg-slate-800 flex-col">
        <div className="p-4 shadow-lg border-slate-500 border border-opacity-15 rounded-md text-center w-[360px] bg-white bg-opacity-10">
          {isRegistering ? (
            <form className="flex-col flex" onSubmit={handleRegisterSubmit}>
              <h1 className="text-white font-bold text-2xl">KGIC</h1>
              <p className="text-xs text-white mb-3 text-opacity-20">
                Kingdom Greatness int'l church
              </p>
              <span className=" text-sm text-white mb-4 text-opacity-20">
                Create an Admin Account
              </span>

              <label htmlFor="username" className="w-full text-left mt-2 text-neutral-400">
                Username
              </label>
              <input
                type="text"
                name="username"
                className="p-1 bg-transparent w-full text-white border border-neutral-500 border-opacity-25 shadow-inner"
                onChange={handleRegisterChange}
                value={newUser.username}
                required
              />

              <label htmlFor="email" className="w-full text-left mt-2 text-neutral-400">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="p-1 bg-transparent w-full text-white border border-neutral-500 border-opacity-25 shadow-inner"
                onChange={handleRegisterChange}
                value={newUser.email}
                required
              />

              <label htmlFor="phone" className="w-full text-left mt-2 text-neutral-400">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                className="p-1 bg-transparent w-full text-white border border-neutral-500 border-opacity-25 shadow-inner"
                onChange={handleRegisterChange}
                value={newUser.phone}
                required
              />

              <label htmlFor="password" className="w-full text-left mt-2 text-neutral-400">
                Password
              </label>
              <div className="border border-neutral-500 border-opacity-25 shadow-inner flex">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="p-1 bg-transparent w-[90%] text-white"
                  onChange={handleRegisterChange}
                  value={newUser.password}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash
                    className="text-white self-center bg-slate-300 bg-opacity-15 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <FaEye
                    className="text-white self-center bg-slate-300 bg-opacity-15 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>

              <button
                type="submit"
                className="bg-slate-900 p-2 text-white my-4 hover:bg-slate-500 shadow-lg rounded"
              >
                Register
              </button>
              <p className="text-sm text-white">
                Already have an account? {" "}
                <button
                  type="button"
                  onClick={() => setIsRegistering(false)}
                  className="underline text-blue-400"
                >
                  Login
                </button>
              </p>
            </form>
          ) : (
            <form className="flex-col flex" onSubmit={handleLoginSubmit}>
              <h1 className="text-white font-bold text-2xl">KGIC</h1>
              <p className="text-xs text-white mb-3 text-opacity-20">
                Kingdom Greatness int'l church
              </p>
              <span className=" text-sm text-white mb-4 text-opacity-20">
                Welcome back Admin
              </span>
              <label
                htmlFor="email"
                className="w-full text-left mt-2 text-neutral-400"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                className="p-1 bg-transparent w-full text-white border border-neutral-500 border-opacity-25 shadow-inner"
                onChange={handleLoginChange}
                value={user.email}
                required
              />
              <label
                htmlFor="password"
                className="w-full text-left mt-2 text-neutral-400"
              >
                Password
              </label>
              <div className="border border-neutral-500 border-opacity-25 shadow-inner flex">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="p-1 bg-transparent w-[90%] text-white"
                  onChange={handleLoginChange}
                  value={user.password}
                  required
                />
                {showPassword ? (
                  <FaEyeSlash
                    className="text-white self-center bg-slate-300 bg-opacity-15 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <FaEye
                    className="text-white self-center bg-slate-300 bg-opacity-15 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                )}
              </div>

              <button
                type="submit"
                className="bg-slate-900 p-2 text-white my-4 hover:bg-slate-500 shadow-lg rounded"
              >
                Login
              </button>
              <p className="text-sm text-white">
                Forgot password? {" "}
                <button className="underline text-blue-400">Reset</button>
              </p>
              <p className="text-sm text-white mt-4">
                Don&apos;t have an account? {" "}
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="underline text-blue-400"
                >
                  Register
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Home />
    </div>
  );
}

export default App;
