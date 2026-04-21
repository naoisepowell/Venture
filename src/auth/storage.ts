import AsyncStorage from "@react-native-async-storage/async-storage";

// key to store user id in local storage
const USER_ID_KEY = "venture_user_id";

//saves user id to stay logged in
export async function saveUserId(id: number) {
  await AsyncStorage.setItem(USER_ID_KEY, id.toString());
}

//gets saved user id from storage and converts to a number
export async function loadUserId(): Promise<number | null> {
  const raw = await AsyncStorage.getItem(USER_ID_KEY);
  if (!raw) return null;
  const parsed = parseInt(raw, 10);
  return isNaN(parsed) ? null : parsed;
}

// removes the saved user id when they log out
export async function clearUserId() {
  await AsyncStorage.removeItem(USER_ID_KEY);
}