const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const challenges = [
  // Pomodoro Related Challenges (Connected to updatePomodoroCount)
  {
    title: "Daily Focus",
    description: "Complete 4 Pomodoros today",
    reward: "🎯 Focus Master",
    total: 4,
    type: "daily",
    category: "pomodoro",
    trackingType: "pomodoro_daily"
  },
  {
    title: "Study Session",
    description: "Complete 3 Pomodoros in the 'Studying' category",
    reward: "📚 Study Star",
    total: 3,
    type: "daily",
    category: "studying",
    trackingType: "category_count"
  },
  {
    title: "Code Warrior",
    description: "Complete 3 Pomodoros in the 'Coding' category",
    reward: "💻 Code Master",
    total: 3,
    type: "daily",
    category: "coding",
    trackingType: "category_count"
  },

  // Weekly Goals
  {
    title: "Weekly Scholar",
    description: "Accumulate 20 Pomodoros this week",
    reward: "🎓 Scholar Supreme",
    total: 20,
    type: "weekly",
    category: "pomodoro",
    trackingType: "pomodoro_weekly"
  },
  {
    title: "Category Champion",
    description: "Complete 10 Pomodoros in any single category",
    reward: "🏆 Category King",
    total: 10,
    type: "weekly",
    category: "any",
    trackingType: "category_any"
  },

  // Todo Related Challenges
  {
    title: "Task Tracker",
    description: "Complete 5 todo items",
    reward: "✅ Task Master",
    total: 5,
    type: "daily",
    category: "todos",
    trackingType: "todo_complete"
  },
  {
    title: "Subtask Star",
    description: "Complete 3 subtasks",
    reward: "📝 Detail Master",
    total: 3,
    type: "daily",
    category: "subtasks",
    trackingType: "subtask_complete"
  },

  // Time-based Challenges
  {
    title: "Early Riser",
    description: "Start a Pomodoro before 9 AM",
    reward: "🌅 Morning Champion",
    total: 1,
    type: "daily",
    category: "time",
    trackingType: "time_check",
    timeRequirement: {
      before: "09:00"
    }
  },
  {
    title: "Night Owl",
    description: "Complete 2 Pomodoros after 8 PM",
    reward: "🌙 Night Master",
    total: 2,
    type: "daily",
    category: "time",
    trackingType: "time_check",
    timeRequirement: {
      after: "20:00"
    }
  }
];

async function main() {
  for (const challenge of challenges) {
    await prisma.challenge.upsert({
      where: {
        title_type: {
          title: challenge.title,
          type: challenge.type
        }
      },
      update: challenge,
      create: challenge
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 