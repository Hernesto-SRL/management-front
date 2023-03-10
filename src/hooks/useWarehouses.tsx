import {useQuery} from "react-query";
import Axios from "axios";
import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query/types/core/types";

export interface Warehouse {
    id: number;
    name: string;
    address: string;
}

export interface WarehouseQuery {
    warehouses: Warehouse[] | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: <TPageData>(options?: RefetchOptions & RefetchQueryFilters<TPageData>) => Promise<QueryObserverResult<Warehouse[]>>;
}

const useWarehouses = (): WarehouseQuery => {
    let { data: warehouses, isLoading, isError, refetch } = useQuery<Warehouse[]>("warehouses", () => {
        return Axios.get("/api/Warehouse").then(res => res.data).catch(console.error);
    }, {
        staleTime: Infinity, // TODO
        retry: false
    });

    if (isError)
        warehouses = undefined;

    return { warehouses, isLoading, isError, refetch };
};

export default useWarehouses;