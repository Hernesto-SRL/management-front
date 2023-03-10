import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from "react-query/types/core/types";
import {useQuery} from "react-query";
import Axios from "axios";

export interface Category {
    id: number;
    name: string;
}

export interface CategoriesQuery {
    categories: Category[] | undefined;
    isLoading: boolean;
    isError: boolean;
    refetch: <TPageData>(options?: RefetchOptions & RefetchQueryFilters<TPageData>) => Promise<QueryObserverResult<Category[]>>;
}

const useCategories = (): CategoriesQuery => {
    let { data: categories, isLoading, isError, refetch } = useQuery<Category[]>("categories", () => {
        return Axios.get("/api/Product/Categories").then(res => res.data).catch(console.error);
    }, {
        staleTime: Infinity,
        retry: false
    });

    if (isError)
        categories = undefined;

    return { categories, isLoading, isError, refetch };
};

export default useCategories;