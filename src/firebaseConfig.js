import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  databaseURL: "https://fabulosa-play-default-rtdb.firebaseio.com", //
  projectId: "fabulosa-play", //
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app); //