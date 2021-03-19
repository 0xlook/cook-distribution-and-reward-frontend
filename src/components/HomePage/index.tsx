import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Header, Box, LinkBase, Tag, Text
} from '@aragon/ui';
import { Container, Row, Col } from 'react-grid-system';
import distributionPNG from '../../assets/distribution.png'
import lpMiningPNG from '../../assets/lp_mining.png'
import cookMiningPNG from '../../assets/cook_mining.png'
import styled from 'styled-components'

const StyledText = styled(Text)`
  background: -webkit-linear-gradient(0, #E71CFF -3.76%, #00AEFF 111.78%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: Futura;
  font-size: 20px;
  font-weight: 700;
  line-height: 27px;
  letter-spacing: 0.03em;

  @media only screen and (max-width: 767px) {
    font-size: 14px
  }
`

const StyledDescText = styled(Text)`
  background: -webkit-linear-gradient(0, #E71CFF -3.76%, #00AEFF 111.78%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 14px;
  font-weight: 400;
  line-height: 25px;
  letter-spacing: 0.03em;
`

const DescText = styled(Text)`
  color: #71A4DD;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: 0.03em;
`
const TitleText = styled(Text)`
  font-family: Futura;
  font-size: 50px;
  font-weight: 700;
  line-height: 66px;
  letter-spacing: 0.05em;

  @media only screen and (max-width: 767px) {
    font-size: 36px;
    line-height: 50px;
  }
`

const StyledTitle = styled(Text)`
  font-family: Futura;
  font-size: 20px;
  font-weight: 700;
  line-height: 27px;
  letter-spacing: 0.03em;
}`  

const StyledBox = styled(Box)`
  background: 
    linear-gradient(#0A0A2A,#0A0A2A) padding-box,
    linear-gradient(90deg, #E611FF -6.85%, #03ABF9 109.03%) border-box;
    border: 1px solid transparent;
    border-radius:12px;
  :hover {
    transform: scale(1.1);
  }

}`

const StyledDiv = styled.div`
  margin-top: 10vh;
  margin-left: 2%;
  text-align: center;

  .desc {
    margin-top: 14px;
    margin-bottom: 100px;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }

  @media only screen and (max-width: 767px) {
    margin-top: 20px;
    text-align: left;

    .desc {
      width: 90%;
      text-align: left;
      margin: 20px 0px;
    }
  }
}`

function HomePage() {
  const history = useHistory();

  return (
    <>
      <div style={{ padding: '1%', display: 'flex', alignItems: 'center', width:'100%' }}>
        <StyledDiv>
          <div>
            <StyledText>Accessibilty, Transparency, Security</StyledText>
          </div>
          <div style={{ marginTop: '9px'}}>
            <TitleText>COOK PROTOCOL</TitleText>
          </div>
          <div className="desc">
            <DescText>Cook Protocol is a completely decentralized Ethereum-based asset management platform built for investors and professional asset managers to unlock an entirely new universe of DeFi innovations.</DescText>
          </div>
        </StyledDiv>
      </div>

      <Container style={{padding: 0}}>
        <Row style={{marginRight:0}}>
          <MainButton
            title="Distribution"
            description="Manage Cook balance for presale parties"
            icon={distributionPNG}
            onClick={() => {
              history.push('/distribution/');
            }}
          />
          <MainButton
            title="LP Mining"
            description="Stake Uni token, get cook token"
            icon={lpMiningPNG}
            onClick={() => {
              history.push('/pools/');
            }}
          />
          <MainButton
            title="Cook Mining"
            description="Stake cook token, get cook token"
            icon={cookMiningPNG}
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
      <LinkBase onClick={onClick} 
        style={{
          width:"100%", margin:10 
        }}>
        <StyledBox>
          <div style={{ padding: 5, fontSize: 18 }}>
            <StyledTitle>{title}</StyledTitle>
            {tag ? <Tag>{tag}</Tag> : <></>}
          </div>
          <div style={{ paddingTop: 5, whiteSpace: 'normal'}}>
            <StyledDescText>{description}</StyledDescText>
          </div>
          <img alt="icon" style={{ marginTop: 15, padding: 10, height: 150 }} src={icon} />
        </StyledBox>
      </LinkBase>
    </Col>
  );
}

export default HomePage;
