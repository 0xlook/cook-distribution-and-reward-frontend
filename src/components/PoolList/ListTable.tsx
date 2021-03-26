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
        <div style={{ fontSize: 12, color: colors.title }}>{title}</div>
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
          <div style={{ position: 'relative' }} key={pool.address}>
            <StyledRow
              selected={isSelected}
              style={{ margin: "11px 0" }}

              onClick={() => {
                setSelectedPool && setSelectedPool(pool.address)
              }}
            >
              <Col style={{}}>
                <Row align="center">
                  <Col xs={rowDisplay[0]} md={rowDisplay[1]}>
                    <Row style={{ padding: 0 }} align="center">
                      <Span label={"open"} size={10} color={colors.linear} />
                      <span style={{ paddingLeft: 30, color: colors.title, fontSize: 12 }}>APY <LinearText text={"180%"} size={"16px"} /></span>
                    </Row>
                    <Row style={{ marginTop: 10, textAlign: 'left' }} >
                      <Col xs={12} md={4.5}>
                        <div>
                          <div style={{ fontSize: 20, fontWeight: 500, color: 'white' }}>{pool.name}</div>
                          <div style={{ fontSize: 12, color: colors.title }}>LP TOKEN</div>
                        </div>
                      </Col>
                      <Col xs={4} md={2.5}>{renderCell('LOCK-UP PERIOD', `${pool.lockedUpPeriod}days`)}</Col>
                      <Col xs={4} md={2.5}>{renderCell('POOL SIZE', '100k')}</Col>
                      <Col xs={4} md={2.5}>{renderCell('YOUR STAKE', 0)}</Col>
                    </Row>
                  </Col>
                  <Col xs={rowDisplay[2]} md={rowDisplay[3]} style={{ padding: 0 }}>

                    {isSelected ? (action && below(breakpoint) ?
                      <div style={{ height: 35, cursor: 'pointer' }}
                        onClick={() => {
                          console.log("GGG")
                          setOpenPopover(true)
                        }}
                      >
                        <img style={{ position: 'absolute', top: '50%' }}

                          src={require('../../assets/more.svg')} />
                      </div> : action) : <div />}

                  </Col>
                </Row>
              </Col>

            </StyledRow>
          </div>
        )
      })}</>
  )


}

const StyledRow = styled(Row)`
  z-index:0;
  padding:23px 30px;
  border-radius: 10px;
  width:100%;
  background: ${colors.card};
  ${props => `
    cursor: ${props.selected ? 'auto' : 'pointer'};
  `}
  :before {
    content:"";
    position:absolute;
    ${props => `
    z-index:${props.selected ? '0' : '-1'};
  `}
    top:0;
    left:0;
    right:0;
    bottom:0;
    padding: 1.5px;
    border-radius: 10px;
    background: ${colors.linear};
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
  }



`;

export default ListTable;