import { QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,            
            retry: false,
            staleTime: Infinity
        }
    }
})

export default queryClient