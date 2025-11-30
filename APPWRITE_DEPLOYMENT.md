# 🚀 Deploy DappTrack on Appwrite

Complete guide to deploy the DappTrack platform on Appwrite Cloud.

## 📋 Prerequisites

- Appwrite Cloud account (sign up at https://cloud.appwrite.io)
- Appwrite CLI installed: `npm install -g appwrite-cli`
- Git repository pushed to GitHub
- Pinata API credentials for IPFS

## 🏗️ Project Structure

```
dapptrack/
├── functions/
│   └── api/              # Appwrite Cloud Function
│       ├── index.js      # API handler
│       └── package.json  # Dependencies
├── dist/                 # Frontend build (after npm run build)
├── appwrite.json         # Appwrite configuration
└── .env                  # Local environment (not deployed)
```

## 🔧 Step 1: Setup Appwrite Project

### Login to Appwrite
```bash
appwrite login
```
Enter your Appwrite Cloud credentials when prompted.

### Initialize Project
```bash
cd c:\Users\user\Desktop\Hackathons\Build-on-Aptos\DappTrack\dapptrack
appwrite init project
```

**Configuration:**
- Choose: **Appwrite Cloud**
- Project ID: `dapptrack` (or your preferred ID)
- Project Name: `DappTrack`

This will update your `appwrite.json` with your project details.

## 📡 Step 2: Deploy Backend (Cloud Function)

### Deploy the API Function
```bash
appwrite deploy function
```

Select: `api` function when prompted.

This deploys the backend API as an Appwrite Cloud Function.

### Set Environment Variables

Go to Appwrite Console → Functions → DappTrack API → Settings → Variables

Add these environment variables:

```env
VITE_APP_NETWORK=testnet
VITE_MODULE_PUBLISHER_ACCOUNT_ADDRESS=0x80ab1ccee8fbcfdbd54e0efe1643a41617b4cf7ca7659be6dc0169d2dddf275b
PINATA_API_KEY=<your_pinata_api_key>
PINATA_SECRET_KEY=<your_pinata_secret_key>
PINATA_JWT=<your_pinata_jwt_token>
```

### Get Your Function URL

After deployment, you'll get a function URL like:
```
https://cloud.appwrite.io/v1/functions/{functionId}/executions
```

Or in Appwrite Console:
- Go to Functions → DappTrack API
- Copy the "Domain" URL

## 🌐 Step 3: Deploy Frontend

### Option A: Appwrite Storage (Recommended)

1. **Build the frontend:**
```bash
npm run build
```

2. **Create a storage bucket in Appwrite Console:**
   - Go to Storage → Create Bucket
   - Name: `dapptrack-frontend`
   - Permissions: Public read access
   - Enable "File Security": OFF

3. **Upload dist/ files:**
   - Go to your bucket → Files
   - Upload all files from `dist/` folder
   - Enable "Website Hosting" in bucket settings
   - Set `index.html` as index document

4. **Access URL:**
   Your app will be available at:
   ```
   https://cloud.appwrite.io/v1/storage/buckets/{bucketId}/files/{fileId}/view
   ```

### Option B: Vercel/Netlify (Alternative)

Since Appwrite static hosting is in beta, you can deploy frontend separately:

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Then update `VITE_BACKEND_URL` to your Appwrite function URL.

## 🔄 Step 4: Connect Frontend to Backend

Update your frontend environment variables to point to Appwrite function:

### In Vercel/Netlify Dashboard:

Add environment variable:
```
VITE_BACKEND_URL=https://cloud.appwrite.io/v1/functions/{functionId}/executions
```

### Or update dist files:

The build already includes the backend URL. If needed, rebuild with:

```bash
# Set env var
$env:VITE_BACKEND_URL="https://your-function-url"

# Rebuild
npm run build

# Redeploy
```

## 🧪 Step 5: Test Deployment

### Test Backend API
```bash
curl https://cloud.appwrite.io/v1/functions/{functionId}/executions \
  -H "Content-Type: application/json" \
  -d '{"path": "/health", "method": "GET"}'
```

### Test Frontend
Open your frontend URL and verify:
- ✅ Pages load correctly
- ✅ Wallet connection works
- ✅ Blockchain queries succeed
- ✅ API calls reach backend function

## 📊 Monitoring & Logs

### View Function Logs
```bash
appwrite functions listExecutions --functionId=api
```

Or in Appwrite Console:
- Functions → DappTrack API → Executions
- View real-time logs and execution history

## 🔐 Security Configuration

### Set Function Permissions

In Appwrite Console → Functions → DappTrack API → Settings:

- **Execute Access**: `Any` (public API)
- **Timeout**: 15 seconds
- **Enabled**: Yes
- **Logging**: Enabled

### CORS Configuration

The function already includes CORS middleware. If you need to restrict origins:

Edit `functions/api/index.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.com']
}));
```

## 📝 API Endpoints

Your Appwrite function exposes these endpoints:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/organizations` | List organizations |
| POST | `/organizations` | Register organization |
| POST | `/upload-proof` | Upload IPFS proof |
| GET | `/events/donations` | Query donations |
| GET | `/events/funds` | Query funds |

**Access via:**
```
POST https://cloud.appwrite.io/v1/functions/{functionId}/executions
Body: {
  "path": "/health",
  "method": "GET"
}
```

## 🔄 Update Deployment

### Update Backend
```bash
# Make changes to functions/api/index.js
appwrite deploy function
```

### Update Frontend
```bash
# Make changes to frontend
npm run build

# Re-upload to Appwrite Storage
# Or redeploy to Vercel/Netlify
```

## 💾 Database (Optional Enhancement)

For production, consider adding Appwrite Database:

1. **Create Database:**
   - Console → Databases → Create Database
   - Name: `dapptrack`

2. **Create Collections:**
   - `organizations` - Store org data
   - `projects` - Store projects
   - `donations` - Cache donations

3. **Update Function:**
   Replace IPFS storage with Appwrite Database queries

## 🎯 Production Checklist

- [ ] Appwrite project created
- [ ] Cloud function deployed
- [ ] Environment variables set
- [ ] Frontend built and hosted
- [ ] Backend URL configured in frontend
- [ ] CORS configured
- [ ] Health check passing
- [ ] Wallet connection working
- [ ] Blockchain queries successful
- [ ] IPFS uploads functional
- [ ] Monitoring enabled

## 🆘 Troubleshooting

### Function Not Responding
- Check function logs in Console
- Verify environment variables
- Ensure function is enabled

### CORS Errors
- Check CORS middleware in function
- Verify frontend domain is allowed

### Build Errors
- Run `npm install` in `functions/api`
- Check Node.js version (18+)

### Storage Upload Issues
- Verify bucket permissions
- Check file size limits (10MB default)
- Ensure bucket has public read access

## 📞 Support

- **Appwrite Docs**: https://appwrite.io/docs
- **Discord**: https://appwrite.io/discord
- **GitHub Issues**: https://github.com/mdsaad31/DappTrack/issues

## 🎉 Success!

Your DappTrack platform is now deployed on Appwrite Cloud!

**Frontend**: Static hosting on Appwrite Storage or Vercel  
**Backend**: Appwrite Cloud Function  
**Blockchain**: Aptos Testnet  
**Storage**: IPFS via Pinata

---

**Built with ❤️ using Appwrite Cloud Platform**
