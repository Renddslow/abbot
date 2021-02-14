import styled from 'styled-components';

export const TagRaw = styled.div<{ relationshipType: 'mentoring' | 'coaching' }>`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  box-sizing: border-box;
  color: #fff;
  background: ${props => props.relationshipType === 'mentoring' ? '#2d9d42' : '#f9ae05'};
  width: max-content;
  border-radius: 8px;
  margin-top: 8px;
`;

const upper = (p: string) => `${p[0].toUpperCase()}${p.slice(1)}`;

const Tag = ({ children }: { children: 'mentoring' | 'coaching' }) => (
  <TagRaw relationshipType={children}>{upper(children)}</TagRaw>
);

export default Tag;
