import styled from 'styled-components';

type Props = {
  children: any;
};

const Img = styled.img`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  left: 0;
  object-fit: cover;
`;

const AvatarStyled = styled.div<{ background?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ background }) => background && `#c6c1c5`};
  cursor: ${({ background }) => (background ? 'inherit' : 'pointer')};
  user-select: none;
`;

const Tooltip = styled.div`
  position: absolute;
  width: max-content;
  right: -36px;
  font-size: 12px;
  background: #000;
  border-radius: 4px;
  padding: 4px;
  color: #fff;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.1s ease-in, bottom 0.1s ease-in;
  bottom: -18px;
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 36px;
  height: 36px;
  margin: 0 auto;

  &:hover ${Tooltip} {
    opacity: 1;
    bottom: -24px;
  }
`;

const Avatar = ({ children }: Props) => {
  const { firstName, lastName, avatar } = children || {};

  return children ? (
    <AvatarContainer>
      <AvatarStyled>
        <Img src={avatar} />
      </AvatarStyled>
      <Tooltip>
        {firstName} {lastName}
      </Tooltip>
    </AvatarContainer>
  ) : (
    <AvatarContainer>
      <AvatarStyled background>?</AvatarStyled>
    </AvatarContainer>
  );
};

export default Avatar;
