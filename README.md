# Resume Generator

Browser-based resume builder (HTML/CSS/JS only) with live preview, PDF and JSON export, and English/French support.

## Features
- Edit personal info, introduction, skills (groups + icons), interests, education, and experience.
- Customize colors, column balance, and font size.
- Toggle synced column colors; optional selectable-text PDF or image-based PDF.
- Export to PDF, export/import JSON to reuse a configuration.
- Language selector (EN/FR) via the translations module.

## Requirements
- Modern browser (no server-side components).

## Run
1. Clone or download the repository.
2. Open `index.html` in your browser (directly or via any static file server).

## Project Structure
```
- index.html
- css/
	- base.css
	- config-panel.css
	- preview-panel.css
	- resume-styles.css
- js/
	- state.js
	- translations.js
	- font-utils.js
	- skills.js
	- interests.js
	- education.js
	- experience.js
	- preview.js
	- export.js
	- import.js
	- events.js
	- main.js
```

## Export / Import
- PDF: image-based by default; selectable text when the option is enabled.
- JSON: saves/loads full configuration (data and display preferences).

## Notes
- For best PDF fidelity, keep content within the visible A4 guide line in the preview.
- No Node or backend dependencies; everything runs in the browser.

## License
Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0): you may use and modify the project, but commercial use is not permitted. See https://creativecommons.org/licenses/by-nc/4.0/
