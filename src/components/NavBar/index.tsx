import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Bar, LinkBase, SidePanel, useViewport } from '@aragon/ui';
import ConnectButton from './ConnectButton';

type NavbarProps = {
  theme:string,
  updateTheme: Function,
  user: string,
  setUser: Function
}

function NavBar({
  theme, updateTheme, user, setUser,
}:NavbarProps) {
  const history = useHistory();
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
    <SidePanel title={"Menu"} onClose={()=>{setOpened(false)}} opened={opened}>
      <LinkButton
        title="Home"
        onClick={() => {
          history.push('/');
        }}
        isSelected={page==='/'}
      />
      <LinkButton
        title="Distribution"
        onClick={() => {
          setOpened(false)
          history.push('/distribution/');
        }}
        isSelected={page.includes('/distribution')}
      />
      <LinkButton
        title="Pools"
        onClick={() => {
          setOpened(false)
          history.push('/pools/');
        }}
        isSelected={page.includes('/pools')}
      />
      <LinkButton
        title="Admin (TESTING ONLY)"
        onClick={() => {
          setOpened(false)
          history.push('/admin/');
        }}
        isSelected={page.includes('/admin')}
      />
      <ConnectButton user={user} setUser={setUser} />
    </SidePanel>
    {below('medium') && (<Bar secondary={(
        <span style={{ fontSize: 24 }}>
        <i className="fas fa-bars" onClick={() => setOpened(true)}/>
        </span>
    )}/>)}
    {above('medium') && (<Bar
      primary={
        (
          <>

            <LinkBase onClick={ ()=>{
               history.push('/')
            }} style={{height:'50%'}}>
              <img src='https://www.cook.finance/wp-content/uploads/2020/12/Cook_logo-main-new.svg' style={{height:'100%'}} />
            </LinkBase>
            
            <LinkButton
              title="Home"
              onClick={() => {
                history.push('/');
              }}
              isSelected={page==='/'}
            />
            <LinkButton
              title="Distribution"
              onClick={() => {
                history.push('/distribution/');
              }}
              isSelected={page.includes('/distribution')}
            />
            <LinkButton
              title="Pools"
              onClick={() => {
                history.push('/pools/');
              }}
              isSelected={page.includes('/pools')}
            />
            <LinkButton
              title="Admin (TESTING ONLY)"
              onClick={() => {
                history.push('/admin/');
              }}
              isSelected={page.includes('/admin')}
            />
          </>
        )
      }
      secondary={(
        <>
          <ConnectButton user={user} setUser={setUser} />

        </>
      )}
    />)}

    </>
  );
}


type linkButtonProps = {
  title:string,
  onClick: Function,
  isSelected?:boolean
}

function LinkButton({ title, onClick, isSelected = false }:linkButtonProps) {
  return (
    <div style={{ paddingLeft: 40 }}>
      <LinkBase onClick={onClick}>
        <div style={{ padding: '1%', opacity: isSelected ? 1 : 0.5, fontSize: 20, lineHeight:3 }}>{title}</div>
      </LinkBase>
    </div>
  );
}

export default NavBar;
