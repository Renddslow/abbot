import styled from 'styled-components';

const ResultsStyled = styled.div`
  display: grid;
  margin-top: 24px;
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  grid-gap: 4px;
`;

const ResultRow = styled.div`
  display: grid;
  grid-template-columns: minmax(0, max-content) minmax(0, 1fr);
  grid-gap: 4px;
  font-size: 12px;
  color: #000;
`;

const ResultKey = styled.span`
  font-weight: 700;
`;

// TODO: dedupe

const Results = ({ children }: { children: Array<{key: string; value: string}> }) => (
  <ResultsStyled>
    {children.map((r) => (
      <ResultRow key={r.key}>
        <ResultKey>{r.key}:</ResultKey>
        <span>{r.value}</span>
      </ResultRow>
    ))}
  </ResultsStyled>
);

export default Results;
