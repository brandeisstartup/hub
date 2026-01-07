# AGENTS.md - AI Agent Custom Instructions

This document provides comprehensive context and custom instructions for AI agents working on the Brandeis Startup Hub project.

## Project Overview

**Brandeis Startup Hub** is a web application for managing startup projects, teams, and events at Brandeis University. It serves as a centralized platform for entrepreneurs to showcase projects, collaborate with team members, and engage with the startup community.

### Key Features
- Project management and showcase
- Team member collaboration
- User authentication and profiles
- Event planning and calendar integration
- Content management via Contentful CMS
- Search and discovery functionality
- Submission forms and applications

---

## Technology Stack

### Frontend
- **Framework**: Next.js 15.2.8 (React 18.2.0)
- **Styling**: Tailwind CSS with plugins (@tailwindcss/forms, @tailwindcss/typography, @tailwindcss/aspect-ratio)
- **UI Library**: Headless UI, Heroicons, React Icons
- **Form Handling**: React Hook Form with Zod validation
- **GraphQL Client**: Apollo Client 3.13.1
- **Notifications**: React Hot Toast

### Backend
- **API Framework**: Next.js API Routes + Apollo Server
- **Database**: PostgreSQL (Prisma ORM)
- **Authentication**: Clerk
- **CMS**: Contentful
- **Image Hosting**: Vercel Blob
- **File Upload**: Formidable

### Development Tools
- **Build Tool**: Turbopack (Next.js experimental feature)
- **Testing**: Cypress (E2E tests)
- **Linting**: ESLint
- **TypeScript**: Strict mode enabled
- **Package Manager**: Bun

---

## Architecture Overview

### Directory Structure

```
src/
├── pages/                    # Next.js pages and API routes
│   ├── api/                 # Backend API endpoints
│   │   ├── graphql/        # Apollo Server GraphQL endpoint
│   │   ├── v1/             # REST API v1 (auth, uploads, youtube)
│   │   └── webhooks/       # Webhook handlers (Clerk)
│   ├── [dynamic]/           # Dynamic routes with parameters
│   ├── sign-in/             # Clerk authentication pages
│   └── sign-up/
├── lib/                      # Core utilities and configurations
│   ├── apolloClient.ts      # Apollo Client setup
│   ├── contentful.ts        # Contentful CMS client
│   └── graphql/             # GraphQL schema and operations
│       ├── queries.ts
│       ├── mutations.ts
│       ├── resolvers.ts
│       └── typeDefs.ts
├── hooks/                    # Custom React hooks
│   ├── useDeleteProject.ts
│   ├── useImageUploader.ts
│   ├── useManageTeamMembers.ts
│   ├── usePostProject.ts
│   ├── useUpdateProjectField.ts
│   └── useYouTubeVideos.ts
├── context/                  # React Context for state management
│   ├── EventContext.tsx
│   └── UserContext.tsx
├── ui/                       # UI component library
│   └── components/
│       ├── brandeisBranding/    # Brand-specific components
│       ├── contentfulComponents/# CMS-powered components
│       ├── forms/               # Form components
│       ├── googleCalendarComponents/
│       ├── media/               # Media-related components
│       ├── molecules/           # Reusable component groups
│       ├── organisms/           # Complex component compositions
│       └── seo/                 # SEO components
├── types/                    # TypeScript type definitions
│   ├── article-types.ts
│   ├── search-types.ts
│   └── used/
│       └── CompetitionTypes.ts
├── utils/                    # Utility functions
├── styles/                   # Global styles
├── fonts/                    # Custom font configurations
├── data/                     # Static data (admins.js)
└── middleware.ts            # Next.js middleware for request handling
```

### Data Layer

**Prisma ORM** with PostgreSQL database contains two primary models:

#### Projects Model
- `id` (Int, primary key)
- `title` (String, 255 chars)
- `created_date` (DateTime, default: now)
- `creator_email` (String)
- `short_description` (String)
- `long_description` (String)
- `competition` (String)
- `team_members_emails` (Array of strings)
- `video_url` (String)
- `image_url` (String)

#### Users Model
- `id` (Int, primary key)
- `clerkId` (String, unique - synced with Clerk auth)
- `email` (String, unique)
- `secondaryEmail` (String, optional)
- `firstName`, `lastName` (String, optional)
- `bio` (String, optional)
- `imageUrl` (String, optional)
- `graduationYear`, `major` (optional)

### API Architecture

#### GraphQL Layer (`src/lib/graphql/`)
- **Queries**: Data fetching operations
- **Mutations**: Data modification operations
- **Resolvers**: Field resolver implementations
- **TypeDefs**: GraphQL schema definitions

#### REST API (`src/pages/api/`)
- **GraphQL Endpoint**: `/api/graphql` - Apollo Server instance
- **Auth API**: `/api/v1/auth/*` - Authentication flows
- **Uploads API**: `/api/v1/uploads/*` - File upload handling with Vercel Blob
- **YouTube API**: `/api/v1/youtube/*` - YouTube video integration
- **Webhooks**: `/api/webhooks/clerk` - Clerk authentication events

### State Management

**Context API** with React Context providers:
- `EventContext`: Event-related global state
- `UserContext`: User authentication and profile state

### Component Hierarchy

```
Atoms/Primitives (SVG icons, basic text)
    ↓
Molecules (form fields, cards, buttons with logic)
    ↓
Organisms (sections, complex forms)
    ↓
Pages (full page layouts)
```

Specialized component categories:
- **brandeisBranding/**: Brandeis-specific design system (breadcrumbs, buttons, headings, etc.)
- **contentfulComponents/**: CMS-powered reusable content components
- **forms/**: Form-specific components for data collection
- **media/**: Image, video, and rich media components
- **seo/**: SEO optimization components (meta tags, structured data)

---

## Key Integration Points

### Authentication (Clerk)
- Handles user sign-in/sign-up flows
- Syncs user data to `Users` table via webhooks
- Protects API routes and pages

### Content Management (Contentful)
- Powers dynamic content (articles, events, team info)
- Rich text rendering with @contentful/rich-text-react-renderer
- Media asset hosting

### External APIs
- **YouTube**: Video embedding and metadata retrieval
- **Google Calendar**: Event scheduling and calendar views
- **Vercel Blob**: Secure image/file storage for project uploads

### GraphQL
- Single query/mutation endpoint at `/api/graphql`
- Type-safe operations defined in `src/lib/graphql/`
- Apollo Client for frontend data fetching

---

## Common Development Patterns

### Custom Hooks Usage
Use custom hooks from `src/hooks/` for:
- Project CRUD operations (`usePostProject`, `useDeleteProject`, `useUpdateProjectField`)
- Image uploads (`useImageUploader`)
- Team management (`useManageTeamMembers`)
- YouTube integration (`useYouTubeVideos`)

**Pattern:**
```typescript
const { mutate, isLoading } = usePostProject();
await mutate({ title: "New Project", ... });
```

### Form Handling
- Use **React Hook Form** for form state management
- Use **Zod** for schema validation
- Combine with custom hooks for mutation submission

**Pattern:**
```typescript
const form = useForm({ resolver: zodResolver(schema) });
const { mutate } = usePostProject();

form.handleSubmit(async (data) => {
  await mutate(data);
});
```

### Component Composition
- Create small, focused molecules that compose into organisms
- Use TypeScript for prop typing
- Leverage Tailwind CSS for styling consistency
- Import Brandeis branding components for consistency

**Pattern:**
```typescript
// Molecule: FormField
<FormField label="Title" error={error} />

// Organism: ProjectForm
<ProjectForm onSubmit={handleSubmit} />

// Page: ProjectCreate
<PageLayout><ProjectForm /></PageLayout>
```

### Type Safety
- Strict TypeScript enabled (`"strict": true`)
- Define types in `src/types/` for domain entities
- Use Zod schemas for runtime validation
- GraphQL operations are type-safe via Apollo Client codegen

---

## Testing Strategy

### End-to-End Testing (Cypress)
Located in `cypress/e2e/tests/`:
- **home/**: Home page navigation and content
- **layout/**: Layout and navigation components
- **nav/**: Navigation link functionality
- **search/**: Search feature functionality

**Test Fixtures** available in `cypress/fixtures/`:
- `example.json`, `profile.json`, `users.json` - Mock data for tests

**Command**: `bun run cypress:open` (interactive) or `bun run test` (headless)

---

## Environment & Configuration

### Key Configuration Files
- `tsconfig.json`: TypeScript strict mode enabled, path alias `@/*` maps to `src/*`
- `next.config.ts`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS customization
- `eslint.config.mjs`: ESLint rules
- `postcss.config.mjs`: PostCSS processing
- `prisma/schema.prisma`: Database schema
- `.env.local`: Environment variables (not committed)

### Build System
- **Development**: `bun run dev` (uses Turbopack)
- **Build**: `bun run build` (runs Prisma generate first)
- **Start**: `bun run start` (production server)

---

## Custom Instructions for AI Agents

### When Adding Features

1. **Define Types First**: Create TypeScript types in `src/types/` before implementation
2. **Schema Validation**: Define Zod schemas for API request validation
3. **Database Considerations**: If new data is needed, add to Prisma schema and run migrations
4. **GraphQL Integration**: Add queries/mutations to `src/lib/graphql/` for data operations
5. **Component Structure**: Follow atomic design (atoms → molecules → organisms)
6. **Styling**: Use Tailwind CSS utility classes; import Brandeis components for consistency
7. **Testing**: Write E2E tests in `cypress/e2e/tests/` for new features

### Code Quality Standards

- **TypeScript**: Use strict mode; avoid `any` types
- **Naming**: Use clear, descriptive names (components: PascalCase, functions: camelCase)
- **Error Handling**: Use React Hot Toast for user feedback
- **Performance**: Use Next.js Image component for images, lazy load heavy components
- **Security**: Never expose API keys; use environment variables
- **Comments**: Document complex logic; keep comments concise

### File Organization

- **Keep related files together**: UI components with their types and utilities
- **Reuse existing utilities**: Check `src/utils/` and `src/lib/` before creating new utilities
- **Hook-based logic**: Extract complex component logic into custom hooks in `src/hooks/`
- **Component library**: Use Brandeis branding components for visual consistency

### Database Modifications

1. Update `prisma/schema.prisma`
2. Run: `bun run prisma migrate dev --name description`
3. Verify migration in `prisma/migrations/`
4. Update TypeScript types to match schema

### API Development

- Use Apollo Server for GraphQL (preferred for new endpoints)
- REST endpoints in `src/pages/api/v1/` for legacy routes
- Always validate input with Zod or GraphQL schema
- Return proper HTTP status codes
- Document API contracts in JSDoc comments

### Deployment & Vercel Integration

- Uses Vercel Blob for file storage (production images)
- Prisma migrations run during build
- Environment variables configured in Vercel dashboard
- Check `package.json` build script for build order

---

## Important Notes

### Clerk Webhooks
When users sign in/up via Clerk, webhooks sync data to PostgreSQL `Users` table. Always assume user data is available in database after authentication.

### Contentful CMS
Rich text from Contentful is rendered with custom resolver. When consuming Contentful data, always render rich text with `@contentful/rich-text-react-renderer`.

### File Uploads
Uploads go to Vercel Blob (not local filesystem). Handle async upload state properly in UI.

### Route Structure
- Dynamic routes use `[param]` syntax
- Catch-all routes use `[...param]` syntax
- API routes follow RESTful conventions in `v1/` namespace

### Migration Preservation
All migrations are tracked in `prisma/migrations/`. Never modify committed migration files; create new migrations instead.

---

## Quick Reference Commands

```bash
# Development
bun run dev              # Start dev server with Turbopack

# Database
bun run prisma studio   # Open Prisma Studio GUI
bun run prisma generate # Generate Prisma Client
bun run prisma migrate dev --name "migration_name"

# Testing
bun run cypress:open    # Interactive Cypress testing
bun run test            # Run Cypress tests headless

# Building
bun run build           # Production build
bun run start           # Start production server
bun run lint            # Run ESLint

# Cleanup
bun run cleanGit        # Delete all non-main branches locally and prune remote
```

---

## Summary

The Brandeis Startup Hub is a modern **Next.js + React + Tailwind** full-stack application with:
- **Frontend**: React components with Tailwind CSS
- **Backend**: Next.js API routes + Apollo GraphQL + Prisma ORM
- **Data**: PostgreSQL database with Prisma migrations
- **Auth**: Clerk for user management
- **Content**: Contentful CMS for dynamic content
- **Storage**: Vercel Blob for file uploads

Follow the established patterns, maintain TypeScript strictness, and leverage the component library for consistent UI/UX.
