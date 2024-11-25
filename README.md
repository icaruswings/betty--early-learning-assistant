# AI Chat Application with Streaming Responses

A real-time AI chat application built with Remix and OpenAI, featuring streaming responses.

## Features

- 💬 Real-time chat interface
- 🌊 Streaming AI responses
- 🚀 Built with Remix
- 🤖 Powered by OpenAI GPT-3.5 Turbo

## Prerequisites

- Node.js (v18+)
- npm
- OpenAI API Key

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the project root
   - Add your OpenAI API key:
     ```
     OPENAI_API_KEY=your_openai_api_key_here
     ```

## Running the Application

Development mode:
```bash
npm run dev
```

Production build:
```bash
npm run build
npm start
```

## Configuration

- Modify `app/routes/api.chat.ts` to change AI model or settings
- Customize UI in `app/routes/_index.tsx`

## Deployment

Can be deployed to platforms like Vercel, Netlify, or any Node.js hosting service.

## Technologies

- Remix
- React
- TypeScript
- OpenAI API
- Tailwind CSS

## License

MIT License
