import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  await reorderTodosHandler(req, res);
}

const reorderTodosHandler = async (req, res) => {
  const { email, newOrder } = req.body;

  if (!email || !newOrder || !Array.isArray(newOrder)) {
    return res
      .status(400)
      .json({ error: "Email and newOrder array are required" });
  }

  try {
    // Use Prisma transaction to ensure all updates succeed or none do
    await prisma.$transaction(async (tx) => {
      for (const { id, position } of newOrder) {
        await tx.todos.update({
          where: { id_email: { id, email } },
          data: { position },
        });
      }
    });

    return res.status(200).json({ message: 'Todos reordered successfully' });
  } catch (error) {
    console.error("Error reordering todos:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
