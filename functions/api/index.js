const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');
const { PinataSDK } = require('pinata-web3');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Aptos client
const config = new AptosConfig({ 
  network: Network.TESTNET,
  fullnode: "https://api.testnet.aptoslabs.com/v1"
});
const aptos = new Aptos(config);

// Initialize Pinata client
const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: 'gateway.pinata.cloud'
});

const MODULE_ADDRESS = process.env.VITE_MODULE_PUBLISHER_ACCOUNT_ADDRESS;

// In-memory storage for organizations
let organizationsCache = [];
let organizationsCID = null;

/**
 * Initialize organizations from Pinata if exists
 */
async function initializeOrganizations() {
  try {
    const files = await pinata.files.list();
    const orgFile = files.files.find(f => f.name === 'dapptrack-organizations.json');
    
    if (orgFile) {
      const data = await pinata.gateways.get(orgFile.cid);
      organizationsCache = data.data || [];
      organizationsCID = orgFile.cid;
      console.log(`📋 Loaded ${organizationsCache.length} organizations from IPFS`);
    }
  } catch (error) {
    console.log('📋 Starting with empty organizations list');
  }
}

/**
 * Save organizations to Pinata
 */
async function saveOrganizations() {
  try {
    const uploadResult = await pinata.upload.json(organizationsCache).addMetadata({
      name: 'dapptrack-organizations.json'
    });
    organizationsCID = uploadResult.IpfsHash;
    console.log(`💾 Organizations saved to IPFS: ${organizationsCID}`);
    return uploadResult;
  } catch (error) {
    console.error('Failed to save organizations:', error);
    throw error;
  }
}

// Routes
app.post('/upload-proof', upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = new File([req.file.buffer], req.file.originalname, { type: req.file.mimetype });
    const uploadResult = await pinata.upload.file(file);
    
    res.json({ 
      ipfsHash: uploadResult.IpfsHash,
      fileName: req.file.originalname,
      size: req.file.size,
      timestamp: uploadResult.Timestamp
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed', details: error.message });
  }
});

app.get('/events/funds', async (req, res) => {
  try {
    const events = await aptos.getAccountEventsByEventType({
      accountAddress: MODULE_ADDRESS,
      eventType: `${MODULE_ADDRESS}::dapptrack::FundAllocated`,
    });
    res.json({ events: events || [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to query funds', details: error.message });
  }
});

app.get('/events/donations', async (req, res) => {
  try {
    const events = await aptos.getAccountEventsByEventType({
      accountAddress: MODULE_ADDRESS,
      eventType: `${MODULE_ADDRESS}::dapptrack::DonationReceived`,
    });
    res.json({ events: events || [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to query donations', details: error.message });
  }
});

app.post('/organizations', async (req, res) => {
  try {
    const orgData = {
      ...req.body,
      id: Date.now().toString(),
      registeredAt: new Date().toISOString(),
      trustScore: 50,
      totalDonations: 0,
      activeFunds: 0,
      completedProjects: 0,
      beneficiaries: 0,
      verified: false,
      reviews: []
    };

    organizationsCache.push(orgData);
    await saveOrganizations();
    
    res.json({ 
      success: true,
      organization: orgData,
      ipfsHash: organizationsCID
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

app.get('/organizations', async (req, res) => {
  try {
    res.json({ 
      organizations: organizationsCache,
      ipfsHash: organizationsCID,
      count: organizationsCache.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organizations', details: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    network: 'testnet',
    moduleAddress: MODULE_ADDRESS,
    pinataConfigured: !!process.env.PINATA_JWT,
    timestamp: new Date().toISOString()
  });
});

// Appwrite Cloud Function Handler
module.exports = async (req, res) => {
  // Initialize organizations on cold start
  if (organizationsCache.length === 0) {
    await initializeOrganizations();
  }
  
  // Handle the request with Express
  return app(req, res);
};
