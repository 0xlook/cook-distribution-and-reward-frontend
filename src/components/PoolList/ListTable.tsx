import React, { useState } from 'react';
import {
  Table, TableRow, TableCell, Text, useViewport, useTheme, ContextMenu, ContextMenuItem
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import colors from '../../constants/colors';
import Span from "../common/Span";
import { Container, Row, Col } from 'react-grid-system';
import styled from "styled-components";


type PoolProps = { name: string, address: string, rewardPerBlock: BigNumber, lockedUpPeriod: BigNumber };

function ListTable({ pools, selectedPool, setSelectedPool, detailMode, action }: {
  pools?: Array<PoolProps>, selectedPool: string,
  setSelectedPool?: Function, detailMode?: boolean, action?: any
}) {

  const { below } = useViewport()
  const [hovered, setHovered] = useState('');
  const theme = useTheme();
  const breakpoint = 'medium'
  const width = '100%'
  const padding = below(breakpoint) ? '7px 4px' : '10pt 15pt'

  if (below(breakpoint)) {
    return (
      <Table style={{ fontSize: 12, width, margin: "20px auto" }}>
        {pools && pools.map(pool => {
          const selectedColor = selectedPool === pool.address ? theme.surfaceSelected : "transparent"
          return (
            <TableRow
              style={{ color: 'white', cursor: hovered === pool.address ? 'pointer' : 'auto' }}
              onMouseEnter={() => {
                setHovered(pool.address);
              }}
              onMouseLeave={() => {
                setHovered('');
              }}
              key={pool.address}
              onClick={() => {
                setSelectedPool && setSelectedPool(pool.address)
              }}
            >
              <TableCell style={{ backgroundColor: selectedColor }}>
                <div style={{ width: "100%", padding }}>
                  <Row>
                    <Col xs={10}>
                      <Row><Span label={"open"} size={10} /><span style={{ marginLeft: 5, fontSize: 14 }}>{pool.name}</span></Row>
                      <Row style={{ marginTop: 5 }}>
                        <Col>{pool.lockedUpPeriod}days</Col>
                        <Col>{0}%</Col>
                        <Col>100k</Col>
                        <Col>0</Col>
                      </Row>
                    </Col>
                    <Col xs={2} style={{ padding: 0 }}>
                      <ContextMenu style={{ width: "100%" }}>
                        <ContextMenuItem>
                          {selectedPool === pool.address ? action : <div />}
                        </ContextMenuItem>
                      </ContextMenu>
                    </Col>
                  </Row>
                </div>
              </TableCell>

            </TableRow>
          )
        })}
      </Table>
    )
  }


  return (
    <StyledTable style={{ width, margin: "20px auto" }}>
      <StyledTableRow style={{ fontWeight: "bold" }}>
        <TableCell style={{ padding, backgroundColor: 'transparent' }}>
          <Text >LP TOKEN</Text>
        </TableCell>
        <TableCell style={{ padding, backgroundColor: 'transparent' }}>
          <Text>LOCK-UP {below('medium') && <br />} PERIOD</Text>
        </TableCell >
        <TableCell style={{ padding, backgroundColor: 'transparent' }}>
          <Text>APY</Text>
        </TableCell>
        {detailMode &&
          <>
            <TableCell style={{ padding, backgroundColor: 'transparent' }}>
              <Text>POOL SIZE</Text>
            </TableCell>
            <TableCell style={{ padding, backgroundColor: 'transparent' }}>
              <Text>YOUR STAKE</Text>
            </TableCell>
            <TableCell style={{ padding, backgroundColor: 'transparent' }}>
              <Text>STATUS</Text>
            </TableCell>

          </>
        }
        {
          action &&
          <TableCell style={{ padding, backgroundColor: 'transparent' }}>
            <Text>ACTION</Text>
          </TableCell>
        }
      </StyledTableRow>
      {pools && pools.map(pool => {
        const selectedColor = selectedPool === pool.address ? theme.surfaceSelected : "transparent"

        return (
          <TableRow
            style={{ color: 'white', cursor: hovered === pool.address ? 'pointer' : 'auto' }}
            onMouseEnter={() => {
              setHovered(pool.address);
            }}
            onMouseLeave={() => {
              setHovered('');
            }}
            key={pool.address}
            onClick={() => {
              setSelectedPool && setSelectedPool(pool.address)
            }}
          >
            <TableCell style={{ backgroundColor: selectedColor, padding }}>
              <Text>{pool.name}</Text>
            </TableCell>
            <TableCell style={{ backgroundColor: selectedColor, padding }}>
              <Text>{pool.lockedUpPeriod} days</Text>
            </TableCell>
            <TableCell style={{ backgroundColor: selectedColor, padding }}>
              <Text>{0}%</Text>
            </TableCell>
            {detailMode &&
              <>
                <TableCell style={{ backgroundColor: selectedColor, padding }}>
                  <Text>100k</Text>
                </TableCell>
                <TableCell style={{ backgroundColor: selectedColor, padding }}>
                  <Text>0</Text>
                </TableCell>
                <TableCell style={{ backgroundColor: selectedColor, padding }}>
                  <Span label={"open"} />
                </TableCell>

              </>}
            {
              action && (
                <TableCell style={{ backgroundColor: selectedColor, padding: '0 5px', minWidth: below(1200) ? '120px' : '400px' }}>
                  {selectedPool === pool.address ? action : <div />}
                </TableCell>
              )
            }
          </TableRow>
        )
      })}
    </StyledTable>

  );
}

const StyledTable = styled(Table)`
  background: 
  linear-gradient(#0A0A2A,#0A0A2A) padding-box, ${colors.linear} border-box;
  border: 2px solid transparent;
  border-radius:5px;
`

const StyledTableRow = styled(TableRow)`
background: 
linear-gradient(#0A0A2A,#0A0A2A) padding-box, ${colors.linear} border-box;
  border-bottom: 2px solid transparent;
  td {
      background: transparent;
      border-top: 0 !important;
      border-bottom: 2px solid transparent;
  }

`


export default ListTable;