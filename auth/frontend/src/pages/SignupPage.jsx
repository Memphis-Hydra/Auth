import  { useState } from "react";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSignup = () => {
    const { username, password } = formData;

    let data = {
      username: username,
      password: password
    };

    fetch("http://localhost:8080/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((response) => {
        console.log("received data", response);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-xs">
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          className="w-full border border-gray-400 rounded py-2 px-3 mb-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          className="w-full border border-gray-400 rounded py-2 px-3 mb-4"
        />
        <button
          onClick={handleSignup}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
