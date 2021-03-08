import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
  getTodayNumber, getDistributionStartTimestamp
} from '../../utils/infura';
import {
  setDay
} from '../../utils/web3';
import {
  Box, Button, IconCirclePlus
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  NumberBlock,
} from '../common/index';
import BigNumberInput from "../common/BigNumberInput";

function SetDay({ user, cookDistribution }: {user: string, cookDistribution: string}) {
  const { override } = useParams();
  if (override) {
    user = override;
  }


  const [startDay, setStartDay] = useState(new BigNumber(0));
  const [today, setToday] = useState(new BigNumber(0));
  const [dayNumber, setDayNumber] = useState(new BigNumber(0));

  //Update User balances
  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        startTimeStamp,
        tDay
      ] = await Promise.all([
        getDistributionStartTimestamp(cookDistribution),
        getTodayNumber(cookDistribution)
      ]);

      const startDay = new BigNumber(startTimeStamp).div(86400).decimalPlaces(0, 1);
      const todayNumber = new BigNumber(tDay);

      if (!isCancelled) {
        setStartDay(new BigNumber(startDay));
        setToday(new BigNumber(todayNumber));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user, cookDistribution]);

  return (
    <>
       <Box heading="CookDistributionDay">
       <div style={{width: '100%', paddingTop: '2%'}}>
         <div style={{display: 'flex'}}>
           <div style={{flexBasis: '32%'}}>
             <NumberBlock title="Startday Number" num={startDay}/>
           </div>
           <div style={{flexBasis: '32%'}}>
             <NumberBlock title="Today Number" num={today}/>
           </div>
           <div style={{width: '60%'}}>
               <BigNumberInput
                 adornment="Day"
                 value={dayNumber}
                 setter={setDayNumber}
               />
           </div>
           <div style={{width: '40%'}}>
             <Button
               wide
               icon={<IconCirclePlus/>}
               label="Set"
               onClick={() => {
                 setDay(
                   cookDistribution,
                   dayNumber
                 );
               }}
             />
           </div>
         </div>
       </div>

      </Box>
    </>
  );
}

export default SetDay;
