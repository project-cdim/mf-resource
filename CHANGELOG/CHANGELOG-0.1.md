# Changelog 0.1

## [0.1.1](https://github.com/project-cdim/mf-resource/compare/v0.1.0...v0.1.1) - 2025-09-25

The changes from v0.1.0 are as follows:

### Features

- Resource Group feature added
  - Resource Group List View
    - Create, update, and delete resource groups
  - Resource Group Detail View
    - Display detailed information of the resource group
  - Resource Detail View
    - Change the resource group to which it belongs
- Changeable graph display period
  - The display period of each graph displayed on the Resource Management Summary View, Node Detail View, and Resource Detail View can be changed

### Bug Fixes

- Fixed an issue where the query string was displayed as is in the filter
  - In each table, when filtering by a query passed when navigating from other pages, if there are no filter candidates, the query string is displayed as is

### Other Changes

- Support tab order
- Add breadcrumb list to Resource Management Summary View
- Add link to "Number of resources with node configuration" on Resource Management Summary View
- Modify loading display on Resource Management Summary View to match data retrieval timing for each card
- Modify to display detected state flag (detected)
  - Add column to Resource List View
  - Add display to Resource Detail View
