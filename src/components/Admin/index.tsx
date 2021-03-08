import React from 'react';
import { useParams } from 'react-router-dom';

import {POOLS, CookDistribution, Oracle, PriceConsumer} from "../../constants/contracts";
import IconHeader from "../common/IconHeader";
import SetParam from "./SetParam";
import SetDay from "./SetDay";
import SetPrice from "./SetPrice";

function Admin({ user }: {user: string}) {
  const { override } = useParams();
  if (override) {
    user = override;
  }

  return (
    <>
      <IconHeader icon={<i className="fas fa-parachute-box"/>} text="Admin Functions"/>
      <SetDay
        user={user}
        cookDistribution={CookDistribution}
      />
      <SetPrice
        user={user}
        oracle={Oracle}
        priceComsumer={PriceConsumer}
        cookDistribution={CookDistribution}
      />
      {
        POOLS.map(pool => {
        return(
          <SetParam key={pool.address}
            user={user}
            poolAddress={pool.address}
          />
        )
      })
    }
    </>
  );
}

export default Admin;
