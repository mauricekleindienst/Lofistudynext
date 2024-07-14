// models/Note.js
import { DataTypes } from 'sequelize';
import sequelize from '../lib/db';

const Note = sequelize.define('Note', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

export default Note;
