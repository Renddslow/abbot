import styled from 'styled-components';
import { NavLink } from 'react-router-dom';

import Icon from '../Icon';

const Header = styled.header`
  height: 100%;
  display: block;
  position: relative;
  background: #462d5f;
  padding: 0 12px;
`;

const Nav = styled.nav`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  margin-top: 140px;
  grid-gap: 32px;
`;

const Tooltip = styled.span`
  position: absolute;
  width: max-content;
  font-size: 12px;
  background: #000;
  border-radius: 4px;
  padding: 4px;
  color: #fff;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.1s ease-in, left 0.1s ease-in;
  top: 4px;
  left: 30px;
`;

const NavLinkStyled = styled(NavLink)`
  position: relative;

  &.active .material-icons {
    color: #fff;
  }

  &:hover ~ ${Tooltip} {
    opacity: 1;
    left: 46px;
  }
`;

const NavLinkContainer = styled.div`
  position: relative;
`;

const Navigation = () => (
  <Header>
    <Nav>
      <NavLinkContainer>
        <NavLinkStyled activeClassName="active" to="/relationships">
          <Icon>supervisor_account</Icon>
        </NavLinkStyled>
        <Tooltip>Relationships</Tooltip>
      </NavLinkContainer>
      <NavLinkContainer>
        <NavLinkStyled activeClassName="active" to="/people">
          <Icon>groups</Icon>
        </NavLinkStyled>
        <Tooltip>People</Tooltip>
      </NavLinkContainer>
      <NavLinkContainer>
        <NavLinkStyled activeClassName="active" to="/reports">
          <Icon>assessment</Icon>
        </NavLinkStyled>
        <Tooltip>Reports</Tooltip>
      </NavLinkContainer>
      <NavLinkContainer>
        <NavLinkStyled activeClassName="active" to="/admin">
          <Icon>admin_panel_settings</Icon>
        </NavLinkStyled>
        <Tooltip>Admin</Tooltip>
      </NavLinkContainer>
    </Nav>
  </Header>
);

export default Navigation;
