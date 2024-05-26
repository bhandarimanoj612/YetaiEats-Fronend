// AuthStorage.js

import AsyncStorage from "@react-native-async-storage/async-storage";

class AuthStorage {
  constructor(namespace = "auth") {
    this.namespace = namespace;
    this.key = `${namespace}:token`;
  }

  async getAccessToken() {
    const rawToken = await AsyncStorage.getItem(this.key);
    return rawToken ? JSON.parse(rawToken) : null;
  }

  async setAccessToken(user) {
    await AsyncStorage.setItem(this.key, JSON.stringify(user));
  }

  async removeAccessToken() {
    await AsyncStorage.removeItem(this.key);
  }
}

export default AuthStorage;
