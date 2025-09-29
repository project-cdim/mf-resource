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
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/*
 * Custom hook to fetch resource summary data (resources list)
 */
import useSWR from 'swr';
import { APIresources } from '@/shared-modules/types';

/**
 * Custom React hook to fetch a summary of resources from the backend API.
 *
 * @returns An object containing:
 * - `data`: The fetched resource summary data of type `APIresources`, or `undefined` if not yet loaded.
 * - `error`: Any error encountered during the fetch operation.
 * - `isValidating`: A boolean indicating if the data is currently being revalidated.
 */
export const useResourceSummary = () => {
  const mswInitializing = false;
  const { data, error, isValidating } = useSWR<APIresources>(
    !mswInitializing && `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/resources?detail=true`
  );
  return { data, error, isValidating };
};
