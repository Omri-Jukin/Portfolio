# Portfolio Content

This directory contains all modular YAML files for portfolio content.

## YAML Schema Example

```yaml
about:
  title: "About Me"
  description: "Welcome to my portfolio. I'm a passionate developer..."
  sections:
    - heading: "Background"
      content: "I started coding at..."
    - heading: "Philosophy"
      content: "I believe in..."

resume:
  title: "Resume"
  sections:
    - heading: "Experience"
      items:
        - company: "The Startup"
          role: "Software Engineer"
          period: "2022-Present"
          description: "Worked on..."
    - heading: "Education"
      items:
        - school: "Tech University"
          degree: "BSc Computer Science"
          period: "2018-2022"

# Add more sections as needed
projects:
  title: "Projects"
  items:
    - name: "Awesome App"
      description: "A cool project that..."
      link: "https://github.com/username/awesome-app"
```

## Localization

For multi-language support, create separate files:
- `content/en.yaml`
- `content/he.yaml`
- `content/es.yaml`
- `content/fr.yaml`

Each file should follow the same schema.

## Adding a New Section
Just add a new top-level key (e.g., `testimonials:`) and the system will auto-detect and render it if a renderer exists. 
