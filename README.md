# AI Feedback App

This application allows users to upload audio files, transcribe them, and receive AI-generated feedback and scoring.

## Features

- Upload audio files (.mp3, .wav)
- Transcription using Deepgram API model Nova - 3
- AI feedback and scoring using Google Gemini API model gemini-1,5-flash
- Responsive, modern UI
- See feedback and scores

## Getting Started

### Tech Stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [Google GenAI](https://ai.google.dev/)
- [DeepGram Voice AI](https://deepgram.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone your-repo-url>](https://github.com/qwertyarpit/Audio_Transcriber.git
   
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Create a `.env.local` file in the root of `my-feedback-app`.
   - Add your API keys:
     ```env
     DEEPGRAM_API_KEY=your_deepgram_api_key
     GEMINI_API_KEY=your_gemini_api_key
     ```

### Running the App

To start the development server:

```bash
npm run dev
```

To build for production:

```bash
npm run build
npm start
```

### Project Structure

- `src/app/` - Main app and API routes
- `src/components/` - UI components
- `src/styles/` - CSS modules for styling

### Customization

- Update styles in `src/styles/` as needed
- Adjust API logic in `src/app/api/analyze-call/route.ts`

## License

MIT
