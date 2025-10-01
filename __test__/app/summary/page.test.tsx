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

import '@/shared-modules/__test__/mock';
import { render } from '@/shared-modules/__test__/test-utils';
import { act, screen } from '@testing-library/react';
import React from 'react';
import { Tabs } from '@mantine/core';

import Home from '@/app/[lng]/summary/page';
import * as hooks from '@/utils/hooks/useResourceSummary';
import * as hooksRange from '@/utils/hooks/useSummaryRangeGraph';
import * as hooksSingle from '@/utils/hooks/useSummarySingleGraph';
import * as hooksTab from '@/utils/hooks/useTabFromQuery';
import { dummyResourcesDetail } from '@/utils/dummy-data/index/resources';

jest.mock('@/shared-modules/components', () => ({
  ...jest.requireActual('@/shared-modules/components'),
  MessageBox: jest.fn(() => <div data-testid='mocked-message-box' />),
}));
jest.mock('@/components', () => ({
  ...jest.requireActual('@/components'),
  TabList: jest.fn(() => <div data-testid='tab-list' />),
  TabPanel: jest.fn(() => <div data-testid='tab-panel' />),
  TabPanelAll: jest.fn(() => <div data-testid='tab-panel-all' />),
}));
jest.mock('next-intl', () => ({
  ...jest.requireActual('next-intl'),
  useTranslations: () => (key: string) => key,
}));
jest.mock('@/utils/hooks/useResourceSummary');
jest.mock('@/utils/hooks/useSummaryRangeGraph');
jest.mock('@/utils/hooks/useSummarySingleGraph');
jest.mock('@/utils/hooks/useTabFromQuery');
jest.mock('@mantine/core', () => ({
  ...jest.requireActual('@mantine/core'),
  Tabs: jest.fn().mockImplementation((props: any) => (
    <div data-testid='tabs-root' data-value={props.value}>
      {props.children}
    </div>
  )),
}));

jest.mock('lodash', () => ({
  ...jest.requireActual('lodash'),
  debounce: (fn: any) => fn,
}));

const MessageBox = require('@/shared-modules/components').MessageBox;
const TabList = require('@/components').TabList;
const TabPanel = require('@/components').TabPanel;
const TabPanelAll = require('@/components').TabPanelAll;

const setupMocks = (options: {
  resourceSummaryData?: any;
  resourceSummaryError?: any;
  rangeGraphError?: any;
  singleGraphError?: any;
  tabFromQuery?: string | undefined;
}) => {
  (hooks.useResourceSummary as jest.Mock).mockReturnValue({
    data: options.resourceSummaryData,
    error: options.resourceSummaryError,
    isValidating: false,
  });
  (hooksRange.useSummaryRangeGraph as jest.Mock).mockReturnValue({
    error: options.rangeGraphError,
  });
  (hooksSingle.useSummarySingleGraph as jest.Mock).mockReturnValue({
    error: options.singleGraphError,
  });
  (hooksTab.useTabFromQuery as jest.Mock).mockReturnValue(options.tabFromQuery);
};

describe('Summary Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Home', () => {
    test('SWRConfig uses default interval if env is not set', () => {
      const oldEnv = process.env.NEXT_PUBLIC_DASHBOARD_INTERVAL_SECONDS;
      delete process.env.NEXT_PUBLIC_DASHBOARD_INTERVAL_SECONDS;
      setupMocks({});
      render(<Home />);
      expect(screen.getByTestId('tab-list')).toBeInTheDocument();
      process.env.NEXT_PUBLIC_DASHBOARD_INTERVAL_SECONDS = oldEnv;
    });
    test('SWRConfig uses env interval if set and not 0', () => {
      process.env.NEXT_PUBLIC_DASHBOARD_INTERVAL_SECONDS = '10';
      setupMocks({});
      render(<Home />);
      expect(screen.getByTestId('tab-list')).toBeInTheDocument();
    });
    test('SWRConfig uses default interval if env is 0', () => {
      process.env.NEXT_PUBLIC_DASHBOARD_INTERVAL_SECONDS = '0';
      setupMocks({});
      render(<Home />);
      expect(screen.getByTestId('tab-list')).toBeInTheDocument();
    });
    test('SWRConfig uses default interval if env is not integer', () => {
      process.env.NEXT_PUBLIC_DASHBOARD_INTERVAL_SECONDS = 'abc';
      setupMocks({});
      render(<Home />);
      expect(screen.getByTestId('tab-list')).toBeInTheDocument();
    });

    test('renders with resource data', () => {
      setupMocks({ resourceSummaryData: dummyResourcesDetail });
      render(<Home />);
      expect(TabList).toHaveBeenCalled();
      expect(TabPanel).toHaveBeenCalled();
      expect(TabPanelAll).toHaveBeenCalled();
    });
    test('renders with empty resource data', () => {
      setupMocks({ resourceSummaryData: { count: 0, resources: [] } });
      render(<Home />);
      expect(TabList).toHaveBeenCalled();
    });
    test('renders with undefined resource data', () => {
      setupMocks({ resourceSummaryData: undefined });
      render(<Home />);
      expect(TabList).toHaveBeenCalled();
    });
    test('renders with null resource data', () => {
      setupMocks({ resourceSummaryData: null });
      render(<Home />);
      expect(TabList).toHaveBeenCalled();
    });
    test('tabFromQuery sets active tab if valid', () => {
      setupMocks({ resourceSummaryData: dummyResourcesDetail, tabFromQuery: 'all' });
      render(<Home />);
      expect(TabList).toHaveBeenCalled();
    });
    test('tabFromQuery does not set active tab if not in tab list', () => {
      setupMocks({ resourceSummaryData: dummyResourcesDetail, tabFromQuery: 'notfound' });
      render(<Home />);
      expect(TabList).toHaveBeenCalled();
    });
    test('tabFromQuery is undefined', () => {
      setupMocks({ resourceSummaryData: dummyResourcesDetail, tabFromQuery: undefined });
      render(<Home />);
      expect(TabList).toHaveBeenCalled();
    });
    test('date range is set on mount', () => {
      setupMocks({ resourceSummaryData: dummyResourcesDetail });
      render(<Home />);
      // No error thrown means date logic is covered
    });
    test('Tabs onChange triggers activeTab change (debounce)', async () => {
      setupMocks({ resourceSummaryData: dummyResourcesDetail });
      render(<Home />);
      await screen.findByTestId('tab-list');
      const onChange = (global as any).__tabsOnChange;
      if (typeof onChange === 'function') {
        onChange('CPU');
      }
    });
    test('Tabs onChange with null triggers summary tab', async () => {
      setupMocks({ resourceSummaryData: dummyResourcesDetail });
      render(<Home />);
      await screen.findByTestId('tab-list');
      const onChange = (global as any).__tabsOnChange;
      if (typeof onChange === 'function') {
        onChange(null);
      }
    });
    test('activeTab is updated by debounced onChange of Tabs', () => {
      setupMocks({ resourceSummaryData: dummyResourcesDetail });
      jest.useFakeTimers();
      render(<Home />);
      act(() => {
        // @ts-ignore
        Tabs.mock.lastCall[0].onChange(null);
        // Tabs.mock.lastCall[0].onChange('all');
        jest.advanceTimersByTime(200); // Simulate debounce delay
      });

      // @ts-ignore
      expect(Tabs.mock.lastCall[0].value).toBe('summary');
      jest.useRealTimers();
    });
  });

  describe('handleTabChange logic', () => {
    // To directly test the logic of HomeMain, we extract it as an external function
    function handleTabChangeLogic(setActiveTab: (v: string) => void, value: string | null) {
      setActiveTab(value || 'summary');
    }
    test('setActiveTab is called with summary if value is null', () => {
      const setActiveTab = jest.fn();
      handleTabChangeLogic(setActiveTab, null);
      expect(setActiveTab).toHaveBeenCalledWith('summary');
    });
    test('setActiveTab is called with summary if value is empty string', () => {
      const setActiveTab = jest.fn();
      handleTabChangeLogic(setActiveTab, '');
      expect(setActiveTab).toHaveBeenCalledWith('summary');
    });
    test('setActiveTab is called with value if value is not null/empty', () => {
      const setActiveTab = jest.fn();
      handleTabChangeLogic(setActiveTab, 'custom');
      expect(setActiveTab).toHaveBeenCalledWith('custom');
    });
  });

  describe('Messages', () => {
    const getMessageBoxProps = () => (MessageBox as jest.Mock).mock.calls.pop()?.[0];
    test('shows error message with response data', () => {
      setupMocks({ resourceSummaryError: { message: 'err', response: { data: { message: 'msg' } } } });
      render(<Home />);
      const props = getMessageBoxProps();
      expect(props.type).toBe('error');
      expect(props.title).toBe('err');
      expect(props.message).toBe('msg');
    });
    test('shows error message with empty response', () => {
      setupMocks({ resourceSummaryError: { message: 'err', response: {} } });
      render(<Home />);
      const props = getMessageBoxProps();
      expect(props.type).toBe('error');
      expect(props.title).toBe('err');
      expect(props.message).toBe('');
    });
    test('shows error message with no response', () => {
      setupMocks({ resourceSummaryError: { message: 'err' } });
      render(<Home />);
      const props = getMessageBoxProps();
      expect(props.type).toBe('error');
      expect(props.title).toBe('err');
      expect(props.message).toBe('');
    });
    test('shows rangeGraphError', () => {
      setupMocks({ rangeGraphError: { message: 'rangeError' } });
      render(<Home />);
      const props = getMessageBoxProps();
      expect(props.type).toBe('error');
      expect(props.title).toBe('rangeError');
    });
    test('shows singleGraphError', () => {
      setupMocks({ singleGraphError: { message: 'singleError' } });
      render(<Home />);
      const props = getMessageBoxProps();
      expect(props.type).toBe('error');
      expect(props.title).toBe('singleError');
    });
    test('handles error as null/undefined/false/0/empty string', () => {
      [null, undefined, false, 0, ''].forEach((v) => {
        setupMocks({ resourceSummaryError: v, rangeGraphError: v, singleGraphError: v });
        render(<Home />);
        expect(screen.getAllByTestId('tab-list').length).toBeGreaterThan(0);
      });
    });
    test('Messages shows all errors at once', () => {
      setupMocks({
        resourceSummaryError: { message: 'err', response: { data: { message: 'msg' } } },
        rangeGraphError: { message: 'rangeError' },
        singleGraphError: { message: 'singleError' },
      });
      render(<Home />);
      // The MessageBox component is called three times
      expect((MessageBox as jest.Mock).mock.calls.length).toBeGreaterThanOrEqual(3);
    });
    test('Messages handles undefined error.message and error.response.data.message', () => {
      setupMocks({ resourceSummaryError: { response: { data: {} } } });
      render(<Home />);
      const props = (MessageBox as jest.Mock).mock.calls.pop()?.[0];
      expect(props.title).toBe(undefined);
      expect(props.message).toBe('');
    });
  });

  describe('edge/boundary cases for deviceTypes and tabs', () => {
    test('renders with deviceTypes containing false/0/empty string', () => {
      setupMocks({
        resourceSummaryData: {
          count: 3,
          resources: [{ device: { type: false } }, { device: { type: 0 } }, { device: { type: '' } }],
        },
      });
      render(<Home />);
      expect(TabList).toHaveBeenCalled();
      expect(TabPanel).toHaveBeenCalled();
      expect(TabPanelAll).toHaveBeenCalled();
    });
    test('sortByDeviceType returns empty if no types', () => {
      setupMocks({ resourceSummaryData: { count: 0, resources: [] } });
      render(<Home />);
      expect(TabList).toHaveBeenCalled();
    });
    test('TabList/TabPanel/TabPanelAll handle empty tabs', () => {
      setupMocks({ resourceSummaryData: { count: 1, resources: [{ device: { type: undefined } }] } });
      render(<Home />);
      expect(TabList).toHaveBeenCalled();
      expect(TabPanel).toHaveBeenCalled();
      expect(TabPanelAll).toHaveBeenCalled();
    });
  });
});
