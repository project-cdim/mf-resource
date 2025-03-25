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

'use client';

import React, { useEffect, useState } from 'react';

import { ActionIcon, Button, Flex, Grid, Group, Select, Space, Stack, Table, Text, Tooltip } from '@mantine/core';
import { IconAlertTriangle, IconArrowBadgeRight, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import _ from 'lodash';
import { useLocale, useTranslations } from 'next-intl';
import useSWRImmutable from 'swr/immutable';

import { CardLoading, MessageBox, PageHeader } from '@/shared-modules/components';
import styles from '@/shared-modules/styles/styles.module.css';
import { APIresource, isAPIresource } from '@/shared-modules/types';
import { fetcher } from '@/shared-modules/utils';
import { useLoading } from '@/shared-modules/utils/hooks';

import { APIChassis, APIrack } from '@/types';

import { ResourceListTable } from '@/components';

const RackUnitCount = 42;

/**
 * Displays the name of a rack.
 *
 * @component
 * @param props - The component props.
 * @returns The rendered component.
 */
const RackName = (props: { name: string }) => {
  const t = useTranslations();
  return (
    <div>
      {t('Rack Name')} : {props.name}
    </div>
  );
};

/**
 * Renders a button component for importing resources.
 * @returns The rendered button component.
 */
const ButtonImport = () => {
  const t = useTranslations();
  return (
    <Button variant='outline' size='xs' data-disabled style={{ '&[dataDisabled]': { pointerEvents: 'all' } }}>
      {t('Import')}
    </Button>
  );
};

/**
 * Renders a button for editing.
 * @returns The rendered button component.
 */
const ButtonEdit = () => {
  const t = useTranslations();
  return (
    <ActionIcon disabled={true} size={30} title={t('Edit')} style={{ '&[dataDisabled]': { pointerEvents: 'all' } }}>
      <IconPencil />
    </ActionIcon>
  );
};

/**
 * Renders a delete button.
 * @returns The delete button component.
 */
const ButtonDelete = () => {
  const t = useTranslations();
  return (
    <ActionIcon disabled={true} size={30} title={t('Delete')} style={{ '&[dataDisabled]': { pointerEvents: 'all' } }}>
      <IconTrash />
    </ActionIcon>
  );
};

/**
 * Counts the number of device types in the given resources array.
 *
 * @param resources - An array of API resources.
 * @returns A string representing the count of each device type in the format "DeviceType(count)".
 */
const countDeviceTypes = (resources: APIresource[]): string => {
  const countMap: { [key: string]: number } = {};
  for (const resource of resources) {
    countMap[resource.device.type] = countMap[resource.device.type] + 1 || 1;
  }
  return Object.entries(countMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([key, value]) => `${_.upperFirst(key)}(${value})`)
    .join(', ');
};

/**
 * Renders a flex item unit number.
 * @param props - The component props.
 * @returns The rendered flex item unit number.
 */
const FlexItemUnitNo = (props: { unitNumber: number }) => {
  const styleI = {
    display: 'flex',
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2em',
    flexShrink: '0',
    fontStyle: 'normal',
    fontSize: '10px',
    height: '21px',
  };
  return <i style={styleI}>{props.unitNumber.toString()}</i>;
};
const FlexItemUnitNos = (props: { RackUnitCount: number }) => {
  const { RackUnitCount } = props;
  const FlexItemUnitNoList = [];

  for (let i = 0; i < RackUnitCount; i++) {
    FlexItemUnitNoList.push(<FlexItemUnitNo unitNumber={i + 1} key={i}></FlexItemUnitNo>);
  }
  return (
    <Flex direction='column-reverse' gap={'0px 0'}>
      {FlexItemUnitNoList}
    </Flex>
  );
};

/**
 * Represents a FlexItemUnit component.
 * @param props - The component props.
 * @returns The FlexItemUnit component.
 */
const FlexItemUnit = (props: {
  chassis: APIChassis | undefined;
  faceSide: boolean;
  unitPosition: number;
  selectedChassis: APIChassis | undefined;
  setSelectedChassis: React.Dispatch<React.SetStateAction<APIChassis | undefined>>;
}) => {
  const t = useTranslations();
  const { chassis, selectedChassis, setSelectedChassis } = props;
  const cellStyle = () => {
    let retStyle = {
      height: 14 * 1.5 * (chassis?.height || 1) + 'px',
      border: 'solid 1px gray',
      borderBottomWidth: '0px',
      BoxSizing: 'border-box',
    };
    if (props.unitPosition === 1) {
      // Add a bottom border to 1U
      retStyle = { ...retStyle, borderBottomWidth: '1px' };
    }
    return retStyle;
  };

  const unitStyle = () => {
    let retStyle = {
      display: 'flex',
      padding: '0 10px',
      alignItems: 'center',
      justifyContents: 'center',
      gap: '0 5px',
      lineHeigt: '1',
      height: '100%',
      width: '100%',
      cursor: chassis ? 'pointer' : 'not-allowed', // Set to 'not-allowed' because 'add' is not supported
      fontSize: '11px',
      color: 'black',
      BoxSizing: 'border-box',
      border: 'none',
    };

    if (!props.faceSide) {
      retStyle = { ...retStyle, color: 'grey' };
    }
    return retStyle;
  };
  const unitClass = () => {
    if (!chassis) {
      return styles.lightgray;
    }
    let retClass = styles.blue;
    for (const resource of chassis.resources) {
      if (resource.device.status.health === 'Critical' || resource.device.status.state === 'Disabled') {
        // Return immediately if it's red
        return styles.red;
      } else if (resource.device.status.health === 'Warning') {
        retClass = styles.yellow;
      } else if (!resource.annotation.available) {
        retClass = styles.gray;
      }
    }
    return retClass;
  };
  const hasAlert = (): boolean => {
    if (chassis) {
      for (const resource of chassis.resources) {
        if (
          resource.device.status.health === 'Critical' ||
          resource.device.status.health === 'Warning' ||
          resource.device.status.state === 'Disabled' ||
          !resource.annotation.available
        ) {
          return true;
        }
      }
    }
    return false;
  };
  const makeNameText = () => {
    if (chassis && chassis?.name) {
      const { name } = chassis;
      return props.faceSide ? name : `(${name})`;
    }
    return '';
  };
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div style={cellStyle()}>
      <Tooltip label={makeNameText() || t('Add chassis')} openDelay={300} closeDelay={200}>
        <button
          style={unitStyle()}
          className={unitClass()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => {
            chassis?.id && setSelectedChassis(chassis);
          }}
        >
          <div style={{ flex: '0 0 2em', textAlign: 'center' }}>
            {selectedChassis !== undefined && selectedChassis === chassis && (
              <IconArrowBadgeRight color={'#228be6'} size={20} />
            )}
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: '1 1 auto',
            }}
          >
            {makeNameText() || (isHovered && <IconPlus size={20} opacity={0.7} />)}
          </div>
          <div style={{ flex: '0 0 2em', textAlign: 'center' }}>
            {hasAlert() && <IconAlertTriangle size={20} opacity={0.7} />}
          </div>
        </button>
      </Tooltip>
    </div>
  );
};

/**
 * Renders the FlexItemUnits component.
 *
 * @param props - The component props.
 * @returns The rendered FlexItemUnits component.
 */
const FlexItemUnits = (props: {
  facePosition: 'Front' | 'Rear';
  selectedChassis: APIChassis | undefined;
  setSelectedChassis: React.Dispatch<React.SetStateAction<APIChassis | undefined>>;
  chassisList: APIChassis[] | undefined;
}) => {
  const { selectedChassis, setSelectedChassis, chassisList } = props;
  const flexItemUnits = [];

  for (let i = 0; i < RackUnitCount; ) {
    const list = chassisList?.filter((data) => data.unitPosition === i + 1);
    const chassis = list?.find((item) => item.facePosition === props.facePosition || item.depth === 'Full');
    flexItemUnits.push(
      <FlexItemUnit
        chassis={chassis}
        faceSide={chassis?.facePosition === props.facePosition}
        unitPosition={i + 1}
        selectedChassis={selectedChassis}
        setSelectedChassis={setSelectedChassis}
        key={i}
      ></FlexItemUnit>
    );
    i += chassis ? chassis.height : 1;
  }
  return (
    <Flex direction='column-reverse' gap={'0px 0'} style={{ flexGrow: '1', flexShrink: '1', minWidth: '0' }}>
      {flexItemUnits}
    </Flex>
  );
};

/**
 * Represents the layout of a rack.
 *
 * @param props - The component props.
 * @returns The rack layout component.
 */
const RackLayout = (props: {
  loading: boolean;
  selectedChassis: APIChassis | undefined;
  setSelectedChassis: React.Dispatch<React.SetStateAction<APIChassis | undefined>>;
  chassisList?: APIChassis[];
}) => {
  const t = useTranslations();
  const { loading, selectedChassis, setSelectedChassis, chassisList } = props;
  return (
    <CardLoading withBorder loading={loading}>
      <Grid style={{ minHeight: '100%' }}>
        <Grid.Col span={6}>
          <h3>{t('Front')}</h3>
          <Flex>
            <FlexItemUnitNos RackUnitCount={RackUnitCount} />
            <FlexItemUnits
              facePosition='Front'
              selectedChassis={selectedChassis}
              setSelectedChassis={setSelectedChassis}
              chassisList={chassisList}
            />
          </Flex>
        </Grid.Col>
        <Grid.Col span={6}>
          <h3>{t('Rear')}</h3>
          <Flex>
            <FlexItemUnitNos RackUnitCount={RackUnitCount} />
            <FlexItemUnits
              facePosition='Rear'
              selectedChassis={selectedChassis}
              setSelectedChassis={setSelectedChassis}
              chassisList={chassisList}
            />
          </Flex>
        </Grid.Col>
      </Grid>
    </CardLoading>
  );
};

/**
 * Renders the ChassisDetail component.
 *
 * @param props - The component props.
 * @returns The rendered ChassisDetail component.
 */
const ChassisDetail = (props: {
  loading: boolean;
  selectedChassis: APIChassis | undefined;
  setSelectedChassis: React.Dispatch<React.SetStateAction<APIChassis | undefined>>;
  chassisList: APIChassis[] | undefined;
}) => {
  const t = useTranslations();
  const { loading, selectedChassis, setSelectedChassis, chassisList } = props;
  /** Get language settings */
  const currentLanguage = useLocale();
  const { Th, Tbody, Td, Tr } = Table;
  return (
    <CardLoading withBorder loading={loading}>
      <Group justify='space-between'>
        <Text>{t('Selected chassis')}</Text>
        <Group justify='space-between' gap='xs'>
          <ButtonEdit />
          <ButtonDelete />
        </Group>
      </Group>
      <Space h='sm' />

      <article>
        <Group gap='xs'>
          <Select
            key={selectedChassis?.id || 'no-selection'}
            data-testid='select-testid'
            placeholder={t('chassis')}
            value={selectedChassis?.id || ''}
            style={{ flexGrow: '1' }}
            data={[
              {
                group: t('Front'),
                items:
                  chassisList
                    ?.filter((item) => item.facePosition === 'Front')
                    .map((item) => ({ value: item.id, label: item.name })) ?? [],
              },
              {
                group: t('Rear'),
                items:
                  chassisList
                    ?.filter((item) => item.facePosition === 'Rear')
                    .map((item) => ({ value: item.id, label: item.name })) ?? [],
              },
            ]}
            onChange={(id) => {
              setSelectedChassis(chassisList?.find((data) => data.id == id));
            }}
          />
        </Group>
        <Space h='sm' />
        <Table>
          <Tbody>
            <Tr>
              <Th style={{ whiteSpace: 'nowrap' }}>{t('Model Name')}</Th>
              <Td>{selectedChassis?.modelName}</Td>
            </Tr>
            <Tr>
              <Th style={{ whiteSpace: 'nowrap' }}>{t('Description')}</Th>
              <Td>{selectedChassis?.description}</Td>
            </Tr>
            <Tr>
              <Th style={{ whiteSpace: 'nowrap' }}>{t('Position')}</Th>
              <Td>
                {selectedChassis ? 'U' + selectedChassis.unitPosition + ' / ' + selectedChassis.facePosition : ''}
              </Td>
            </Tr>
            <Tr>
              <Th style={{ whiteSpace: 'nowrap' }}>{t('Height(U)')}</Th>
              <Td>{selectedChassis?.height}</Td>
            </Tr>
            <Tr>
              <Th style={{ whiteSpace: 'nowrap' }}>{t('Depth')}</Th>
              <Td>{selectedChassis?.depth}</Td>
            </Tr>
            <Tr>
              <Th style={{ whiteSpace: currentLanguage === 'ja' ? 'nowrap' : 'normal' }}>
                {t('Number of devices per type')}
              </Th>
              <Td>{selectedChassis && countDeviceTypes(selectedChassis.resources)}</Td>
            </Tr>
            <Tr>
              <Th style={{ whiteSpace: 'nowrap' }}>{t('Last Updated')}</Th>
              <Td>
                {selectedChassis?.lastUpdate && new Date(selectedChassis.lastUpdate).toLocaleString(currentLanguage)}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </article>
    </CardLoading>
  );
};

/** Props for the RackResourceList component. */
type PropsRackResourceList = {
  loading: boolean;
  selectedChassis: APIChassis | undefined;
};

/**
 * Renders a list of resources in a rack.
 *
 * @param loading - Indicates whether the resource list is currently loading.
 * @param selectedChassis - The selected chassis object containing the resources to display.
 * @returns List of resources in a rack.
 */
const RackResourceList = ({ loading, selectedChassis }: PropsRackResourceList) => {
  const t = useTranslations();
  const selectedAccessors = ['id', 'type', 'health', 'state', 'cxlSwitchId', 'nodeIDs', 'resourceAvailable'];
  return (
    <Stack>
      <h3>{t('Resources in {target}', { target: selectedChassis?.name || t('Selected chassis') })}</h3>
      <ResourceListTable selectedAccessors={selectedAccessors} data={selectedChassis?.resources} loading={loading} />
    </Stack>
  );
};

/**
 * Rack component represents a rack with its elevations and resources.
 */
const Rack = () => {
  const t = useTranslations();
  const rackId = 'rack111';
  const items = [{ title: t('Resource Management') }, { title: t('Rack Elevations') }];
  const [selectedChassis, setSelectedChassis] = useState<APIChassis>();
  // const mswInitializing = useMSW();
  const mswInitializing = false;
  const {
    data: rawData,
    error,
    isValidating,
    mutate,
  } = useSWRImmutable<APIrack>(
    !mswInitializing && `${process.env.NEXT_PUBLIC_URL_BE_CONFIGURATION_MANAGER}/racks/${rackId}?detail=true`,
    fetcher
  );
  const [data, setData] = useState<APIrack | undefined>(rawData);
  useEffect(() => {
    if (!rawData) {
      setData(rawData);
      setSelectedChassis(undefined);
      return;
    }
    const newChassis = rawData.chassis.map((chassis) => {
      const newResoureces = chassis.resources
        .map((resource) => {
          if (isAPIresource(resource)) {
            return resource;
          }
        })
        .filter((resource): resource is Exclude<typeof resource, undefined> => {
          return resource !== undefined;
        });
      return { ...chassis, resources: newResoureces };
    });
    setData({ ...rawData, chassis: newChassis });
  }, [rawData]);

  const loading = useLoading(isValidating || mswInitializing);

  return (
    <>
      <Group justify='space-between' align='flex-end'>
        <PageHeader pageTitle={t('Rack Elevations')} items={items} mutate={mutate} loading={loading} />
        <Group>
          <RackName name={data?.name || ''} />
          <ButtonImport />
        </Group>
      </Group>
      {error && (
        <>
          <Space h='xl' />
          <MessageBox type='error' title={error.message} message={error.response?.data.message || ''} />
        </>
      )}

      <Space h='xl' />

      <Grid>
        <Grid.Col span={7}>
          <RackLayout
            loading={loading}
            selectedChassis={selectedChassis}
            setSelectedChassis={setSelectedChassis}
            chassisList={data?.chassis}
          />
        </Grid.Col>
        <Grid.Col span={5}>
          <ChassisDetail
            loading={loading}
            selectedChassis={selectedChassis}
            setSelectedChassis={setSelectedChassis}
            chassisList={data?.chassis}
          />
        </Grid.Col>
      </Grid>

      <Space h='xl' />

      <RackResourceList loading={loading} selectedChassis={selectedChassis} />
    </>
  );
};

export default Rack;
