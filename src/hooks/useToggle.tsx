import {useState} from "react";

const useToggle = (value: boolean = false): [boolean, () => void] => {
    const [toggle, setToggle] = useState(value);
    const useToggle = () => setToggle(!toggle);
    return [toggle, useToggle];
};

export default useToggle;