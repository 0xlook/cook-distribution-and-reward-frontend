import React, { useState } from 'react';
import {
  Table, TableRow, TableCell, Text, useViewport, useTheme, Modal
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import colors from '../../constants/colors';
import Span from "../common/Span";
import { Container, Row, Col } from 'react-grid-system';
import styled from "styled-components";
import LinearText from "../common/LinearText";

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
  const padding = below(breakpoint) ? '2px 4px' : '10pt 15pt'
  const [openPopover, setOpenPopover] = useState(false)


  const renderCell = (title, value, size = 16) => {
    return (
      <div>
        <div style={{ fontSize: size, color: "white" }}>{value}</div>
        <div style={{ fontSize: 10, color: colors.title }}>{title}</div>
      </div>
    )
  }
  const rowDisplay = action ? [11, 8, 1, 4] : [12, 12, 0, 0]
  return (
    <>
      <Modal visible={openPopover} onClose={() => setOpenPopover(false)} width={"100px"}>
        <div style={{ marginTop: "30px" }}>
          {action}
        </div>
      </Modal>
      {pools && pools.map((pool, index) => {
        const isSelected = selectedPool === pool.address
        return (
          <StyledRow
            selected={isSelected}
            key={pool.address}
            onClick={() => {
              setSelectedPool && setSelectedPool(pool.address)
            }}
          >
            <Col style={{}}>
              <Row align="center">
                <Col xs={rowDisplay[0]} md={rowDisplay[1]}>
                  <Row style={{ padding: 0 }} align="center">
                    <Span label={"open"} size={10} color={colors.linear} />
                    <span style={{ paddingLeft: 6, color: colors.title, fontSize: 12 }}>APY <LinearText text={"180%"} size={"16px"} /></span>
                  </Row>
                  <Row style={{ marginTop: 10 }}>
                    <Col xs={12} md={4.5}>
                      {renderCell('LP TOKEN', pool.name, 20)}
                    </Col>
                    <Col xs={4} md={2.5}>{renderCell('LOCK-UP PERIOD', `${pool.lockedUpPeriod}days`)}</Col>
                    <Col xs={4} md={2.5}>{renderCell('POOL SIZE', '100k')}</Col>
                    <Col xs={4} md={2.5}>{renderCell('YOUR STAKE', 0)}</Col>
                  </Row>
                </Col>
                <Col xs={rowDisplay[2]} md={rowDisplay[3]} style={{ padding: 0 }}>

                  {isSelected ? (action && below(breakpoint) ?
                    <div style={{ height: 35, position: 'relative' }}
                      onClick={() => setOpenPopover(true)}>
                      <img style={{ position: 'absolute', top: '50%' }}
                        src={require('../../assets/more.svg')} />
                    </div> : action) : <div />}

                </Col>
              </Row>
            </Col>

          </StyledRow>
        )
      })}</>
  )


}

const StyledRow = styled(Row)`
  background-color: ${colors.card};
  ${props => `
    cursor: ${props.selected ? 'auto' : 'pointer'};
    border: ${props.selected ? `2px solid ` : "0px"};
  `}
  border-image-source: ${colors.linear};
  border-image-slice: 1;
  border-radius: 12px;
  text-align: left;
  margin: 15px 0;
  padding: 10px;

`;

export default ListTable;