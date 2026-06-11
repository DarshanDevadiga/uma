const { query } = require('../config/db');

// Get all site settings (Public - returns as key-value map object)
const getSettings = async (req, res) => {
  try {
    const settingsList = await query('SELECT setting_key, setting_value FROM settings');
    
    // Map list to key-value object
    const settingsMap = {};
    settingsList.forEach(item => {
      settingsMap[item.setting_key] = item.setting_value;
    });

    res.json(settingsMap);
  } catch (error) {
    console.error('getSettings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Update site settings (Admin)
const updateSettings = async (req, res) => {
  const settingsData = req.body; // Expects key-value object: { address: '...', phone: '...' }

  try {
    const keys = Object.keys(settingsData);
    
    for (const key of keys) {
      const value = settingsData[key];
      
      // UPSERT operation in MySQL (using INSERT ... ON DUPLICATE KEY UPDATE)
      await query(
        `INSERT INTO settings (setting_key, setting_value) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE setting_value = ?`,
        [key, value, value]
      );
    }

    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('updateSettings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
