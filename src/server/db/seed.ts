import { db } from "./index";
import { attributes } from "./schema";

async function seedAttributes() {
  console.log("Seeding attributes...");

  // Positive attributes
  const positiveComments = [
    "Always optimistic.",
    "Lights up the classroom.",
    "Confident in themselves.",
    "Asks questions and is curious.",
    "Very kind.",
    "Respectful to others.",
    "Works well with others.",
    "Always asks questions.",
    "Gives opinions while respecting others' opinions.",
    "Great character in the classroom.",
    "Polite and well-mannered.",
    "Helpful to teachers and peers.",
    "Confident and respectful.",
    "Works well in group settings.",
    "A natural leader.",
    "Creative and enjoys drawing/writing.",
    "Positive attitude.",
    "Enthusiastic about learning.",
    "Willing to help others.",
    "Takes responsibility for their learning.",
    "Builds strong relationships with peers.",
    "Friendly and approachable.",
    "Shows curiosity and asks insightful questions.",
    "Enthusiastic and loves to participate.",
    "Good at problem-solving.",
    "A joy to have in the classroom.",
    "Able to set personal goals.",
    "Resilient in the face of challenges.",
    "Takes initiative.",
    "Demonstrates strong communication skills."
  ];

  // To improve attributes
  const improveComments = [
    "Needs to stay focused on their own work.",
    "Needs to build self-motivation.",
    "Can be distracted easily.",
    "Needs to build more confidence.",
    "Should take more risks in their learning.",
    "Needs reminders to let others have a turn.",
    "Needs to work on staying focused.",
    "Needs to take on more leadership roles.",
    "Needs to be more resilient with difficult tasks.",
    "Needs to work on independent tasks.",
    "Needs to raise their hand and not call out.",
    "Needs to focus more on listening.",
    "Should challenge themselves more.",
    "Needs to participate more actively.",
    "Needs to build relationships with others.",
    "Needs to focus on being more independent.",
    "Needs to choose better company for focused work.",
    "Needs to build more confidence in challenges.",
    "Needs to push themselves further.",
    "Should stay focused and avoid distractions.",
    "Needs to take on more leadership opportunities.",
    "Needs to stay more engaged in class.",
    "Needs to take more initiative in group work.",
    "Needs to participate more during lessons.",
    "Needs to focus on taking more risks."
  ];

  // Insert positive attributes
  for (const comment of positiveComments) {
    await db.insert(attributes).values({
      text: comment,
      category: "positive",
    });
  }

  // Insert improvement attributes
  for (const comment of improveComments) {
    await db.insert(attributes).values({
      text: comment,
      category: "improve",
    });
  }

  console.log("Seeding completed successfully!");
}

// Execute the seed function
seedAttributes()
  .catch((e) => {
    console.error("Error seeding the database:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the database connection when done
    await db.end();
    process.exit(0);
  });
