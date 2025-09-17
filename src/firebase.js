import * as firebaseApp from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3zuL6R1w5dLtfz2_dc-L9-4i8gFst9bk",
  authDomain: "cc-prototype-6541c.firebaseapp.com",
  projectId: "cc-prototype-6541c",
  storageBucket: "cc-prototype-6541c.firebasestorage.app",
  messagingSenderId: "521476836758",
  appId: "1:521476836758:web:96595eef4e57862254a1b7",
  measurementId: "G-YX7G779FQE"
};

// Initialize Firebase
const app = firebaseApp.initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// No authentication export needed as it's removed
