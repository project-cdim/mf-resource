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

import { Table } from '@mantine/core';
import _ from 'lodash';
import { useLocale } from 'next-intl';

/**
 * Component to display JSON data in a table
 * @param json JSON data to display in the table
 * @returns Table component
 */

export const JsonTable = ({ json }: { json?: any[] | { [key: string]: any } }) => {
  const data = json;
  const { Tbody } = Table;
  const rows = [];

  if (Array.isArray(data)) {
    // If the data is an array
    data.forEach((item, index) => {
      // Display the index

      rows.push(<Row th={_.toString(index + 1)} td={item} key={index} />);
    });
  } else {
    // If the data is not an array (object)
    for (const key in data) {
      rows.push(<Row th={key} td={data[key]} key={key} />);
    }
  }
  return (
    <Table>
      <Tbody>{rows}</Tbody>
    </Table>
  );
};

/**
 * Function to generate a row
 *
 * @param props.th Text to display inside the <th> tag
 * @param props.td Text to display inside the <td> tag
 * @returns Row (<tr>) JSX.Element
 */
const Row = (props: { th: string; td: any }) => {
  /** Get the current language setting */
  const currentLanguage = useLocale();
  const { th, td } = props;
  const { Th, Td, Tr } = Table;

  /**
   * Format the data: convert to string
   * @param value Value to convert
   * @returns string
   */
  const toStringFunctions = (value: string | number | boolean): string => {
    switch (typeof value) {
      case 'string':
        return value;
      case 'number':
        return value.toLocaleString(currentLanguage);
      case 'boolean':
        return value.toString();
    }
  };
  /** If the data is an array and has only one element, do not display the index */
  const data: any = Array.isArray(td) && td.length === 1 ? td[0] : td;

  return (
    <Tr>
      <Th style={{ width: '25%' }}>{th}</Th>
      {typeof data !== 'object' ? (
        // If it is a string, number, or boolean
        <Td miw={'33.333333%'} ta={'right'}>
          {toStringFunctions(data)}
        </Td>
      ) : (
        // If it is an array or object
        <Td style={{ padding: 0 }}>
          <JsonTable json={data} />
        </Td>
      )}
    </Tr>
  );
};
