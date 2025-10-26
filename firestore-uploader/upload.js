const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const districtsData = require("./districts.json");
const materialsData = require("./materials.json");

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
}

async function uploadMaterials() {
  const materialsRef = db.collection("materials");

  for (const material of materialsData) {
    const docId = material.name.toLowerCase().replace(/\s+/g, '-');
    const docRef = materialsRef.doc(docId);
    await docRef.set(material);
    console.log(`Uploaded material: ${material.name}`);
  }
}

async function uploadData() {
  await uploadDistricts();
  await uploadMaterials();
  console.log("All data uploaded.");
}

uploadData();
