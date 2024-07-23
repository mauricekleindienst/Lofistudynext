const addEventHandler = async (req, res) => {
  const { email, title, date } = req.body;

  if (!email || !title || !date) {
    return res
      .status(400)
      .json({ error: "Email, title, and date are required" });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO events (email, title, date) VALUES ($1, $2, $3) RETURNING id",
      [email, title, new Date(date)]
    );
    client.release();

    const newEventId = result.rows[0].id;
    res
      .status(200)
      .json({ message: "Event added successfully", id: newEventId });
  } catch (error) {
    console.error("Error adding event:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getEventsHandler = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, title, date as start, date as end FROM events WHERE email = $1",
      [email]
    );
    client.release();

    const events = result.rows.map((event) => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
    }));

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
