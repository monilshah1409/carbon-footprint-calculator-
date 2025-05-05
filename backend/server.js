const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('../firestore-uploader/serviceAccountKey.json');

const app = express();
const PORT = 4000;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.use(cors());
app.use(bodyParser.json());

app.get('/api/districts', async (req, res) => {
  try {
    const districtsSnapshot = await db.collection('districts').get();
    const districts = {};
    districtsSnapshot.forEach(doc => {
      districts[doc.id] = doc.data();
    });
    res.json(districts);
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({ error: 'Failed to fetch districts' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
