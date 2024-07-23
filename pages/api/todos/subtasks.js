import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      await addSubtaskHandler(req, res);
      break;
    case "PUT":
      await updateSubtaskHandler(req, res);
      break;
    case "DELETE":
      await deleteSubtaskHandler(req, res);
      break;
    default:
      res.setHeader("Allow", ["POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

const addSubtaskHandler = async (req, res) => {
  const { todoId, email, text } = req.body;

  if (!todoId || !email || !text) {
    return res
      .status(400)
      .json({ error: "TodoId, email, and text are required" });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO subtasks (todo_id, text, completed) VALUES ($1, $2, $3) RETURNING id",
      [todoId, text, false]
    );
    client.release();
    res
      .status(200)
      .json({ message: "Subtask added successfully", id: result.rows[0].id });
  } catch (error) {
    console.error("Error adding subtask:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateSubtaskHandler = async (req, res) => {
  const { id, todoId, email, text, completed } = req.body;

  if (!id || !todoId || !email) {
    return res
      .status(400)
      .json({ error: "Id, todoId, and email are required" });
  }

  try {
    const client = await pool.connect();
    let query = "UPDATE subtasks SET ";
    const updateFields = [];
    const values = [id, todoId];
    let paramCount = 3;

    if (text !== undefined) {
      updateFields.push(`text = $${paramCount}`);
      values.push(text);
      paramCount++;
    }
    if (completed !== undefined) {
      updateFields.push(`completed = $${paramCount}`);
      values.push(completed);
    }

    query += updateFields.join(", ") + " WHERE id = $1 AND todo_id = $2";

    await client.query(query, values);
    client.release();
    res.status(200).json({ message: "Subtask updated successfully" });
  } catch (error) {
    console.error("Error updating subtask:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteSubtaskHandler = async (req, res) => {
  const { id, todoId, email } = req.body;

  if (!id || !todoId || !email) {
    return res
      .status(400)
      .json({ error: "Id, todoId, and email are required" });
  }

  try {
    const client = await pool.connect();
    await client.query("DELETE FROM subtasks WHERE id = $1 AND todo_id = $2", [
      id,
      todoId,
    ]);
    client.release();
    res.status(200).json({ message: "Subtask deleted successfully" });
  } catch (error) {
    console.error("Error deleting subtask:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
