import React from "react";
import { SignIn } from "@clerk/clerk-react";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-page">
      <div className="login-container">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "clerk-root",
              card: "clerk-card"
            }
          }}
          routing="path"
          path="/login"
          signUpUrl="/register"
          forceRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
};

export default Login;