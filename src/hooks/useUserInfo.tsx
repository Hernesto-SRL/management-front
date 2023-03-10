import {useQuery} from "react-query";
import Axios from "axios";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query/types/core/types";

export enum UserRole {
    User = 1 << 0,
    Admin = 1 << 1
}

export interface User {
    name: string;
    lastName: string;
    roles: UserRole;
}

export interface UserQuery {
    user: User | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: <TPageData>(options?: RefetchOptions & RefetchQueryFilters<TPageData>) => Promise<QueryObserverResult<User>>;
}

const useUserInfo = (): UserQuery => {
    let { data: user, isLoading, isError, refetch } = useQuery<User>("userInfo", () => {
        return Axios.get("/api//User/UserInfo").then(res => res.data).catch(console.error);
    }, {
        staleTime: Infinity, // TODO this shouldn't be infinite, will need to refetch when user permissions are edited
        retry: false
    });

    if (isError)
        user = undefined;

    return { user, isLoading, isError, refetch };
};

export default useUserInfo;