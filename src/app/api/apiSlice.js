import { createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../../features/authenticate/authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3006/api/v1',
    credentials: 'include',
    prepareHeaders: (headers, { getState}) => {
        const token = getState().auth.token
        if(token){
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    }
})

const baseQuerywithReauth = async (args, api, extraOptions) => {
    let result  = await baseQuery(args, api, extraOptions)

    if(result?.error?.originalStatus === 403){

        const refreshResult = await baseQuery('/', api, extraOptions)
  
        if(refreshResult?.data){
            const user = api.getState().auth.user
            //store the new token
            api.dispatch(setCredentials( {...refreshResult.data, user}))
            //retry original query with new access token
            result = await baseQuery(args, api, extraOptions)
        }else{
            api.dispatch(logOut())
        }
    }
    return result
}

export const apiSlice = createApi({
    baseQuery: baseQuerywithReauth,
    endpoints: builder => ({})
})