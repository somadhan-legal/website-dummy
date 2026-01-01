# GitHub & Collaboration Guide

## Repository Setup

**Repository URL:** https://github.com/somadhan-legal/website-dummy

---

## Getting Started

### 1. Clone the Repository

```bash
# Clone the repo
git clone https://github.com/somadhan-legal/website-dummy.git

# Navigate to project folder
cd website-dummy

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Configure Git (First Time Only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Daily Workflow

### Before Starting Work

Always pull the latest changes before starting:

```bash
git pull origin main
```

### Making Changes

```bash
# 1. Create a new branch for your feature
git checkout -b feature/your-feature-name

# 2. Make your changes...

# 3. Check what files changed
git status

# 4. Stage your changes
git add .

# 5. Commit with a clear message
git commit -m "Add: brief description of what you did"

# 6. Push your branch
git push origin feature/your-feature-name
```

### Commit Message Guidelines

Use prefixes for clarity:
- `Add:` - New feature or file
- `Fix:` - Bug fix
- `Update:` - Changes to existing feature
- `Remove:` - Deleted code or files
- `Style:` - CSS/styling changes
- `Docs:` - Documentation changes

Examples:
```
Add: waitlist form validation
Fix: mobile menu not closing
Update: FAQ questions in Bengali
Style: improve button hover effects
```

---

## Merging Changes

### Option 1: Pull Request (Recommended)

1. Push your branch to GitHub
2. Go to repository on GitHub
3. Click "Compare & pull request"
4. Add description of changes
5. Request review from team member
6. After approval, click "Merge"

### Option 2: Direct Merge (Small Changes)

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge your branch
git merge feature/your-feature-name

# Push to GitHub
git push origin main
```

---

## Handling Conflicts

If you see merge conflicts:

```bash
# 1. Pull latest main
git pull origin main

# 2. Git will show conflicts in files
# 3. Open conflicted files and look for:
<<<<<<< HEAD
your changes
=======
their changes
>>>>>>> main

# 4. Edit the file to keep what you want
# 5. Remove the conflict markers
# 6. Stage and commit
git add .
git commit -m "Fix: resolve merge conflicts"
```

---

## Useful Commands

```bash
# See commit history
git log --oneline

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git checkout .

# See what branch you're on
git branch

# Switch branches
git checkout branch-name

# Delete a branch
git branch -d branch-name
```

---

## Team Collaboration Tips

1. **Communicate** - Let team know what you're working on
2. **Small commits** - Commit often with clear messages
3. **Pull frequently** - Stay updated with team changes
4. **Review PRs** - Check each other's code before merging
5. **Don't force push** - Avoid `git push --force` on shared branches

---

## Deployment

The site auto-deploys to Netlify when changes are pushed to `main` branch.

---

# Background Image Ideas for Hero Section

## Concept: Bangladesh Legal Heritage with Modern Tech

Create a 3D composite image that blends traditional Bangladeshi elements with modern, tech-forward aesthetics.

### Visual Elements to Include

1. **Architectural Elements**
   - Silhouette of Supreme Court of Bangladesh building
   - Subtle outline of National Parliament (Jatiya Sangsad Bhaban)
   - Traditional courthouse columns

2. **Cultural Elements**
   - Abstract lotus flower patterns (national flower)
   - Geometric patterns inspired by Nakshi Kantha
   - Water lily shapes (Shapla)

3. **Legal Symbols**
   - Scales of justice (stylized, modern)
   - Gavel elements
   - Document/scroll shapes

4. **Tech/Modern Elements**
   - Circuit board patterns (subtle)
   - Connected nodes/network visualization
   - Abstract data flow lines
   - Soft geometric shapes

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Deep Teal | `#0F2E2E` | Primary background |
| Teal Light | `#1A4A4A` | Mid-tones |
| Teal Accent | `#2D6B6B` | Highlights |
| Gold Accent | `#C4A84B` | Subtle accents (justice scales) |
| White | `#FFFFFF` | Highlights, 10-20% opacity |
| Cream | `#F5F0E6` | Soft overlays |

### Composition Guidelines

```
┌────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░                                    ░░  │
│  ░░    [Lighter area for text]         ░░  │
│  ░░    Content will overlay here       ░░  │
│  ░░                                    ░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                            │
│    ╱╲    ◇◇◇    ⚖️    ╱╲                   │
│   ╱  ╲  3D Elements  ╱  ╲                  │
│  Architectural shapes on bottom/sides      │
│                                            │
└────────────────────────────────────────────┘
```

### Technical Specs

- **Resolution:** 2560 x 1440px (2K) minimum
- **Format:** WebP for web, PNG for editing
- **File size:** Under 500KB optimized
- **Aspect ratio:** 16:9 landscape

### 3D Tools Recommended

- Blender (free) - for 3D modeling
- Spline (web-based) - quick 3D scenes
- Cinema 4D - professional option
- After Effects - for compositing

### Style References

1. **Gradient mesh backgrounds** - Smooth color transitions
2. **Glassmorphism** - Frosted glass 3D shapes
3. **Isometric illustrations** - Clean, modern 3D
4. **Abstract geometric** - Floating shapes with depth

### Implementation Notes

After creating the image:

1. Replace the Unsplash URL in `HeroLanding.tsx`:
```tsx
<img
  src="/hero-background.webp"  // Your new image
  alt="Background"
  className="w-full h-[120%] object-cover"
/>
```

2. Adjust overlay opacity if needed:
```tsx
<div className="absolute inset-0 bg-gradient-to-b from-brand-600/70 via-brand-600/50 to-brand-600/80" />
```

3. Test on mobile to ensure text remains readable

---

## Questions?

Contact: somadhan.legal@gmail.com
