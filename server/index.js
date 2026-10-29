import express from 'express';
import cors from 'cors';
import { 
  launchApplication, 
  openUrl, 
  setVolume, 
  captureScreenshot, 
  getRunningProcesses, 
  killProcess, 
  lockSystem, 
  emptyRecycleBin, 
  runTerminalCommand 
} from './desktopControl.js';
import { getSystemMetrics } from './systemStats.js';
import { processAgentRequest, updateApiKeys, getApiKeysStatus } from './aiRouter.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', app: 'AURA PC Assistant Server', timestamp: new Date() });
});

// System Metrics
app.get('/api/system/metrics', async (req, res) => {
  try {
    const metrics = await getSystemMetrics();
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Desktop Automation Endpoints
app.post('/api/desktop/launch', async (req, res) => {
  const { appName } = req.body;
  if (!appName) return res.status(400).json({ error: 'appName é obrigatório.' });
  const result = await launchApplication(appName);
  res.json(result);
});

app.post('/api/desktop/volume', async (req, res) => {
  const { action, value } = req.body;
  const result = await setVolume(action || 'up', value || 10);
  res.json(result);
});

app.get('/api/desktop/screenshot', async (req, res) => {
  const result = await captureScreenshot();
  res.json(result);
});

app.get('/api/desktop/processes', async (req, res) => {
  const result = await getRunningProcesses();
  res.json(result);
});

app.post('/api/desktop/kill', async (req, res) => {
  const { target } = req.body;
  const result = await killProcess(target);
  res.json(result);
});

app.post('/api/desktop/lock', async (req, res) => {
  const result = await lockSystem();
  res.json(result);
});

app.post('/api/desktop/clean-recycle', async (req, res) => {
  const result = await emptyRecycleBin();
  res.json(result);
});

app.post('/api/desktop/open-url', async (req, res) => {
  const { url } = req.body;
  const result = await openUrl(url);
  res.json(result);
});

app.post('/api/desktop/command', async (req, res) => {
  const { command } = req.body;
  if (!command) return res.status(400).json({ error: 'command é obrigatório.' });
  const result = await runTerminalCommand(command);
  res.json(result);
});

// AI Multi-Agent Processing
app.post('/api/ai/process', async (req, res) => {
  try {
    const response = await processAgentRequest(req.body);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// AI API Key Management
app.get('/api/ai/keys/status', (req, res) => {
  res.json(getApiKeysStatus());
});

app.post('/api/ai/keys', (req, res) => {
  const result = updateApiKeys(req.body);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`🚀 AURA PC Backend Server rodando na porta ${PORT}`);
});
