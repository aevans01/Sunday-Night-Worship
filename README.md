# Complete Haven Heights frontend

## Replace your frontend project

1. Back up your current frontend repository.
2. Extract this ZIP and open HHBC-Frontend.
3. Copy the CONTENTS of this folder to your frontend repository ROOT. package.json, package-lock.json, netlify.toml, src, public, and scripts belong alongside each other. Do not place them inside an extra HHBC-Frontend or Frontend folder.
4. Remove mistakenly nested frontend folders. Preserve .git when replacing a local checkout.
5. Commit and deploy. Netlify Base directory: blank. Build command: npm run build. Publish directory: build. netlify.toml includes the build configuration.

## Local use

npm ci
npm start
npm run build
npm test -- --watchAll=false

node_modules and build are generated and excluded from the archive.

## Backend and SQL

This is the complete FRONTEND. Keep your backend repository and database. public/_redirects forwards API requests to https://hhbc-snw-api.netlify.app. No backend secrets are included.

The earlier backend upgrades are required for their corresponding features. The team SQL is included at reference-sql/03-staff-directory.sql; run it in the API database if not already completed. Re-running preserves admin edits.

Includes all latest pages and changes: matched homepage buttons, redesigned About, complete staff cards with Jimmy Binns, separate Custodian/Grounds Keeper positions, admin staff editing, and admin prayer assignment.

Verified: production compilation and 34 frontend tests. Live deployment and desktop/mobile visual checks remain pending.
