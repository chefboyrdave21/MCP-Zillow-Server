# Test Directory Structure

This directory contains all test-related files for the MCP Server Zillow project. The structure mirrors our source code organization to maintain clarity and consistency.

## Directory Organization

```
tests/
├── config/          # Configuration module tests
├── controllers/     # Controller logic tests
├── fixtures/        # Test data fixtures
├── integration/     # Integration tests
│   └── example.test.ts
├── middleware/      # Middleware function tests
├── mocks/          # Mock implementations
│   ├── zillow/     # Zillow API response mocks
│   ├── config/     # Configuration mocks
│   └── transport/  # Transport layer mocks
├── models/         # Data model tests
├── routes/         # Route handler tests
├── unit/          # Unit tests
│   └── example.test.ts
├── utils/         # Utility function tests
│   ├── robots.test.ts
│   └── example.test.ts
├── setup.ts       # Test setup configuration
├── setup.test.ts  # Tests for setup configuration
├── tools.test.ts  # Tool-related tests
├── index.test.ts  # Main entry point tests
└── jest.setup.ts  # Jest-specific setup
```

## Test Categories

### Unit Tests (`/unit`)
- Individual component testing
- Mocked dependencies
- Fast execution

### Integration Tests (`/integration`)
- Component interaction testing
- Minimal mocking
- End-to-end workflows

### Mock Implementations (`/mocks`)
- Zillow API response mocks
- Configuration mocks
- Transport layer mocks

### Fixtures (`/fixtures`)
- Test data
- Shared test utilities
- Common test scenarios

## Best Practices

1. **File Naming**
   - Test files should end with `.test.ts`
   - Match source file names (e.g., `robots.ts` → `robots.test.ts`)

2. **Test Organization**
   - Group related tests using `describe` blocks
   - Use clear test descriptions with `it` or `test`
   - Follow the AAA pattern (Arrange, Act, Assert)

3. **Mocking**
   - Use `jest.mock()` for external dependencies
   - Place reusable mocks in `/mocks` directory
   - Document mock behavior

4. **Test Data**
   - Store test data in `/fixtures`
   - Use meaningful data that represents real scenarios
   - Keep test data minimal and focused

5. **Coverage**
   - Aim for high test coverage
   - Focus on critical paths
   - Include error scenarios

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Adding New Tests

1. Create test file in appropriate directory
2. Import necessary dependencies and mocks
3. Write tests following best practices
4. Ensure tests are independent
5. Add to test coverage report

## Continuous Integration

Tests are automatically run in CI/CD pipeline. Ensure:
- All tests pass before merging
- Coverage meets minimum requirements
- No test file is skipped 