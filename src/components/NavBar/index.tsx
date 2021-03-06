import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Bar, LinkBase, SidePanel, useViewport } from '@aragon/ui';
import ConnectButton from './ConnectButton';
import styled from 'styled-components';
import logo from '../../assets/logo.svg'
import colors from '../../constants/colors';
import LanguageSelector from '../../components/common/LanguageSelector';
import { useTranslation } from "react-i18next" ;
type NavbarProps = {
  theme: string,
  updateTheme: Function,
  user: string,
  setUser: Function
}

function NavBar({
  user, setUser,
}: NavbarProps) {
  const history = useHistory();
  const { t } = useTranslation()
  const [isHome, updateIsHome] = useState(true);
  const [opened, setOpened] = useState(false)
  const [page, setPage] = useState("");
  const { below, above } = useViewport()
  useEffect(() => {
    const home = history.location.pathname === '/';
    updateIsHome(home);
    return history.listen((location) => {
      setPage(location.pathname)
      const home = history.location.pathname === '/';
      updateIsHome(home);
    })
  }, [user, history]);

  return (
    <>
      <StyledSidePanel title={
        <LinkBase onClick={() => {
          history.push('/')
        }}>
          <img src={logo} style={{ width: '93px', height: '28px' }} />
        </LinkBase>
      } onClose={() => { setOpened(false) }} opened={opened}>

        <LinkButtonMobile
          title={t("Distribution")}
          onClick={() => {
            setOpened(false)
            history.push('/distribution/');
          }}
          isSelected={page.includes('/distribution')}
        />
        <LinkButtonMobile
          title={t("Liquidity Mining")}
          onClick={() => {
            setOpened(false)
            history.push('/pools/');
          }}
          isSelected={page.includes('/pools')}
        />
        <LinkButtonMobile
          title={t("Cook Mining")}
          onClick={() => {
            setOpened(false)
            history.push('/cookpools/');
          }}
          isSelected={page.includes('/cookpools')}
        />
        <LinkButtonMobile
          title="Admin (TESTING ONLY)"
          onClick={() => {
            setOpened(false)
            history.push('/admin/');
          }}
          isSelected={page.includes('/admin')}
        />
        <LanguageSelector />
        <ConnectButton mobile={true} user={user} setUser={setUser} />
      </StyledSidePanel>
      {below('medium') && (<StyledBar primary={(
        <LinkBase onClick={() => {
          history.push('/')
        }}>
          <img src={logo} style={{ width: '93px', height: '28px' }} />
        </LinkBase>
      )}
        secondary={(
          <span style={{ fontSize: 24 }}>
            <i className="fas fa-bars" onClick={() => setOpened(true)} />
          </span>
        )} />)}
      {above('medium') && (<StyledBar
        primary={
          (
            <>

              <LinkBase onClick={() => {
                history.push('/')
              }} style={{ height: '50%' }}>
                <img src={logo} style={{ width: '93px', height: '28px' }} />
              </LinkBase>

            </>
          )
        }
        secondary={(
          <>
            <LinkButton
              title={t("Distribution")}
              onClick={() => {
                history.push('/distribution/');
              }}
              isSelected={page.includes('/distribution')}
            />
            <LinkButton
              title={t("Liquidity Mining")}
              onClick={() => {
                history.push('/pools/');
              }}
              isSelected={page.includes('/pools')}
            />
            <LinkButton
              title={t("Cook Mining")}
              onClick={() => {
                history.push('/cookpools/');
              }}
              isSelected={page.includes('/cookpools')}
            />
            <LinkButton
              title="Admin (TESTING ONLY)"
              onClick={() => {
                history.push('/admin/');
              }}
              isSelected={page.includes('/admin')}
            />
            <div style={{ paddingLeft: 32 }}>
              <LanguageSelector />
            </div>
            <ConnectButton user={user} setUser={setUser} />

          </>
        )}
      />)}

    </>
  );
}

const StyledBar = styled(Bar)`
  background: none;
  border: none;
  margin-top: 5px;
  margin-left: 0px;
  margin-right: 0px;
`

const StyledSidePanel = styled(SidePanel)`
  header {
    margin: '20px 0px';
  }
  background: white;
  svg {
    color: white;
  }
`



type linkButtonProps = {
  title: string,
  onClick: Function,
  isSelected?: boolean
}

const StyledDiv = styled.div`
  font-size: 15px;
  font-weight: 300;
  line-height: 18px;
  letter-spacing: 0.03em;

  :hover {
    background: ${colors.linear};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`
function LinkButton({ title, onClick, isSelected = false }: linkButtonProps) {
  return (
    <div style={{ paddingLeft: 32 }}>
      <LinkBase onClick={onClick}>
        <StyledDiv>{title}</StyledDiv>
      </LinkBase>
    </div>
  );
}

function LinkButtonMobile({ title, onClick, isSelected = false }: linkButtonProps) {
  return (
    <div style={{ margin: '20px 0px' }}>
      <LinkBase onClick={onClick}>
        <StyledDiv>{title}</StyledDiv>
      </LinkBase>
    </div>
  );
}

export default NavBar;
