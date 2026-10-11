# Platform roadmap

## Phase 1 — Android (now)
Capacitor wraps `www/` as a native Android app. Touch controls are built in; the hardware back button maps to B. Ship through Google Play internal testing first.

## Phase 2 — Mac
The same `www/` folder runs unchanged. Recommended route: **Tauri**, which wraps web games as small native macOS apps (a few MB) and can be distributed through the Mac App Store or as a signed download. Electron also works but produces much larger apps. Keyboard controls are already supported (arrows/WASD, Z, X, Esc).

Mac checklist: an Apple Developer account, app signing and notarization, hiding the on-screen gamepad when a keyboard is detected, and a larger window layout.

## Later
- iPhone/iPad via Capacitor's iOS target (same project, `npx cap add ios`)
- Cloud saves so progress moves between Android and Mac
- Gamepad support for controllers
