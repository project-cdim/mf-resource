/*
 * Copyright 2025 NEC Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { useQuery } from '@/shared-modules/utils/hooks';

/**
 * Custom hook that retrieves the value of the "tab" query parameter from the URL.
 * @returns The value of the "tab" query parameter as a string, or undefined if it is not present.
 */
export const useTabFromQuery = (): string | undefined => {
  const query = useQuery();
  const tabName = query.tab;
  if (typeof tabName === 'string') {
    return tabName;
  } else if (Array.isArray(tabName)) {
    return tabName[0];
  } else {
    return undefined;
  }
};
