// import React from "react";
// import { View, Text, TouchableOpacity } from "react-native";
// import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import { useAuth } from "../ContextHook/AuthProvider";

// const SignIn = () => {
//   const navigation = useNavigation();
//   const { user } = useAuth();

//   // Use the useFocusEffect hook to handle navigation logic when the screen comes into focus
//   useFocusEffect(
//     React.useCallback(() => {
//       if (user) {
//         navigation.navigate("Account");
//       }
//     }, [user, navigation])
//   );

//   const handleSignIn = () => {
//     // Perform sign-in logic here
//     // For demonstration purposes, let's navigate to the account screen after sign-in
//     navigation.navigate("LogIn");
//   };

//   return (
//     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//       <Text style={{ fontSize: 24, marginBottom: 20 }}>Sign In Screen</Text>
//       <TouchableOpacity
//         onPress={handleSignIn}
//         style={{
//           backgroundColor: "yellow",
//           paddingVertical: 10,
//           paddingHorizontal: 20,
//           borderRadius: 5,
//         }}
//       >
//         <Text style={{ color: "black", fontSize: 18 }}>Sign In</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default SignIn;
