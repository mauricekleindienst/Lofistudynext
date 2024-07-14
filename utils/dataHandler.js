const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(process.cwd(), 'data', 'pomodoros.json');

export function readData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
      if (jsonData) {
        return JSON.parse(jsonData);
      }
    }
    // Return an empty array if the file does not exist or is empty
    return [];
  } catch (error) {
    console.error('Error reading JSON data:', error);
    return [];
  }
}

export function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing JSON data:', error);
  }
}
