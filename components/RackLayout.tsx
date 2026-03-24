/*
 * Copyright 2026 NEC Corporation.
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

import React, { useState } from 'react';

import { Flex, Grid, Tooltip } from '@mantine/core';
import { IconArrowBadgeRight, IconPlus } from '@tabler/icons-react';
import { useTranslations } from 'next-intl';

import { CardLoading, IconWithInfo } from '@/shared-modules/components';
import styles from '@/shared-modules/styles/styles.module.css';
import { APPDeviceOverallStatus } from '@/shared-modules/types';

import { APIChassis } from '@/types';
import { calculateOverallStatus } from '@/utils/calculateOverallStatus';

import { useRackChassisContext } from '@/app/[lng]/rack/RackChassisContext';

const RackUnitCount = 42;

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
const FlexItemUnit = (props: { chassis: APIChassis | undefined; faceSide: boolean; unitPosition: number }) => {
  const t = useTranslations();
  const { chassis } = props;
  const { selectedChassisId, setSelectedChassisId } = useRackChassisContext();

  const cellStyle = () => {
    let retStyle = {
      height: 14 * 1.5 * (chassis?.height ?? 1) + 'px',
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
    let worstStatus: APPDeviceOverallStatus = 'OK';
    for (const deviceUnit of chassis.deviceUnits) {
      for (const resource of deviceUnit.resources) {
        const overallStatus = calculateOverallStatus(resource.device.status.health, resource.device.status.state);
        if (overallStatus === 'Critical') {
          // Return immediately if Critical found
          return styles.red;
        } else if (overallStatus === 'Warning') {
          worstStatus = 'Warning';
        }
      }
    }
    return worstStatus === 'Warning' ? styles.yellow : styles.blue;
  };
  const getWorstStatus = (): APPDeviceOverallStatus | null => {
    if (chassis) {
      for (const deviceUnit of chassis.deviceUnits) {
        for (const resource of deviceUnit.resources) {
          const overallStatus = calculateOverallStatus(resource.device.status.health, resource.device.status.state);
          if (overallStatus === 'Critical') {
            return 'Critical';
          }
        }
      }
      for (const deviceUnit of chassis.deviceUnits) {
        for (const resource of deviceUnit.resources) {
          const overallStatus = calculateOverallStatus(resource.device.status.health, resource.device.status.state);
          if (overallStatus === 'Warning') {
            return 'Warning';
          }
        }
      }
    }
    return null;
  };
  const makeNameText = (): string => {
    if (!chassis) {
      return '';
    }
    const { id, name } = chassis;
    const displayName = name || id;
    return props.faceSide ? displayName : `(${displayName})`;
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
            if (chassis?.id) {
              setSelectedChassisId(chassis.id);
            }
          }}
        >
          <div style={{ flex: '0 0 2em', textAlign: 'center' }}>
            {selectedChassisId !== undefined && selectedChassisId === chassis?.id && (
              <IconArrowBadgeRight color={'#228be6'} size={20} />
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: '1 1 auto',
            }}
          >
            {makeNameText() || (isHovered && <IconPlus size={20} opacity={0.7} />)}
          </div>
          <div style={{ flex: '0 0 2em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {getWorstStatus() === 'Critical' && (
              <IconWithInfo
                type='critical'
                label={t('A critical condition exists that requires immediate attention')}
              />
            )}
            {getWorstStatus() === 'Warning' && (
              <IconWithInfo type='warning' label={t('A condition requires attention')} />
            )}
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
const FlexItemUnits = (props: { facePosition: 'Front' | 'Rear'; chassisList: APIChassis[] | undefined }) => {
  const { chassisList } = props;
  const flexItemUnits = [];

  for (let i = 0; i < RackUnitCount; ) {
    const list = chassisList?.filter((data) => data.unitPosition === i + 1);
    const chassis = list?.find((item) => item.facePosition === props.facePosition || item.depth === 'Full');
    flexItemUnits.push(
      <FlexItemUnit
        chassis={chassis}
        faceSide={chassis?.facePosition === props.facePosition}
        unitPosition={i + 1}
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
 * Renders the rack layout component.
 *
 * @param props - The component props.
 * @returns The rack layout component.
 */
export const RackLayout = (props: { loading: boolean; chassisList?: APIChassis[] }) => {
  const t = useTranslations();
  const { loading, chassisList } = props;

  return (
    <CardLoading withBorder loading={loading}>
      <Grid style={{ minHeight: '100%' }}>
        <Grid.Col span={6}>
          <h3>{t('Front')}</h3>
          <Flex>
            <FlexItemUnitNos RackUnitCount={RackUnitCount} />
            <FlexItemUnits facePosition='Front' chassisList={chassisList} />
          </Flex>
        </Grid.Col>
        <Grid.Col span={6}>
          <h3>{t('Rear')}</h3>
          <Flex>
            <FlexItemUnitNos RackUnitCount={RackUnitCount} />
            <FlexItemUnits facePosition='Rear' chassisList={chassisList} />
          </Flex>
        </Grid.Col>
      </Grid>
    </CardLoading>
  );
};
