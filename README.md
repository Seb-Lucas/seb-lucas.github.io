# Sebastian Lucas Tagalog — Portfolio

VS Code-ready static portfolio rebuilt from the supplied portfolio ZIP and applied against the supplied Portfolio Design Brief.

## Structure

```text
portfolio/
├── index.html       # Single scrolling portfolio
├── resume.html      # Printable résumé page
├── theme.css        # Design tokens, responsive layout, accessibility styles
├── theme.js         # Dark mode, project interaction, copy email, command palette
├── assets/          # Portfolio images, certificates, and preview assets
│   └── stitch-previews/  # Original Stitch preview assets retained
├── about.html
├── skills.html
├── projects.html
├── contact.html
└── .gitignore
```

## Design implementation

- Paper / Surface / Ink / Muted / Line / Accent tokens from the design brief.
- General Sans is requested as the primary family with system fallbacks; JetBrains Mono is used for functional/data UI.
- 1120px maximum content width, 80px desktop side margins and 20px mobile margins.
- 12-column project grid on desktop with 24px gutters.
- Minimal 1px borders and 2–4px radius; no decorative gradients or card shadows.
- Sticky minimal navigation and anchor links.
- Left-aligned hero with a datasheet-style metadata block.
- Hero load sequence is the only automatic load motion.
- Project expansion, navigation underline, copy confirmation, and dark-mode transition are user-triggered.
- `prefers-reduced-motion` is respected.
- Visible keyboard focus rings are preserved.
- Responsive layout supports widths down to 375px without intentional horizontal overflow.
- Ctrl+K / Cmd+K command palette is included as a small engineering-focused interaction.
- The hero contains an accessible inline SVG system map: domain nodes can be hovered, focused, or tapped to highlight signal paths and system state.
- The system inspector and scroll progress rail expose the portfolio's architecture without hiding core content behind animation.
- Neurovia expands into an interactive RFID → ESP32-S3 → Raspberry Pi → Dashboard architecture with descriptions limited to verified project details.
- Project preview panels are static because the supplied portfolio did not contain real project video files. The JavaScript includes the requested IntersectionObserver behavior so real `.webm`/`.mp4` previews can be added later without changing the interaction model.

## Asset note

No external engineering photograph, GIF, or Lottie asset was added. The existing local portrait remains the only photographic asset, and the new technical visuals are inline SVG/CSS so the site has no unreliable hotlinks, extra download weight, or attribution requirement.

## Important content note

The supplied portfolio contained generated placeholder/fictitious claims in some of its secondary pages (for example, enterprise architecture roles, HIPAA compliance, financial Kafka pipelines, and cloud certifications). Those claims were not carried into the rebuilt portfolio because they were not supported as the user's real experience. The rebuilt copy uses the concrete information present in the supplied portfolio and the provided design brief.

GitHub and LinkedIn destination URLs remain generic because the supplied portfolio did not contain the user's actual profile URLs. Replace those two links with the user's real profiles before publishing.

## Run in VS Code

1. Extract the ZIP.
2. Open the extracted folder in VS Code.
3. Open `index.html`.
4. For the easiest preview, install the **Live Server** extension and choose **Open with Live Server**.
5. Edit `index.html`, `theme.css`, and `theme.js` as needed.

No Node.js, npm, React, or build step is required for this static version.

## Publish

The site is compatible with GitHub Pages because the homepage is `index.html`.

```bash
git init
git add .
git commit -m "Update portfolio design"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the GitHub remote with the user's actual repository URL.
