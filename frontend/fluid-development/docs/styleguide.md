# UI Style Guide

## 1) Brand
- **Primary**: `#2295AA`
- **Primary (hover)**: `#1A6F7F`
- **Accent**: `#60A5FA`
- **Text**: `#0F172A`
- **Background**: `#FFFFFF`

> Source of truth: `src/styles/tokens.css`

## 2) Typography
- **Font family**: Montserrat (self-hosted)
- **Scale**:
  - Base: 16px
  - h1: 32px / 700
  - h2: 24px / 600
  - h3: 20px / 600
- Usage example:
  ```css
  body { font-family: var(--font-sans); }
  h1 { font-size: var(--fs-700); }
