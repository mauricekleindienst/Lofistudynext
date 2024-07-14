// utils/dataHandler.js
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'pomodoroData.json');

export function readData() {
  const jsonData = fs.readFileSync(dataFilePath);
  return JSON.parse(jsonData);
}

export function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}
