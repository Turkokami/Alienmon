# Google Play: kids' app setup for Alienmon

Copy these answers into Play Console. They match what the app build actually does (`npm run android`, which runs `node tools/build.js --app`). If the app gains an online feature, ads or purchases later, these answers and the privacy policy must change first.

## What the app build does (and doesn't)

- **Fully offline.** The game, art, music and voices are all inside the app. In the app build (`APP=true` in `src/template.html`), cloud backup, Report a bug, update checks, the service worker and Vercel Web Analytics are all off.
- **No permissions.** `android/app/src/main/AndroidManifest.xml` removes INTERNET and AD_ID, including any that a library would add.
- **Font is bundled.** Press Start 2P (SIL Open Font License, `art/ui/fonts/OFL.txt`) is in the app, so the game never calls Google Fonts. The web game uses the bundled copy too.
- **Nothing a child can type is sent anywhere.** There's no name entry, no chat, no accounts, no links out and no purchases.
- **Saves stay on the device** (WebView storage). Android's own backup can include them in the player's Google account. Google doesn't count that as data your app collects.
- **App ID:** `com.alienmon.game`. This is permanent once the first upload is made, so change it in `capacitor.config.json` before then if you want something else.

## Play Console > App content (Policy > App content)

| Section | Answer |
|---|---|
| Privacy policy | https://alienmon.com/legal/privacy (deploy the site first; the page has a section just for the app) |
| Ads | **No**, my app does not contain ads |
| App access | **All functionality is available without special access** (no login) |
| Content ratings | See the questionnaire below |
| Target audience and content | See below |
| News app | No |
| Data safety | See below |
| Government app | No |
| Financial features | My app doesn't provide any financial features |
| Health | No health features |

### Target audience and content

- **Recommended age groups: 9–12 and 13–15.** The story's heroes are 16, the battles are fierce but never gory, and the reading level fits middle grade. You can also tick 6–8 if you want younger players. Ticking any group under 13 puts the app under the **Families policy**, and the app already meets it (see the checklist below).
- **Could your store listing unintentionally appeal to children?** Yes (it's designed for them).
- **Teacher Approved** is optional. Google may review it for the Kids tab once it's live; nothing extra to do.

### Data safety

1. Does your app collect or share any of the required user data types? **No**
2. That's the whole form: Play then shows **"No data collected"** and **"No data shared"** on the listing.
   - The encryption and deletion questions only appear if you answer Yes.
   - There are no accounts, so there's no account-deletion URL to give.

### Content rating (IARC questionnaire)

Pick category **Game**, and use alienmongame@gmail.com as the contact email (it's the one on the policy).

| Question | Answer |
|---|---|
| Violence | **Yes**: fantasy violence between non-human creatures. It isn't realistic, shows no blood or gore, and no creature dies (they faint and are healed). Humans are never harmed. |
| Fear / horror | **Mild** scary moments (dark caves, a giant sea creature, villains). Nothing frightening for young children. |
| Sexuality, nudity | No |
| Language / crude humour | No |
| Controlled substances (drugs, alcohol, tobacco) | No |
| Gambling or simulated gambling | No |
| Users can interact or exchange content | No |
| Shares the user's location | No |
| Digital goods purchases | No |
| Unrestricted internet / web browser | No |

Expected result: ESRB **Everyone**, PEGI **7**, USK **6**. Monster battles usually rate PEGI 7.

## Families policy checklist

- [x] No ads, so no ad SDKs (or self-certified ad SDKs) needed.
- [x] No advertising ID, location, camera, microphone or contacts.
- [x] No collecting personal information from children, and no third-party tracking or analytics SDKs.
- [x] No social features, chat or user-made content.
- [x] No links out of the app and no purchases, so no parent gate is needed.
- [x] Content is kid-safe (the book's rule: battles are fierce but no Alienmon dies).
- [x] Target API level 36 (Capacitor 8 default). Google requires a recent level every August.
- [x] Privacy policy covers children (COPPA) and states what the app collects: nothing.
- [ ] Store listing text, icon and screenshots must be kid-appropriate and must not copy another brand. Keep Pokémon terms and ball-shaped art out (see the originality rule).
- [ ] Before any later update that adds online features (cloud backup, trading, purchases): add a parent gate and update Data safety and the privacy policy *before* that version ships.

## Store listing assets

| Asset | Size | Status |
|---|---|---|
| App icon | 512×512 PNG | `art/ui/icons/icon-512.png` exists |
| Feature graphic | 1024×500 | `art/ui/play_feature_graphic.png` exists |
| Phone screenshots | 2–8, at least 1080 px on the short side | To capture |
| 7" and 10" tablet screenshots | Optional, needed for tablet featuring | To capture |
| Short description | 80 characters max | Draft: "Catch, bond and battle alien partners across 14 worlds in a retro adventure." |
| Full description | 4000 characters max | To write from WEBSITE_STORY_COPY.md |

## Release path

1. **Personal developer accounts made after November 2023** must run a **closed test with at least 12 testers for 14 days in a row** before production access unlocks. Organisation accounts skip this.
2. Upload the signed **.aab** to Internal testing first, then Closed testing.
3. **Size:** Play's limit for the base download is 200 MB; bigger games ship the rest as Play Asset Delivery packs. The build is about 485 MB without the arena, so it has to be compressed before the first upload.
