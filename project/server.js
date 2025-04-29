import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const app = express();
const port = 2000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Path to the data file
const dataFilePath = path.join(__dirname, 'data', 'dtTableData.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize data file if it doesn't exist
if (!fs.existsSync(dataFilePath)) {
  fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

// Get all data
app.get('/api/data', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    res.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Error reading data file' });
  }
});

// Add new data
app.post('/api/data', (req, res) => {
  try {
    const newData = req.body;
    console.log('Received data:', newData); // Log received data
    
    // Validate required fields
    if (!newData.dtId || !newData.issueName || !newData.createdAt || !newData.owner) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    
    // Check if DT ID already exists
    const existingData = data.find(item => item.dtId === newData.dtId);
    if (existingData) {
      return res.status(409).json({ error: 'DT ID already exists' });
    }

    data.push(newData);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.json({ message: 'Data saved successfully', data: newData });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Error saving data' });
  }
});

// Update data
app.put('/api/data/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const index = data.findIndex(item => item.dtId === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Data not found' });
    }
    
    data[index] = { ...data[index], ...updatedData };
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    res.json({ message: 'Data updated successfully', data: data[index] });
  } catch (error) {
    res.status(500).json({ error: 'Error updating data' });
  }
});

// Delete data
app.delete('/api/data/:id', (req, res) => {
  try {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    const filteredData = data.filter(item => item.dtId !== id);
    
    if (filteredData.length === data.length) {
      return res.status(404).json({ error: 'Data not found' });
    }
    
    // Delete the corresponding workflow file
    const workflowFilePath = path.join(__dirname, 'workflows', `${id}.json`);
    if (fs.existsSync(workflowFilePath)) {
      fs.unlinkSync(workflowFilePath);
    }
    
    fs.writeFileSync(dataFilePath, JSON.stringify(filteredData, null, 2));
    res.json({ message: 'Data and workflow deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting data' });
  }
});

// Get workflow data by dtId
app.get('/api/workflow/:dtId', (req, res) => {
  try {
    const { dtId } = req.params;
    const workflowFilePath = path.join(__dirname, 'workflows', `${dtId}.json`);
    
    if (fs.existsSync(workflowFilePath)) {
      const workflowData = JSON.parse(fs.readFileSync(workflowFilePath, 'utf8'));
      res.json(workflowData);
    } else {
      res.status(404).json({ error: 'Workflow not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching workflow data' });
  }
});

// Save workflow data
app.post('/api/workflow/:dtId', (req, res) => {
  try {
    const { dtId } = req.params;
    const workflowData = req.body;
    const workflowFilePath = path.join(__dirname, 'workflows', `${dtId}.json`);
    
    // Create workflows directory if it doesn't exist
    const workflowsDir = path.join(__dirname, 'workflows');
    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir);
    }
    
    fs.writeFileSync(workflowFilePath, JSON.stringify(workflowData, null, 2));
    res.json({ message: 'Workflow saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving workflow data' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server started at http://0.0.0.0:${port}`);
});