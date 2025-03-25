# mf-resource

## Overview

This is the resource management function of the `Composable Disaggregated Infrastructure Manager` frontend.

Uses the micro frontend framework OSS `Luigi`.

It is assumed that it is at the same level as other micro frontend projects.

```bash
frontend/
├── mf-core
├── mf-layout
├── mf-resource ★This repository
└── mf-user
```

## Requirement

- Docker x86_64
- AlmaLinux 9

`mf-resource` requires Node v18.20.04 or later.

Have a look at the dependencies and devDependencies sections in the [package.json](package.json) file to find an up-to-date list of the requirements of mf-resource.

## Usage

Please refer to the `README.md` of the `mf-core` repository for installation and startup methods.

### For Development

Rename `.env.local.example` to `.env.local` and make the necessary settings.

```bash
$ cp .env.local.example .env.local
```

The settings will be reflected when you update the `.env.local` file.

If you are using it on the client side, please prefix the variable name with `NEXT_PUBLIC_`.

The settings in `.env.local` take precedence over the settings in `.env` under `mf-core`.

## Tests

Please refer to the `README.md` of the `mf-core` repository.

## Limitations

- The filter may not always be activated
  - In the resources type filter, there are occasions when selecting an option does not activate the filter. This issue is intermittent, and re-selecting the filter usually resolves the problem.
  - Although this behavior has not been confirmed for filters other than the type filter, a similar issue might occur.

## License

Copyright (c) 2025 NEC Corporation.

`mf-resource` is under [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
