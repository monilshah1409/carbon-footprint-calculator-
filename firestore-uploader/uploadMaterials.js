const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const materialsData = require("./materials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function uploadMaterials() {
  const materialsRef = db.collection("materials");

  for (const material of materialsData) {
    const docId = material.name.toLowerCase().replace(/\s+/g, '-');
    const docRef = materialsRef.doc(docId);
    await docRef.set(material);
    console.log(`Uploaded material: ${material.name}`);
  }

  console.log("All materials uploaded.");
}

uploadMaterials();
