# Locale Files Update Guide

## Overview

The English locale file (en.json) has been successfully refactored to use the new component-based structure. The remaining locale files (es.json, fr.json, he.json) need to be updated to match this new structure.

## New Structure

The locale files now have the following sections organized by component:

### 1. hero

- title
- subtitle
- exploreButton
- aboutButton

### 2. about

- title
- subtitle
- description
- skills (codeConjurer, brandArchitect, designDreamer)
- skillDetails (detailed information for each skill)

### 3. qa

- title
- subtitle
- questions (array of question/answer pairs)

### 4. services

- title
- subtitle
- services (array of service objects with title, description, buttonText, buttonVariant)

### 5. projects

- title
- subtitle
- projects (array of project objects with title, description, link)

### 6. contact

- title
- subtitle
- description
- button
- form (form-related translations)

## Removed Sections

- `scrollingSections` - This section has been removed and its content distributed to individual component sections
- Duplicated data across different sections has been consolidated

## Files to Update

1. `locales/es.json` - Spanish translations
2. `locales/fr.json` - French translations
3. `locales/he.json` - Hebrew translations

## Process

For each locale file:

1. Remove the `scrollingSections` section
2. Add the new component sections (hero, about, qa, services, contact)
3. Update the existing `projects` section to match the new structure
4. Remove any duplicated data
5. Ensure all translations are properly localized

## Notes

- The English file serves as the template for the new structure
- All component sections should be at the root level of the JSON object
- Maintain the existing metadata, common, career, resume, skills, and footer sections
- Ensure all translations are culturally appropriate for each language
