
# Astem — Split Panel Media Interface

A modern web application featuring an interactive split-panel home page with video playback and navigation to different sections.

## Features

✨ **Split-Panel Home Page** - Two interactive side panels with video playback  
▶️ **Auto Play Videos** - Videos play on hover and pause when leaving  
📈 **Size Animation** - Active panel expands slightly on interaction  
🔀 **Navigation** - Left panel → Information page, Right panel → Metro page  
🎨 **Smooth Transitions** - Beautiful CSS animations and effects  

## Quick Start

1. **Install dependencies**:
```bash
npm run install-all
```

2. **Run development servers**:
```bash
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:4000

## Project Structure

```
astem-monorepo/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Split panel interface
│   │   │   ├── InformationPage.jsx  # Info section
│   │   │   └── MetroPage.jsx        # Metro section
│   │   ├── App.jsx                  # Router setup
│   │   ├── main.jsx                 # Entry point
│   │   └── styles.css               # Global styles
│   └── package.json
│
└── server/                 # Express backend
    ├── index.js            # API endpoints
    ├── .env                # Configuration
    └── package.json
```

## Technologies

- **Frontend**: React 18, React Router 6, Vite, CSS3
- **Backend**: Express.js
- **Build**: Vite with React plugin

