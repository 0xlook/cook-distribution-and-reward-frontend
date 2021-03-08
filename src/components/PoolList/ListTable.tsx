import React, { useState } from 'react';
import {
  Table, TableRow, TableCell, Text, useViewport, useTheme
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import colors from '../../constants/colors';

type PoolProps = {name:string,address:string,rewardPerBlock:BigNumber,lockedUpPeriod:BigNumber};

function ListTable({ pools, selectedPool, setSelectedPool, detailMode }: {pools?: Array<PoolProps>, selectedPool:string, setSelectedPool?:Function, detailMode?:boolean }) {

  const { below } = useViewport()
  const [hovered, setHovered] = useState('');
  const theme = useTheme();

  const width= below('small')?'100%': '85%'
  const padding =below(1400)?'10pt 7pt': '25pt 15pt'
  return (
      <Table style={{fontSize:below('medium')?12:16, width, margin:"0 auto", marginBottom:20}}>
              <TableRow style={{fontWeight:"bold"}}>
                <TableCell style={{ padding}}>
                  <Text >LP TOKEN</Text>
                </TableCell>
                <TableCell style={{ padding}}>
                  <Text>LOCK-UP {below('medium') && <br/>} PERIOD</Text>
                </TableCell >
                <TableCell style={{ padding}}>
                  <Text>APY</Text>
                </TableCell>
                {detailMode && <TableCell style={{ padding}}>
                  <Text>COOK/BLOCK</Text>
                </TableCell>}
              </TableRow>
              {pools && pools.map(pool => {
                const selectedColor = selectedPool === pool.address ?theme.surfaceSelected:theme.surface
                let textColor = (selectedPool === pool.address)? colors.yellow: (hovered === pool.address?colors.help:'#ffffff');
                return(
                  <TableRow
                    style={{color:textColor,cursor:hovered === pool.address?'pointer':'auto'}}
                    onMouseEnter={()=>{
                      setHovered(pool.address);
                    }}
                    onMouseLeave={()=>{
                      setHovered('');
                    }}
                    key={pool.address}
                    onClick={() => {
                      setSelectedPool && setSelectedPool(pool.address)
                    }}
                  >
                    <TableCell style={{backgroundColor:selectedColor, padding}}>
                      <Text>{pool.name}</Text>
                    </TableCell>
                    <TableCell style={{backgroundColor:selectedColor, padding}}>
                      <Text>{pool.lockedUpPeriod} days lock up</Text>
                    </TableCell>
                    <TableCell style={{backgroundColor:selectedColor, padding}}>
                      <Text>TO BE CALCULATED</Text>
                    </TableCell>
                    {detailMode && <TableCell style={{backgroundColor:selectedColor, padding}}>
                      <Text>{pool.rewardPerBlock.toString()}</Text>
                    </TableCell>}

                  </TableRow>
                )
              })}
          </Table>

  );
}

export default ListTable;
