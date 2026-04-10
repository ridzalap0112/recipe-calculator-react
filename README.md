# Recipe Calculator Web

Recipe Calculator Web is a React + Vite app for scaling bakery recipes, estimating production cost, tracking calories, and turning a home-baking workflow into a clearer business workflow.

## Live Demo

- Production: https://ridzalap0112.github.io/recipe-calculator-react/

## Highlights

- Scale recipes by batch size instantly
- Calculate ingredient usage, total cost, and calorie estimates
- Analyze selling price, revenue, profit, and margin
- Adjust ingredient prices from inside the app
- Follow step-by-step recipe progress with timers
- Export summaries and print product labels
- Switch between Indonesian and English
- Save notes and calculation history locally

## Built With

- React
- Vite
- Zustand
- JavaScript
- CSS

## Local Setup

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## Production Build

```bash
npm run build
```

Build output is generated in `dist/`.

## Deployment

This project is deployed with GitHub Pages through GitHub Actions.

- Branch: `master`
- Workflow: `.github/workflows/deploy.yml`
- Host: GitHub Pages

When new commits are pushed to `master`, the site is built and deployed automatically.

## Project Structure

```text
src/
  App.jsx
  main.jsx
  style.css
  data.js
  helpers.js
  i18n.js
  utils/
  store/
public/
.github/workflows/
```

## Author

- Ridzal Ade Putera
- Frontend Developer
- GitHub: https://github.com/ridzalap0112
- Email: ridzaladeputra@gmail.com
