import styled from "styled-components";

const InstructionsContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  font-family: Arial, sans-serif;
  z-index: 1000;
  opacity: 0.3;
`;

const Title = styled.h3`
  margin: 0 0 10px 0;
  font-size: 16px;
`;

const InstructionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const Instruction = styled.li`
  margin: 5px 0;
  font-size: 14px;
`;

const Key = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  margin: 0 4px;
`;

export default function ControlsInstructions() {
  return (
    <InstructionsContainer>
      <Title>Controls</Title>
      <InstructionList>
        <Instruction>
          Forward: <Key>W</Key> or <Key>↑</Key>
        </Instruction>
        <Instruction>
          Backward: <Key>S</Key> or <Key>↓</Key>
        </Instruction>
        <Instruction>
          Right: <Key>D</Key> or <Key>→</Key>
        </Instruction>
        <Instruction>
          Left: <Key>A</Key> or <Key>←</Key>
        </Instruction>
        <Instruction>
          Jump: <Key>Space</Key>
        </Instruction>
      </InstructionList>
    </InstructionsContainer>
  );
} 