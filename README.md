# Report Comment Generator

A powerful tool designed to help teachers quickly generate professional student reports. This application allows teachers to manage student information, track positive attributes and areas for improvement, and generate detailed, personalized reports using AI.

## 🌟 Features

- **Student Management**: Add, edit, and delete students with name and gender information
- **Attribute Library**: Create and manage a library of positive attributes and areas for improvement
- **Student Attribute Assignment**: Assign specific attributes to individual students
- **AI-Powered Report Generation**: Generate professional 250-300 word reports using OpenAI
- **Manual Report Option**: Generate simple reports without using AI
- **Database Seeding**: Quickly populate your database with common attributes

## 🚀 Getting Started

### Live Demo

A live version of this application has been deployed with a pre-configured database and OpenAI integration. Users can access the application directly without needing to set up their own database or API keys.

**No need to seed the database or configure API keys - everything is ready to use!**

### Running Locally (For Developers)

#### Prerequisites

- Node.js (v16 or newer)
- MySQL database
- OpenAI API key

#### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/rep-gen.git
   cd rep-gen
   ```

2. Install dependencies

   ```bash
   pnpm install
   ```

3. Create a `.env` file based on `.env.example`

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MySQL database connection string and OpenAI API key

5. Set up the database

   ```bash
   pnpm db:push
   ```

6. Start the development server

   ```bash
   pnpm dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📋 Usage Guide

### Getting Started

The live demo comes with a pre-populated database of attributes, so you can start using the application right away. If you're running the application locally and need to seed your database:

1. Navigate to the **Seed Database** page by going to `/seed`
2. Click the "Seed Database" button to populate your database with predefined attributes

### Managing Students

1. Go to the **Settings** page
2. In the Students section:
   - Add new students by entering their name, selecting a gender, and clicking "Add"
   - View all students in the list below
   - Click "Attributes" to assign specific attributes to a student
   - Click "Delete" to remove a student

### Managing Attributes

1. Go to the **Settings** page
2. In the Attributes section:
   - Add new attributes by entering text, selecting a category (Positive/To Improve), and clicking "Add"
   - Search for existing attributes using the search bar
   - Delete attributes by clicking the "Delete" button next to them

### Generating Reports

1. Go to the **Generate Reports** page
2. Select a student from the dropdown menu
3. If the student has assigned attributes, they will be used automatically
4. If not, you can select attributes from the lists below
5. Choose whether to use AI for report generation (checkbox)
6. Click "Generate Report"
7. Copy the generated report for use in your student reporting system

## 🛠️ Technologies Used

- [Next.js](https://nextjs.org) - React framework
- [Drizzle ORM](https://orm.drizzle.team) - Database ORM
- [tRPC](https://trpc.io) - End-to-end typesafe API
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [ShadCN UI](https://ui.shadcn.com/) - UI component library
- [OpenAI API](https://openai.com) - AI report generation

## 💡 Background

This project was built to help teachers who spend countless hours manually writing reports for classrooms of 25+ students. By storing student information and common attributes, then leveraging AI to generate professional reports, teachers can save significant time while still providing personalized feedback for each student.
