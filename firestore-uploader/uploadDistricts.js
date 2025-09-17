const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const districtsData = require("./districts.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadDistricts() {
  const districtsRef = db.collection("districts");

  for (const district in districtsData) {
    if (districtsData.hasOwnProperty(district)) {
      const docRef = districtsRef.doc(district.toLowerCase());
      await docRef.set(districtsData[district]);
      console.log(`Uploaded district: ${district}`);
    }
  }

  console.log("All districts uploaded.");
}

uploadDistricts();
