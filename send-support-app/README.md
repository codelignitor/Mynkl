# Send Support App

A React Native Expo mock UI for the **Send Support** screen, matching the provided design with custom SVG illustrations.

## Features

- Pastel purple gradient background
- Hero illustration (speech bubble with heart + floating hearts)
- 2×2 support type grid: Hug, Encouragement, Calm, Cheer Up
- Custom SVG icons for each support type
- Selection state with purple border and checkmark badge
- Anonymous sharing info box
- Continue button with footer hint

## Getting Started

```bash
cd send-support-app
npm install
npm start
```

Then scan the QR code with Expo Go, or press `w` for web preview.

## Project Structure

```
src/
  constants/theme.ts       # Colors, spacing, radius
  components/
    illustrations/         # SVG hero + card icons
    BackButton.tsx
    SupportTypeCard.tsx
    InfoBox.tsx
  screens/
    SendSupportScreen.tsx  # Main screen
  types/support.ts
```

## Tech Stack

- Expo SDK 56
- React Native
- react-native-svg (illustrations)
- expo-linear-gradient (background)
- @expo/vector-icons (UI icons)
