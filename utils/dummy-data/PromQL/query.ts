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

export const dummyQueryPromQL = {
  status: 'success',
  data: {
    resultType: 'vector',
    result: [
      {
        metric: {
          data_label: 'storage_usage',
        },
        value: [1701755114.437, '96'],
      },
      {
        metric: {
          __name__: 'CPU_usageRate',
          data_label: 'usage',
          instance: 'gi-hw-performance-exporter:8080',
          job: 'res10102',
        },
        value: [1701755114.437, '56'],
      },
      {
        metric: {
          __name__: 'CPU_usageRate',
          data_label: 'usage',
          instance: 'gi-hw-performance-exporter:8080',
          job: 'resTEST101',
        },
        value: [1701755114.437, '53'],
      },
      {
        metric: {
          __name__: 'memory_usedMemory',
          data_label: 'usage',
          instance: 'gi-hw-performance-exporter:8080',
          job: 'res10203',
        },
        // value: [1701755114.437, '45'],
        value: [1701755114.437, '16777216'], // 16GiB
      },
      {
        metric: {
          __name__: 'memory_usedMemory',
          data_label: 'usage',
          instance: 'gi-hw-performance-exporter:8080',
          job: 'resTEST102',
        },
        value: [1701755114.437, '8388608'], // 8GiB
        // value: [1701755114.437, '16777216'], // 16GiB
        // value: [1701755114.437, '33554432'], // 32GiB
      },
    ],
  },
  stats: {
    seriesFetched: '6',
  },
};
