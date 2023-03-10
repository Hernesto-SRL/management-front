import React, {MutableRefObject, useEffect, useRef} from "react";

const useOutsideAlert = (ref: MutableRefObject<any>, handler: () => void) => {

    useEffect(() => {
        const handleClickOutside = (e: Event) => {
            if (ref.current && !ref.current.contains(e.target))
                handler();
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref, handler]);
};

export interface OutsideClickHandlerProps {
    children: React.ReactNode;
    handleClick: () => void;
}

export const OutsideClickHandler = ({ children, handleClick }: OutsideClickHandlerProps) => {
    const wrapperRef = useRef(null) ;
    useOutsideAlert(wrapperRef, handleClick);
    return <div ref={wrapperRef}>{children}</div>;
};