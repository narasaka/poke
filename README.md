<h1 align="center">poke</h1>

<p align="center">
  An open-source, app-less push notification service
</p>

## Overview

Poke is a lightweight solution for sending push notifications without requiring users to install a native mobile app. It leverages Progressive Web App (PWA) technology to deliver notifications directly through the web browser.

## Features

- 🚀 No app installation required - just install as a PWA
- 📱 Cross-platform support (iOS, Android, Desktop)
- 🔌 Simple REST API for sending notifications
- 🔒 Secure and privacy-focused
- ⚡ Lightweight and fast

## Getting Started

### As a User

1. Visit the poke website
2. Install the PWA:

   - **Desktop (Chrome)**: Click the three-dot menu → Cast, save, and share → Install page as app
   - **Android**: Tap the three-dot menu → Add to home screen → Install
   - **iOS**: Tap Share → Add to Home Screen → Add

3. Subscribe to notifications when prompted
4. You're all set! You can now receive notifications

### As a Developer

To send notifications to subscribed clients, use the following API endpoint:

```bash
curl --request POST \
  --url https://api.poke.narasaka.dev/send-notification \
  --header 'Content-Type: application/json' \
  --data '{
    "clientId": "client-id-here",
    "notificationPayload": {
      "title": "Hello",
      "body": "This is a test notification"
    }
  }'
```

## Development

### Prerequisites

- Node.js (v18 or higher)
- pnpm

### Local Setup

1. Clone the repository:

```bash
git clone https://github.com/narasaka/poke.git
cd poke
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm run dev
```

### Building for Production

```bash
pnpm run build
```

## Contributing

Contributions are very welcome! Whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Improving documentation

## License

This project is open source and available under the MIT License .

## Support

If you encounter any issues or have questions, please file an issue on the GitHub repository.
