import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  getWETHPrice,getSevenMAPrice
} from '../../utils/infura';
import {
  setCookPrice, setWETHPrice, updatePriceFeed
} from '../../utils/web3';
import {
  Box, Button, IconCirclePlus
} from '@aragon/ui';
import {toBaseUnitBN,toTokenUnitsBN} from '../../utils/number';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock
} from '../common/index';
import BigNumberInput from "../common/BigNumberInput";

function SetPrice({ user, oracle, priceComsumer, cookDistribution }: {user: string, oracle: string, priceComsumer: string, cookDistribution: string}) {
  const { override } = useParams();
  if (override) {
    user = override;
  }


  const [currentCookPrice, setCurrentCookPrice] = useState(new BigNumber(0));
  const [currentWethPrice, setCurrentWethPrice] = useState(new BigNumber(0));

  const [targetCookPrice, setTargetCookPrice] = useState(new BigNumber(0));
  const [targetWethPrice, setTargetWethPrice] = useState(new BigNumber(0));

  const [sevenMA, setSevenMA] = useState(new BigNumber(0));
  const [oraclePrice, setOraclePrice] = useState(new BigNumber(0));

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setCurrentCookPrice(new BigNumber(0));
      setCurrentWethPrice(new BigNumber(0));
      setTargetCookPrice(new BigNumber(0));
      setTargetWethPrice(new BigNumber(0));
      setSevenMA(new BigNumber(0));
      setOraclePrice(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        wethP
      ] = await Promise.all([

        getWETHPrice(priceComsumer)
      ]);

      const currentWETHPrice = toTokenUnitsBN(wethP,8);


      if (!isCancelled) {

        setCurrentWethPrice(currentWETHPrice);
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user, oracle, priceComsumer, cookDistribution]);

  return (
    <>
      <Box heading="Cook Price">
       <div style={{width: '100%', paddingTop: '2%'}}>
         <div style={{display: 'flex'}}>
           <div style={{flexBasis: '32%'}}>
             <BalanceBlock asset="COOK/WETH" balance={currentCookPrice.toString()}/>
           </div>
           <div style={{width: '60%'}}>
               <BigNumberInput
                 adornment="WETH"
                 value={targetCookPrice}
                 setter={setTargetCookPrice}
               />
           </div>
           <div style={{width: '40%'}}>
             <Button
               wide
               icon={<IconCirclePlus/>}
               label="Set"
               onClick={() => {
                 setCookPrice(
                   oracle,
                   toBaseUnitBN(targetCookPrice,18)
                 );
               }}
             />
           </div>
         </div>
       </div>

      </Box>
      <Box heading="Price">
      <div style={{width: '100%', paddingTop: '2%'}}>
        <div style={{display: 'flex'}}>
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="WETH/USDC" balance={currentWethPrice.toString()}/>

          </div>
          <div style={{width: '60%'}}>
              <BigNumberInput
                adornment="USDC"
                value={targetWethPrice}
                setter={setTargetWethPrice}
              />
          </div>
          <div style={{width: '40%'}}>
            <Button
              wide
              icon={<IconCirclePlus/>}
              label="Set"
              onClick={() => {
                setWETHPrice(
                  priceComsumer,
                  toBaseUnitBN(targetWethPrice,8)
                );
              }}
            />
          </div>
        </div>
      </div>

      </Box>
      <Box heading="7MA">
      <div style={{width: '100%', paddingTop: '2%'}}>
        <div style={{display: 'flex'}}>
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="COOK/USDC" balance={sevenMA.toString()}/>
          </div>
          <div style={{width: '40%'}}>
            <Button
              wide
              icon={<IconCirclePlus/>}
              label="Get 7MA"
              onClick={async() => {
                const ssma = await getSevenMAPrice(cookDistribution);
                setSevenMA(toTokenUnitsBN(ssma,8));
              }}
            />
          </div>
        </div>
      </div>

      </Box>
      <Box heading="Update Price Feed">
      <div style={{width: '100%', paddingTop: '2%'}}>
        <div style={{display: 'flex'}}>
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="COOK/WETH" balance={oraclePrice.toString()}/>
          </div>
          <div style={{width: '40%'}}>
            <Button
              wide
              icon={<IconCirclePlus/>}
              label="Update Price Feed"
              onClick={() => {
                updatePriceFeed(cookDistribution)
              }}
            />
          </div>
        </div>
      </div>

      </Box>
    </>
  );
}

export default SetPrice;
