# Changelog 0.2

## [0.2.0](https://github.com/project-cdim/mf-resource/compare/v0.1.1...v0.2.0) - 2026-03-24

The changes from v0.1.1 are as follows:

### Features

- Add graph export feature
  - Download graph data in CSV format
- Add Composite Resource Detail View
  - Add new "Composite Resource" column to Resource List View
  - Add link to Composite Resource Detail View from Resource List View and Resource Detail View
- Add table column display state save feature
  - Save selected display columns to browser's localStorage and restore saved content when redisplayed

### Other Changes

- Unify line break settings and abbreviation displays across all tables
- Bump React Server Components version to address security vulnerability
- Modify wording of "Included in design"
- Modify to display power state
  - Add column to Resource List View
  - Add display to Node Detail View
- Add overall status combining resource state and health state
  - Add column to Resource List View
  - Add display to Resource Detail View