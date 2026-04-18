# Task Management SaaS Frontend

This is a Task Management Software as a Service (SaaS) frontend application built with Next.js. The application provides a comprehensive solution for managing tasks, projects, and teams, with a focus on user experience and scalability.

## Features

- **User Authentication**: Users can register, log in, and reset their passwords.
- **Dashboard**: A centralized dashboard that provides an overview of tasks, projects, and team activities.
- **Task Management**: Create, update, and delete tasks with ease.
- **Project Management**: Organize tasks into projects for better management.
- **Team Collaboration**: Manage teams and assign tasks to team members.
- **Analytics**: View statistics and insights related to tasks and projects.
- **Settings**: Customize user preferences and application settings.

## Tech Stack

- **Next.js**: A React framework for building server-side rendered applications.
- **TypeScript**: A superset of JavaScript that adds static types.
- **TailwindCSS**: A utility-first CSS framework for styling.
- **React Query**: For data fetching and state management.
- **Zod**: For schema validation.

## Folder Structure

```
task-management-saas-frontend
├── src
│   ├── app
│   ├── components
│   ├── features
│   ├── hooks
│   ├── lib
│   ├── services
│   ├── store
│   ├── types
│   ├── utils
│   └── styles
├── public
├── next.config.ts
├── tsconfig.json
├── package.json
├── eslint.config.mjs
├── postcss.config.mjs
├── tailwind.config.ts
├── next-env.d.ts
├── .env.example
└── README.md
```

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nirajan-chy/Multi-tenant-saas-workflow.git
   cd task-management-saas-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Copy `.env.example` to `.env` and fill in the required values.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.