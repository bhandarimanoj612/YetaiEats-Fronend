import React from "react";

import AppNavigation from "./navigation/AppNavigation";
import { AuthProvider } from "./src/ContextHook/AuthProvider";
import { StripeProvider } from "@stripe/stripe-react-native";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();
const App = () => {
  return (
    <AuthProvider>
      <StripeProvider publishableKey="pk_test_51OxTFa1bF7cmrKQ8J8woJL2eOtCuyzpVdQbry7QEbrNyIsLQGxz8uDzuGGyDzjuJnvAzinCZDJhFiXBwfppyv5Sb00J7uWDpaO">
        <AppNavigation />
      </StripeProvider>
    </AuthProvider>
  );
};

export default App;
