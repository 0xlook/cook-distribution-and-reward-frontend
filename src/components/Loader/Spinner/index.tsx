import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { waitSeconds } from "utils";
import styled from "styled-components";

const DOT_SIZE = 12;
const DOT_SPACE = 11;

const Wrapper = styled.div`
  margin: 16px 0;
`;

const ContentWrapper = styled.div`
  height: 15px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  & > * + * {
    margin-left: ${DOT_SPACE}px;
  }
`;

const ItemWrapper = styled.div`
  width: ${DOT_SIZE}px;
  height: ${DOT_SIZE}px;
  background-color: white;
  border-radius: 50%;
  bottom: 0;
  position: relative;
  transition: all 0.7s;
  ${(props) =>
    props.active
      ? `
    opacity: 0.4;
    bottom: ${DOT_SPACE}px;`
      : ``}
`;

interface IProps {
  dotCount?: number;
}

interface IState {
  activeIndex: number;
}

export const Spinner = (props: IProps) => {
  const [state, setState] = useState<IState>({ activeIndex: 0 });
  const { dotCount = 4 } = props;

  useEffect(() => {
    let isMounted = true;

    const asyncUpdate = async () => {
      while (isMounted) {
        await waitSeconds(0.4);
        if (isMounted)
          setState((prev) => ({
            activeIndex: (prev.activeIndex + 1) % dotCount,
          }));
      }
    };

    asyncUpdate();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Wrapper>
      <ContentWrapper>
        {new Array(dotCount).fill(0).map((value, index) => {
          return (
            <ItemWrapper
              active={state.activeIndex === index}
              key={index}
            ></ItemWrapper>
          );
        })}
      </ContentWrapper>
    </Wrapper>
  );
};
