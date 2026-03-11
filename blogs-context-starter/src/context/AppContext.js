import { createContext, useCallback, useMemo, useState } from "react";
import { baseUrl } from "../baseUrl";

export const AppContext = createContext();

export default function AppContextProvider({children}) {
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);
    const [error, setError] = useState(null);

    const fetchBlogPosts = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);
        let url = `${baseUrl}?page=${page}`;
        try {
            const result = await fetch(url);
            const data = await result.json();
            setPage(data.page);
            setPosts(data.posts);
            setTotalPages(data.totalPages);
        } catch (err) {
            setError("Failed to fetch blog posts. Please try again.");
            setPage(1);
            setPosts([]);
            setTotalPages(null);
        }
        setLoading(false);
    }, []);

    const handlePageChange = useCallback((page) => {
        setPage(page);
        fetchBlogPosts(page);
    }, [fetchBlogPosts]);

    const value = useMemo(() => ({
        posts,
        loading,
        page,
        totalPages,
        error,
        fetchBlogPosts,
        handlePageChange
    }), [posts, loading, page, totalPages, error, fetchBlogPosts, handlePageChange]);

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>;
}