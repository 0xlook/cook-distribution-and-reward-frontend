import React, { useRef, useEffect } from "react";
import styled from "styled-components";

function useOutsideAlerter(ref, setVisible) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setVisible(false)
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref,setVisible]);
}

export default function SignOutButtonWrapper(props) {
    const wrapperRef = useRef(null);
    const {visible, setVisible} = props

    useOutsideAlerter(wrapperRef, setVisible);
    return <StyledDiv style={{display: visible ? 'inherit':'none'}} ref={wrapperRef}>{props.children}</StyledDiv>;
}

const StyledDiv = styled.div`
  :hover {
    opacity: 0.4;
  }
`