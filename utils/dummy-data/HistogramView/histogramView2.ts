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
    GPU: 20,
    Accelerator: 1,
    DSP: 21,
    FPGA: 3,
    UnknownProcessor: 4,
  },
  {
    name: '1 - 19%',
    CPU: 13,
    GPU: 5,
    Accelerator: 12,
    DSP: 2,
    FPGA: 13,
    UnknownProcessor: 4,
  },
  {
    name: '20 - 39%',
    CPU: 0,
    GPU: 5,
    Accelerator: 1,
    DSP: 12,
    FPGA: 3,
    UnknownProcessor: 4,
  },
  {
    name: '40 - 59%',
    CPU: 1,
    GPU: 12,
    Accelerator: 12,
    DSP: 2,
    FPGA: 3,
    UnknownProcessor: 4,
  },
  {
    name: '60 - 79%',
    CPU: 10,
    GPU: 15,
    Accelerator: 11,
    DSP: 2,
    FPGA: 3,
    UnknownProcessor: 4,
  },
  {
    name: '80 - 99%',
    CPU: 20,
    GPU: 20,
    Accelerator: 1,
    DSP: 2,
    FPGA: 3,
    UnknownProcessor: 4,
  },
  {
    name: '100%',
    CPU: 5,
    GPU: 8,
    Accelerator: 3,
    DSP: 2,
    FPGA: 3,
    UnknownProcessor: 4,
  },
];
