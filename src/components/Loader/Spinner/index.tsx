import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { waitSeconds } from "utils";
import styled from "styled-components";

const DOT_SIZE = 12;
const DOT_SPACE = 11;

const Wrapper = styled.div`
  margin: 16px 0;
  text-align: center;
`;

const ContentWrapper = styled.div`
  height: 23px;
  display: inline-flex;
  width: 81px;
  align-items: flex-end;
  justify-content: center;
  background: linear-gradient(90deg, #e611ff -6.85%, #03abf9 109.03%);
  clip-path: url(#spin-clip);
  & > * + * {
    margin-left: ${DOT_SPACE}px;
  }
`;

interface IProps {
  dotCount?: number;
}

interface IState {
  activeIndex: number;
  value: number;
}

export const Spinner = (props: IProps) => {
  const [state, setState] = useState<IState>({ activeIndex: 0, value: 0 });
  const { dotCount = 4 } = props;

  useEffect(() => {
    let isMounted = true;

    const asyncUpdate = async () => {
      while (isMounted) {
        await waitSeconds(0.1);
        if (isMounted)
          setState((prev) => ({
            ...prev,
            value: 0.5,
          }));
        await waitSeconds(0.1);
        if (isMounted)
          setState((prev) => ({
            ...prev,
            value: 1,
          }));
        await waitSeconds(0.1);
        if (isMounted)
          setState((prev) => ({
            ...prev,
            value: 0.5,
          }));
        await waitSeconds(0.1);
        if (isMounted)
          setState((prev) => ({
            ...prev,
            activeIndex: (prev.activeIndex + 1) % dotCount,
            value: 0,
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
      <ContentWrapper></ContentWrapper>
      <svg width="0" height="0">
        <defs>
          <clipPath id="spin-clip">
            {new Array(dotCount).fill(0).map((value, index) => (
              <circle
                cx={DOT_SPACE * index + DOT_SIZE * index + DOT_SIZE / 2}
                cy={
                  index === state.activeIndex
                    ? DOT_SIZE / 2 + DOT_SPACE * (1 - state.value)
                    : DOT_SIZE / 2 + DOT_SPACE
                }
                key={index}
                r={DOT_SIZE / 2}
              />
            ))}
          </clipPath>
        </defs>
      </svg>
    </Wrapper>
  );
};
