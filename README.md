# EcoScan AI

A React Native (Expo) app that scans product barcodes with Google ML Kit via Vision Camera and displays carbon-footprint insights in a modern UI.

## Features

- Real-time barcode scanning with camera preview
- Supported formats: EAN-13, UPC-A, Code-128
- Haptic feedback on successful scan
- Smooth Scanner -> Result screen transition
- API request using barcode payload
- Result cards for:
  - Product image
  - Product name
  - Carbon footprint highlight
  - Eco score badge (A-F)
  - Impact text
  - Eco-friendly alternatives
- Loading and error states

## Stack

- Expo + React Native + TypeScript
- react-native-vision-camera
- vision-camera-code-scanner (ML Kit)
- React Navigation Native Stack
- Axios

## Setup

1. Install dependencies:

```bash
npm install
```

2. Generate native projects (required for Vision Camera + ML Kit plugins):

```bash
npx expo prebuild
```

3. Run on Android:

```bash
npm run android
```

4. Run on iOS (macOS only):

```bash
npm run ios
```

## API Endpoint

The app sends:

```json
{
  "barcode": "<detected-value>"
}
```

to:

`POST http://YOUR_BACKEND_URL/api/scan`

Update base URL in `src/services/api.ts` before production use.

## Notes

- Vision Camera barcode scanning does not run in Expo Go; use a dev build or prebuilt native run.
- Camera permission prompt is handled in-app.
