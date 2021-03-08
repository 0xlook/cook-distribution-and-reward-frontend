import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  getStakeLockupDuration,
  getRewardPerBlock,
  getBlockNumber,
  getBlockTimestamp
} from '../../utils/infura';
import {
  setPoolStakeLockupDuration,
  setPoolRewardPerBlock,
  setPoolBlockNumber,
  setPoolBlockTimestamp
} from '../../utils/web3';
import {
  Box, TextInput, Button, IconCirclePlus
} from '@aragon/ui';
import {toBaseUnitBN,toTokenUnitsBN} from '../../utils/number';
import {COOK} from "../../constants/tokens";
import BigNumber from 'bignumber.js';
import {
  BalanceBlock,
} from '../common/index';

function SetParam({ user, poolAddress }: {user: string, poolAddress: string}) {
  const { override } = useParams();
  if (override) {
    user = override;
  }

  const [stakeLockupDuration, setStakeLockupDuration] = useState(0);
  const [rewardPerBlock, setRewardPerBlock] = useState(new BigNumber(0));
  const [blockNumber, setBlockNumber] = useState(0);
  const [blockTimestamp, setBlockTimestamp] = useState(0);

  //Update User balances
  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        stakeLockupDuration,
        rewardPerBlockStr,
        blockNumber,
        blockTimestamp,
      ] = await Promise.all([
        getStakeLockupDuration(poolAddress),
        getRewardPerBlock(poolAddress),
        getBlockNumber(poolAddress),
        getBlockTimestamp(poolAddress)
      ]);

      const rewardPerBlock = toTokenUnitsBN(rewardPerBlockStr, COOK.decimals);

      if (!isCancelled) {
        setStakeLockupDuration(stakeLockupDuration);
        setRewardPerBlock(rewardPerBlock);
        setBlockNumber(blockNumber);
        setBlockTimestamp(blockTimestamp);
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user, poolAddress]);

  return (
    <>
       <Box heading={`Pool: ${poolAddress}`}>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Block Number" balance={blockNumber}/>
          </div>
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <TextInput
                    value={blockNumber}
                    onChange={event => {
                      setBlockNumber(event.target.value)
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '7em'}}>
                <Button
                  wide
                  icon={<IconCirclePlus/>}
                  label="Set"
                  onClick={() => {
                    setPoolBlockNumber(
                      poolAddress,
                      blockNumber
                    );
                  }}
                  disabled={user === '' ||  poolAddress === ''}
                />
              </div>
            </div>
          </div>
          <div style={{flexBasis: '2%'}}/>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Block Timestamp" balance={blockTimestamp}/>
          </div>
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <TextInput
                    value={blockTimestamp}
                    onChange={event => {
                      setBlockTimestamp(event.target.value)
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '7em'}}>
                <Button
                  wide
                  icon={<IconCirclePlus/>}
                  label="Set"
                  onClick={() => {
                    setPoolBlockTimestamp(
                      poolAddress,
                      blockTimestamp
                    );
                  }}
                  disabled={user === '' ||  poolAddress === ''}
                />
              </div>
            </div>
          </div>
          <div style={{flexBasis: '2%'}}/>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Lock-Up Period" balance={stakeLockupDuration} suffix={"Days"}/>
          </div>
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <TextInput
                    adornment="Days"
                    adornmentPosition="end"
                    value={stakeLockupDuration}
                    onChange={event => {
                      setStakeLockupDuration(event.target.value)
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '7em'}}>
                <Button
                  wide
                  icon={<IconCirclePlus/>}
                  label="Set"
                  onClick={() => {
                    setPoolStakeLockupDuration(
                      poolAddress,
                      stakeLockupDuration
                    );
                  }}
                  disabled={user === '' ||  poolAddress === ''}
                />
              </div>
            </div>
          </div>
          <div style={{flexBasis: '2%'}}/>
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Reward Per Block" balance={rewardPerBlock} suffix={"COOK/BLOCK"}/>
          </div>
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <TextInput
                    adornment="COOK/BLOCK"
                    adornmentPosition="end"
                    value={rewardPerBlock}
                    onChange={event => {
                      setRewardPerBlock(event.target.value)
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '7em'}}>
                <Button
                  wide
                  icon={<IconCirclePlus/>}
                  label="Set"
                  onClick={() => {
                    setPoolRewardPerBlock(
                      poolAddress,
                      toBaseUnitBN(rewardPerBlock, COOK.decimals),

                    );
                  }}
                  disabled={user === '' ||  poolAddress === ''}
                />
              </div>
            </div>
          </div>
          <div style={{flexBasis: '2%'}}/>
        </div>
      </Box>
    </>
  );
}

export default SetParam;
