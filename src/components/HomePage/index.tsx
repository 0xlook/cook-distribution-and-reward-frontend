import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box, LinkBase, Tag, Text
} from '@aragon/ui';
import { Container, Row, Col } from 'react-grid-system';
import distributionPNG from '../../assets/distribution.svg'
import lpMiningPNG from '../../assets/lp_mining.svg'
import cookMiningPNG from '../../assets/cook_mining.svg'
import distributionHover from '../../assets/distribution_hover.svg'
import lpMiningHover from '../../assets/lp_mining_hover.svg'
import cookMiningHover from '../../assets/cook_mining_hover.svg'
import twitter from '../../assets/twitter.svg'
import github from '../../assets/github.svg'
import telegram from '../../assets/telegram.svg'
import styled from 'styled-components'
import { useTranslation } from "react-i18next"

const StyledText = styled(Text)`
  background: -webkit-linear-gradient(0, #E71CFF -3.76%, #00AEFF 111.78%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: 18px;
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
  font-weight: 300;
  line-height: 25px;
  letter-spacing: 0.03em;
`

const DescText = styled(Text)`
  color: #71A4DD;
  font-size: 16px;
  font-weight: 300;
  line-height: 24px;
  letter-spacing: 0.03em;
`
const TitleText = styled(Text)`
  font-size: 56px;
  font-weight: 700;
  letter-spacing: 0.05em;

  @media only screen and (max-width: 767px) {
    font-size: 36px;
    line-height: 50px;
  }
`

const StyledTitle = styled(Text)`
  font-size: 18px;
  font-weight: 700;
  line-height: 27px;
  letter-spacing: 0.03em;
}`

const StyledDiv = styled.div`
  margin-top: 5vh;
  margin-left: 2%;
  text-align: center;

  .desc {
    margin-top: 14px;
    margin-bottom: 40px;
    max-width: 521px;
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

const StyledLink = styled.a`
  color: #12AAB5;
  padding: 16px;
  text-decoration: none;
  &:hover {
    color: #805e49;
  }
`

function HomePage() {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <>
      <div style={{ padding: '1%', display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>
        <StyledDiv>
          <div>
            <StyledText>Accessibilty, Transparency, Security</StyledText>
          </div>
          <div style={{ marginTop: '9px' }}>
            <TitleText>COOK PROTOCOL</TitleText>
          </div>
          <div className="desc">
            <DescText>{t("Cook Protocol is a completely decentralized cross-chain asset management platform built for investors and professional asset managers to unlock an entirely new universe of DeFi innovations")}.</DescText>
          </div>
          <div style={{ marginBottom: '40px' }}>
            <StyledLink target="_blank" href="https://twitter.com/cook_finance">
              <img src={twitter} />
            </StyledLink>
            <StyledLink target="_blank" href="https://github.com/CookFinance">
              <img src={github} />
            </StyledLink>
            <StyledLink target="_blank" href="https://t.me/cook_english">
              <img src={telegram} />
            </StyledLink>
          </div>
        </StyledDiv>
      </div>

      <Container style={{ padding: 0 }}>
        <Row style={{ marginRight: 15 }}>
          <MainButton
            title={t("Distribution")}
            description={t("Manage Cook balance for early investors")}
            icon={distributionPNG}
            hover={distributionHover}
            onClick={() => {
              history.push('/distribution/');
            }}
          />
          <MainButton
            title={t("Liquidity Mining")}
            description={t("Stake Cook-WETH, get cook token")}
            icon={lpMiningPNG}
            hover={lpMiningHover}
            onClick={() => {
              history.push('/pools/');
            }}
          />
          <MainButton
            title={t("Cook Mining")}
            description={t("Stake Cook token, get Cook token")}
            icon={cookMiningPNG}
            hover={cookMiningHover}
            onClick={() => {
              history.push('/cookpools/');
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
  hover: any,
  onClick: Function,
  tag?: string
}

function MainButton({
  title, description, icon, hover, onClick, tag,
}: MainButtonPropx) {

  const StyledBox = styled(Box)`
    z-index:0;
    background: transparent;
    border: 1px solid transparent;
    
    :before {
      content:"";
      position:absolute;
      z-index:-1;
      top:0;
      left:0;
      right:0;
      bottom:0;
      padding: 1px;
      border-radius: 12px;
      background: linear-gradient(90deg, #E611FF -6.85%, #03ABF9 109.03%);
      -webkit-mask: 
        linear-gradient(#fff 0 0) content-box, 
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: destination-out;
      mask-composite: exclude;
    }

    .icon {
      margin-top: 15px;
      padding: 10px;
      height: 222px;
      background-image: url(${icon});
      background-repeat: no-repeat;
      background-position: center;
    }
    :hover {
      transform: scale(1.1);
    }
    :hover .icon {      
      background-image: url(${hover});
      background-repeat: no-repeat;
    }

    div[class^="Box___StyledDiv2"] {
      padding: 22px 22px 0 22px;      
    }
  }`


  return (
    <Col xs={12} md={4}>
      <LinkBase onClick={onClick}
        style={{
          width: "100%", margin: 15
        }}>
        <StyledBox className="box">
          <div style={{ padding: 5, fontSize: 18 }}>
            <StyledTitle>{title}</StyledTitle>
            {tag ? <Tag>{tag}</Tag> : <></>}
          </div>
          <div style={{ paddingTop: 5, whiteSpace: 'normal' }}>
            <StyledDescText>{description}</StyledDescText>
          </div>
          <div className="icon" />
        </StyledBox>
      </LinkBase>
    </Col>
  );
}

export default HomePage;
