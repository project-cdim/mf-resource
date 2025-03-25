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

import { HistogramViewData } from '@/components';

export const dummyData: HistogramViewData = [
  {
    name: '0%',
    CPU: 10,
  },
  {
    name: '1 - 19%',
    CPU: 3,
  },
  {
    name: '20 - 39%',
    CPU: 0,
  },
  {
    name: '40 - 59%',
    CPU: 1,
  },
  {
    name: '60 - 79%',
    CPU: 10,
  },
  {
    name: '80 - 99%',
    CPU: 20,
  },
  {
    name: '100%',
    CPU: 5,
  },
];
