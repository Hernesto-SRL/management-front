import {useMediaQuery} from "@mui/material";

const useIsMobile = () => {
    return !useMediaQuery("(min-width:800px)");
};

export default useIsMobile;