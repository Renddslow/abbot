import styled, { createGlobalStyle } from 'styled-components';
import { createPortal } from 'react-dom';
import React, {SyntheticEvent, useEffect} from 'react';
import FocusTrap from 'focus-trap-react';
import Spinner from '@atlaskit/spinner';

type ActionRowParams = {
  Action: React.ElementType;
  Link: React.ElementType;
};

type Props = {
  children: JSX.Element;
  forwardedRef?: React.Ref<HTMLDivElement>;
  loading: boolean;
  title: string;
  renderActionRow?: (components: ActionRowParams) => JSX.Element;
  renderAside: () => JSX.Element;
  renderMetaRow: () => JSX.Element;
  renderTray?: () => ((props: any) => JSX.Element) | JSX.Element | boolean;
  onExit: (e: KeyboardEvent | SyntheticEvent) => void;
};

const Overlay = styled.div`
  position: fixed;
  height: 100vh;
  top: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  background: #000a;
  z-index: 1000;
  -webkit-overflow-scrolling: touch;
  cursor: pointer;
  align-items: center;
  justify-content: center;
`;

const ModalCard = styled.div.attrs({
  role: 'dialog'
})`
  cursor: default;
  max-width: 95%;
  padding: 20px;
  box-sizing: border-box;
  background: #fff;
  border-radius: 8px;
  width: 640px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`;

const Header = styled.header`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, max-content);
  align-items: center;
  margin-bottom: 12px;
`;

const Exit = styled.button`
  appearance: none;
  width: 20px;
  height: 20px;
  position: relative;
  background: transparent;
  border: 0;
  cursor: pointer;
  
  &::before,
  &::after {
    content: "";
    display: block;
    background: #000;
    width: 100%;
    height: 3px;
    border-radius: 4px;
    position: absolute;
    top: 9px;
  }
  
  &::before {
    transform: rotate(45deg);
  }
  
  &::after {
    transform: rotate(-45deg);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  width: 100%;
  grid-gap: 12px;
  
  @media screen and (max-width: 768px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const Aside = styled.aside`
  width: 100%;
  border-left: 1px solid #ccc;
  padding-left: 12px;
  box-sizing: border-box;
    
  @media screen and (max-width:768px) {
    border-left: 0;
    border-top: 1px solid #ccc;
    padding-top: 12px;
    padding-left: 0;
  }
`;

const Action = styled.button`
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid #aaa;
  box-sizing: border-box;
  display: block;
  width: max-content;
  text-decoration: none;
  color: #000;
  cursor: pointer;
  background: #fff;
  appearance: none;
  font-size: 1em;
`;

const CardSubHeader = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  grid-gap: 8px;
`;

const CardSection = styled.section`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  grid-gap: 24px;
  padding-bottom: 12px;
`;

const Link = styled(Action).attrs({
  as: 'a',
})``;

const Blur = createGlobalStyle`
  #root {
    filter: blur(10px);
  }
  
  body {
    overflow-y: hidden;
  }
`;

const Modal = (props: Props) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) return props.onExit(e);
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [props])

  return createPortal(
    <Overlay>
      <Blur />
      <FocusTrap>
        <ModalCard ref={props.forwardedRef} aria-labelledby="modal-title">
          <Header>
            <h1 id="modal-title">{props.title}</h1>
            <Exit onClick={props.onExit} />
          </Header>
          {
            props.loading ?
              <Spinner size="xlarge" /> :
              <>
                <Grid>
                  <CardSection>
                    <CardSubHeader>
                      {props.renderMetaRow()}
                      {props.renderActionRow && props.renderActionRow({
                        Action,
                        Link,
                      })}
                    </CardSubHeader>
                    {props.children}
                  </CardSection>
                  <Aside>{props.renderAside()}</Aside>
                </Grid>
                {props.renderTray && props.renderTray()}
              </>
          }
        </ModalCard>
      </FocusTrap>
    </Overlay>,
    document.body);
};

const ForwardedModal = React.forwardRef((props: Props, ref?: React.Ref<HTMLDivElement>) => <Modal {...props} forwardedRef={ref} />)

export default ForwardedModal;
