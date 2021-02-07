import React from 'react';
import styled from 'styled-components';
import { NavLink as Link } from 'react-router-dom';

const Navigation = styled.nav`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, max-content));
  grid-gap: 50px;
  height: 48px;
  position: relative;
  align-items: center;
  color: white;
  -webkit-font-smoothing: antialiased;
  padding-left: 8px;
  padding-right: 16px;
  z-index: 900;
`;

const Header = styled.header`
  background: #E86AEB;
`;

const Logo = styled.div`
  display: flex;
`;

const LogoContainer = styled.div`
  grid-template-columns: repeat(2, minmax(0, max-content));
  display: grid;
  grid-gap: 8px;
  cursor: pointer;
  background-color: transparent;
  border: none;
  padding: 0 16px;
  appearance: none;
  outline: 0;
  font-family: inherit;
  white-space: nowrap;
  height: 100%;
  align-items: center;
  transition: background-color 120ms ease-in 0s;
`;

const NavButton = styled(Link)`
  line-height: 32px;
  margin-right: 4px;
  vertical-align: middle;
  border-radius: 9999px;
  font-size: 14px;
  color: white;
  font-weight: 600;
  text-decoration: none;
  text-transform: capitalize;
  background: transparent;
  font-family: inherit;
  transition: background 120ms ease-in 0s;
  padding: 8px 12px;
  
  &:hover, &:focus {
    background: #A845d6;
    outline: none;
  }
  
  &.active {
    background: #A845d6;
  }
`;

const HeaderComponent = () => (
  <Header>
    <Navigation>
      <LogoContainer>
        <Logo>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" role="img" aria-labelledby="title desc"><title id="title">Planning Center Groups App Icon</title><desc id="desc">An image symbolizing the Planning Center Groups app.</desc><path fill="#fff" d="M10.008.045C2.047.045.056,2.036.056,10s1.991,9.952,9.952,9.952S19.96,17.959,19.96,10,17.969.045,10.008.045Z" /><path fill="#e04ae7" d="M13.769,11.313V8.683a1.867,1.867,0,1,0-2.443-2.449H8.69A1.867,1.867,0,1,0,6.243,8.681v2.632A1.867,1.867,0,1,0,8.69,13.76h2.632a1.867,1.867,0,1,0,2.447-2.447Zm-1.455,0a1.873,1.873,0,0,0-.992.992H8.69a1.877,1.877,0,0,0-.992-.992V8.681a1.877,1.877,0,0,0,.992-.992h2.636a1.872,1.872,0,0,0,.988.99Z" /></svg>
        </Logo>
        <h1>relationships</h1>
      </LogoContainer>
      <div>
        <NavButton activeClassName="active" to="/requests">Requests</NavButton>
        <NavButton activeClassName="active" to="/relationships">Relationships</NavButton>
        <NavButton activeClassName="active" to="/people">People</NavButton>
      </div>
    </Navigation>
  </Header>
);

export default HeaderComponent;
