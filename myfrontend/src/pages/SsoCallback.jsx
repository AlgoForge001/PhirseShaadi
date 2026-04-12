import React from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

const SsoCallback = () => {
  return <AuthenticateWithRedirectCallback signInForceRedirectUrl="/google-success" signUpForceRedirectUrl="/google-success" />;
};

export default SsoCallback;
