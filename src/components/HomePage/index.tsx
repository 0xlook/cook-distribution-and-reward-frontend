import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Header, Box, LinkBase, Tag, Text
} from '@aragon/ui';
import { Container, Row, Col } from 'react-grid-system';
function HomePage() {
  const history = useHistory();

  return (
    <>
      <div style={{ padding: '1%', display: 'flex', alignItems: 'center', width:'100%' }}>
        <div style={{ marginLeft: '2%'  }}>
          <Header primary="COOK Protocol" />
          <Text>Cook Protocol is a completely decentralized Ethereum-based asset management platform built for investors and professional asset managers to unlock an entirely new universe of DeFi innovations.</Text>
        </div>
      </div>

      <Container >
        <Row style={{marginRight:0}}>
          <MainButton
            title="Distribution"
            description="Manage Cook balance and withdraw."
            icon={<i className="fas fa-wallet"/>}
            onClick={() => {
              history.push('/distribution/');
            }}
          />
          <MainButton
            title="Pools"
            description="Earn rewards for providing liquidity."
            icon={<i className="fas fa-parachute-box"/>}
            onClick={() => {
              history.push('/pools/');
            }}
          />
          </Row>
      </Container>

    </>
  );
}

type MainButtonPropx = {
  title: string,
  description: string,
  icon: any,
  onClick: Function,
  tag?:string
}

function MainButton({
  title, description, icon, onClick, tag,
}:MainButtonPropx) {
  return (
    <Col xs={12} md={4}>
    <LinkBase onClick={onClick} style={{ width:"100%", margin:10 }}>
      <Box>
        <div style={{ padding: 10, fontSize: 18 }}>
          {title}
          {tag ? <Tag>{tag}</Tag> : <></>}
        </div>
        <span style={{ fontSize: 48 }}>
          {icon}
        </span>
        {/*<img alt="icon" style={{ padding: 10, height: 64 }} src={iconUrl} />*/}
        <div style={{ paddingTop: 5, opacity: 0.5, whiteSpace: 'normal'}}>
          {description}
        </div>

      </Box>
    </LinkBase>
    </Col>
  );
}

export default HomePage;
