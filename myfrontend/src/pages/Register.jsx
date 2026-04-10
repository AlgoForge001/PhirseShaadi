import React from "react";
import { SignUp } from "@clerk/clerk-react";
import "./Register.css";

const Register = () => {
  return (
    <div className="register-page">
      <div className="register-container">
        <SignUp
          appearance={{
            elements: {
              rootBox: "clerk-root",
              card: "clerk-card"
            }
          }}
          routing="path"
          path="/register"
          signInUrl="/login"
        />
      </div>
    </div>
  );
};

export default Register;