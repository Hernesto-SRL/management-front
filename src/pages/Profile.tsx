import {Box} from "@mui/material";
import Header from "../components/Header";
import useUserInfo from "../hooks/useUserInfo";

const Profile = () => {
    const { user } = useUserInfo();

    return (
        <Box>
            <Header title="PROFILE" center/>
            { user ?
                <div>
                <h1>{`${user.name} ${user.lastName}`}</h1>
                <h1>{`Roles: ${user.roles}`}</h1>
                </div>
                : <h1>UNKNOWN USER</h1>}
        </Box>
    );
};

export default Profile;