import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function LoginPage() {
  const navigate = useNavigate(); // Access the navigate function

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    const data = {
      username: username,
      password: password,
    };

    fetch("http://localhost:8080/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => {
      if (res.status === 200) {
        navigate("/upload"); // Redirect to /upload on successful login
      } else {
        // Handle login failure here, such as displaying an error message.
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-xs">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-400 rounded py-2 px-3 mb-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-400 rounded py-2 px-3 mb-4"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover-bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
