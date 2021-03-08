import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getStakeLockupDuration,
  getRewardPerBlock,
  getTotalStaked
} from '../../utils/infura';


import {
  useViewport, Modal, Button
} from '@aragon/ui';
import { POOLS } from "../../constants/contracts";
import { toTokenUnitsBN } from '../../utils/number';
import { COOK,UNI } from "../../constants/tokens";
import Pool from "../Pool";
import BigNumber from 'bignumber.js';
import ListTable from "./ListTable";
import { Row, Col } from 'react-grid-system';

function PoolList({ user }: {user: string}) {
  const { override } = useParams();
  if (override) {
    user = override;
  }
  const { below, above } = useViewport()
  const [poolList, setPoolList] = useState([] as any);
  const [selectedPool, setSelectedPool] = useState('');
  const [totalStaked, setTotalStaked] = useState(new BigNumber(0));
  const [opened, setOpened] = useState(false);


  useEffect(() => {
    let isCancelled = false;

    // setPoolList([{name:"4 UNI-V2 (WETH/COOK)", address:"0xf4B146FbA71F41E0592668ffbF264F1D186b2Ca8",lockedUpPeriod:"90 days",rewardPerBlock:"300"}]);
    async function updatePoolInfo() {
      const poolList = await Promise.all(POOLS.map( async (pool)=>{
        const [lockedup,reward] =
        await Promise.all([
            getStakeLockupDuration(pool.address),
            getRewardPerBlock(pool.address)
          ])
        const poolRewardPerBlock = toTokenUnitsBN(reward, COOK.decimals);
        return({
          name: pool.name,
          address: pool.address,
          lockedUpPeriod: lockedup,
          rewardPerBlock: poolRewardPerBlock
        });
      }));

      const totalStakedBalance = await POOLS.reduce(async (sum, pool) => {
        const staked = await getTotalStaked(pool.address);
        return (await sum).plus(staked);
      }, Promise.resolve(new BigNumber(0)));

      const totalStaked = toTokenUnitsBN(totalStakedBalance, UNI.decimals);

      if (!isCancelled) {
        setPoolList(poolList);
        setTotalStaked(totalStaked);
      }
    }



    updatePoolInfo();






    const id = setInterval(updatePoolInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);
  return (
    <>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:40}}>Total Staked</div>
        <div style={{ marginBottom:8,fontSize:40, paddingRight:10}}>{totalStaked.toString()} UNI-V2</div>
      </div>
      <Row>
        <Col sm={12} lg={5} >
          <ListTable pools={poolList} selectedPool={selectedPool} setSelectedPool={(selected)=>{
            setSelectedPool(selected)
            setOpened(true)
          }
          } detailMode={true}/>

        </Col>
          <Col sm={12} lg={7}>
          {selectedPool === '' ? '' :
            <>
            {above('medium') && <Pool user={user} poolAddress={selectedPool} pools={poolList}/>}
            {below('medium') && <Modal closeButton={false} visible={opened} onClose={()=>{
            }}><Pool user={user} poolAddress={selectedPool} pools={poolList}/>
            <Button
              wide
              style={{marginTop:20}}
              label={"Close"}
              onClick={() => {
                setOpened(false)
              }}
              disabled={false}
            /></Modal>}

            </>
          }
        </Col>
      </Row>
    </>
  );
}

export default PoolList;
