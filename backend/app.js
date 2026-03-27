require('dotenv').config();

const cors = require('cors');
const express = require('express');

const scanRoutes = require('./src/routes/scanRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    success: true,
    service: 'EcoScan AI Backend',
    status: 'ok',
    endpoints: ['/health', '/api/scan'],
  });
});

app.get('/health', (_req, res) => {
  res.json({ success: true, status: 'ok' });
});

app.use('/api', scanRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
});

const PORT = Number(process.env.PORT) || 4000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`EcoScan AI backend running on port ${PORT}`);
  });
}

module.exports = app;
