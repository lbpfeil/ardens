# Testing Patterns

**Analysis Date:** 2026-01-19

## Test Framework

**Runner:**
- Not configured
- No Jest, Vitest, or other test runner detected in `package.json`

**Assertion Library:**
- Not configured

**Run Commands:**
```bash
# Not available - testing not yet set up
npm run test          # Would run tests (not configured)
npm run test:watch    # Watch mode (not configured)
npm run test:coverage # Coverage report (not configured)
```

## Test File Organization

**Location:**
- Not established (no test files exist in source directories)

**Naming:**
- Not established
- Recommended pattern: `*.test.tsx` or `*.spec.tsx` co-located with source

**Structure:**
```
# Recommended structure (not yet implemented)
arden/
├── app/
│   └── login/
│       ├── page.tsx
│       └── page.test.tsx    # Co-located tests
├── components/
│   └── ui/
│       ├── button.tsx
│       └── button.test.tsx  # Co-located tests
└── lib/
    ├── utils.ts
    └── utils.test.ts        # Co-located tests
```

## Test Structure

**Suite Organization:**
Not yet established. Recommended pattern based on CLAUDE.md design system:

```typescript
// Recommended pattern for this codebase
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<Button variant="destructive">Delete</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'destructive')
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

**Patterns:**
- Setup pattern: Use `beforeEach` for common setup
- Teardown pattern: Use `afterEach` for cleanup
- Assertion pattern: Use `expect().to*` assertions

## Mocking

**Framework:** Not configured

**Recommended Patterns:**

```typescript
// Mocking Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: {
      signInWithPassword: jest.fn().mockResolvedValue({ error: null }),
      signUp: jest.fn().mockResolvedValue({ error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  }),
}))

// Mocking Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))
```

**What to Mock:**
- External services (Supabase)
- Next.js router
- Browser APIs (when needed)

**What NOT to Mock:**
- UI components (test actual rendering)
- Utility functions like `cn()`
- CSS classes and styling

## Fixtures and Factories

**Test Data:**
- Not established
- Current codebase uses inline mock data in components (e.g., `mockKPIs`, `mockRecentNCs`)

**Recommended Pattern:**
```typescript
// Create test data factories
export const createMockUser = (overrides = {}) => ({
  id: '1',
  email: 'test@example.com',
  ...overrides,
})

export const createMockKPI = (overrides = {}) => ({
  title: 'Test KPI',
  value: '100',
  change: '+10%',
  icon: TrendingUp,
  color: 'text-brand',
  ...overrides,
})
```

**Location:**
- Recommended: `arden/__tests__/fixtures/` or co-located `*.fixtures.ts`

## Coverage

**Requirements:** Not enforced

**View Coverage:**
```bash
# Not configured - recommended setup:
npm run test:coverage
# Would generate coverage report in coverage/ directory
```

**Recommended Thresholds:**
```javascript
// In jest.config.js or vitest.config.ts
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
}
```

## Test Types

**Unit Tests:**
- Not implemented
- Scope: Individual functions and components
- Focus: Utility functions (`cn`), UI components in isolation

**Integration Tests:**
- Not implemented
- Scope: Component interactions, form submissions
- Focus: Login/signup flows, navigation, Supabase integration

**E2E Tests:**
- Not configured
- Framework recommendation: Playwright (based on Next.js ecosystem)
- Focus: Critical user journeys

## Common Patterns

**Async Testing:**
```typescript
// Recommended pattern for async operations
it('handles form submission', async () => {
  const user = userEvent.setup()
  render(<LoginPage />)

  await user.type(screen.getByLabelText('Email'), 'test@example.com')
  await user.type(screen.getByLabelText('Senha'), 'password123')
  await user.click(screen.getByRole('button', { name: 'Entrar' }))

  await waitFor(() => {
    expect(mockRouter.push).toHaveBeenCalledWith('/app')
  })
})
```

**Error Testing:**
```typescript
// Recommended pattern for error states
it('displays error on invalid credentials', async () => {
  mockSignIn.mockResolvedValueOnce({
    error: { message: 'Invalid login credentials' }
  })

  const user = userEvent.setup()
  render(<LoginPage />)

  await user.type(screen.getByLabelText('Email'), 'test@example.com')
  await user.type(screen.getByLabelText('Senha'), 'wrong')
  await user.click(screen.getByRole('button', { name: 'Entrar' }))

  expect(await screen.findByText('Invalid login credentials')).toBeInTheDocument()
})
```

**Component Variant Testing:**
```typescript
// Testing shadcn component variants
describe('Button variants', () => {
  it.each([
    ['default', 'bg-primary'],
    ['outline', 'border-border'],
    ['destructive', 'bg-destructive'],
    ['ghost', 'hover:bg-muted'],
  ])('renders %s variant with correct classes', (variant, expectedClass) => {
    render(<Button variant={variant as any}>Button</Button>)
    expect(screen.getByRole('button')).toHaveClass(expectedClass)
  })
})
```

## Setup Recommendations

**Recommended packages to add:**
```json
{
  "devDependencies": {
    "@testing-library/jest-dom": "^6.x",
    "@testing-library/react": "^14.x",
    "@testing-library/user-event": "^14.x",
    "vitest": "^1.x",
    "@vitejs/plugin-react": "^4.x",
    "jsdom": "^24.x"
  }
}
```

**Recommended config (`vitest.config.ts`):**
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
```

**Setup file (`vitest.setup.ts`):**
```typescript
import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}))
```

## Priority Test Areas

Based on current codebase, prioritize testing:

1. **Authentication flows** (`arden/app/login/page.tsx`, `arden/app/signup/page.tsx`)
   - Login form validation
   - Signup form validation
   - Error handling
   - Redirect behavior

2. **UI Components** (`arden/components/ui/*`)
   - Button variants and states
   - Form inputs (Input, Label)
   - Card components
   - Dropdown menus

3. **Utility functions** (`arden/lib/utils.ts`)
   - `cn()` class merging function

4. **Layout components** (`arden/app/app/layout.tsx`)
   - Navigation state management
   - Logout functionality

---

*Testing analysis: 2026-01-19*
