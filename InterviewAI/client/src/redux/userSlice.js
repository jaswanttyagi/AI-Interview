import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : "user",
    initialState:{
        userData:null
    },
    reducers :{ // reducer change the intial state 
        setuserData : ((state , action)=>{
            state.userData = action.payload
        })
    }
})

export const {setuserData} = userSlice.actions

export default userSlice.reducer