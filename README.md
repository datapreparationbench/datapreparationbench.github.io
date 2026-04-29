# DataPrep-Bench — Project Page

A static, single-page academic website for **"DataPrep-Bench: Benchmarking LLMs as Training Data Preparators."**
The site is faithful to the paper: every numeric claim and table is mirrored from `tables/synthetic_data_*` and `tables/eval_results_*`.

## Files

```
website/
├── index.html      # Main page
├── style.css       # Design system (typography, layout, components)
├── script.js       # Smooth-scroll, scroll reveal, BibTeX copy, tab switching
├── assets/
│   └── Frame.png   # Paper Figure 1 (the framework figure)
└── README.md       # This file
```

The site has **no build step** — it works as plain static HTML/CSS/JS.

External assets are loaded from CDNs:
- Google Fonts: Inter, Source Serif 4, JetBrains Mono
- KaTeX (math typesetting)
- Font Awesome (icons)

## Sections

The page mirrors the paper's structure:

| #  | Section            | Source                                  |
|----|--------------------|-----------------------------------------|
| 01 | Abstract           | `sections/0_abstract.tex`               |
| 02 | Framework Overview | `sections/1_introduction.tex` + Frame.png |
| 03 | Two Tracks         | `sections/3_benchmark.tex`              |
| 04 | Strong Baselines   | `sections/4_method.tex`                 |
| 05 | Setup              | `sections/5_experiments.tex`            |
| 06 | Track 1 Results    | `tables/synthetic_data_mgf_*` + `_slm_*` |
| 07 | Track 2 Results    | `tables/eval_results_gms` + `_mfl`      |
| 08 | Key Findings       | `sections/5_experiments.tex` (results)  |
| 09 | Released Resources | hero links                              |
| 10 | Citation           | BibTeX                                  |

## Local preview

```bash
# from the project root
python3 -m http.server 8765 --directory website
# then open http://localhost:8765/
```

## Deploying to GitHub Pages

1. Push the contents of `website/` to a `gh-pages` branch (or to the `docs/` folder of your `main` branch).
2. In your GitHub repo: **Settings → Pages → Build and deployment → Source = `gh-pages` branch (root)**, or **`main` / `docs`**.
3. The site will be available at `https://<username>.github.io/<repo>/`.

A common pattern for the `datapreparationbench.github.io` setup:

```bash
git checkout -b gh-pages
cp -r website/* .
git add . && git commit -m "Add project page"
git push origin gh-pages
```

## Editing tips

- **Numerical claims:** Track 1 highlights and Track 2 correlation values are written in `index.html` and pulled directly from the paper's `.tex` tables. If you update the paper's experimental results, update the corresponding `<td>` values in `index.html`.
- **Theme:** Color palette and spacing live in CSS variables at the top of `style.css` (`:root { --color-primary: ... }`). Changing those values restyles the entire site consistently.
- **Equations:** KaTeX with the standard LaTeX delimiters `\( ... \)` (inline) and `\[ ... \]` (display).
- **Paper button:** The hero `Paper` CTA currently has `href="#"`. When you have an arXiv link (or local PDF), update that `<a>` to point to it.
