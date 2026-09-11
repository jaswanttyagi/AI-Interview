import React, { useState } from 'react'
import { motion } from "motion/react"
import { BsRobot , BsCoin } from 'react-icons/bs'
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { setuserData } from '../redux/userSlice';
import axios from 'axios';
import AuthModel from './AuthModel';

const Navbar = () => {
    // fetching user data from userSlice using useSelector hok
    const {userData} = useSelector((state)=>state.user);
    const [showCreditpopUp , setshowCreditpopUp] = useState(false);
    const [showUserpopUp , setshowUserpopUp] = useState(false);
    const [showAuth , setshowAuth] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogOut = async()=>{
        try{
            await axios.get(serverUrl + "/api/auth/logout" , {withCredentials:true})
            // when we logout then make the user data null so to get the userData get the data from the user slice
            dispatch(setuserData(null));  // setUserData came from store
            setshowCreditpopUp(false);
            setshowUserpopUp(false);
            setshowAuth(true);

        }catch(err){
            console.log(err)
        }
    }

  return (
    <div className='bg-[#f3f3f3] flex justify-center px-4 pt-6'>
        <motion.div
        initial={{opacity:0 , y:-40}}
        animate={{opacity:1 , y:0}}
        transition={{duration:0.4}}
        className='w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-8 py-4 flex justify-between items-center relative'>

            <div className='flex items-center gap-3 cursor-pointer'>
                <div className='bg-black text-white p-2 rounded-lg'>
                    <BsRobot size={18}/>

                </div>
                <h1 className='font-semibold hidden md:block'>InterviewIQ.AI</h1>
            </div>

            <div className='flex items-center gap-6 relative'>
                <div className='relative'>
                    <button onClick={()=>{
                        if(!userData){
                            setshowAuth(true);
                            return
                        }
                        setshowCreditpopUp(!showCreditpopUp);
                        setshowUserpopUp(false);
                    }} className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition'>
                        <BsCoin size={20}/>
                        {userData?.credits || 0}
                    </button>

                    {showCreditpopUp && (
                        <div className='absolute right-[-50px] mt-3 w-64 bg-white shadow-xl border-gray-200 rounded p-5 z-50'>

                            <p className='text-sm text-gray-600 mb-4'>Need More credits to continue the Interview ?</p>
                            <button onClick={()=>navigate("/pricing")} className='w-full bg-black text-white py-2 rounded-lg text-sm'>
                                Buy more credits
                            </button>

                        </div>
                    )}
                </div>

                 <div className='relative'>
                    <button
                    onClick={()=> {
                        if(!userData){
                            setshowAuth(true);
                            return
                        }
                        setshowUserpopUp(!showUserpopUp);
                        setshowCreditpopUp(false);
                    }}
                    className='w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold'>
                        {userData? userData?.name.slice(0,1).toUpperCase() : <FaUserAstronaut size={16}/>}
                       
                    </button>
                    {showUserpopUp && (
                        <div className='absolute right-0 mt-3 w-48 bg-white shadow-xl border border-gray-200 rounded-xl p-4'>
                            <p className='text-md text-blue-500 font-medium mb-1'>
                                {userData?.name}
                            </p>
                            {/* for interview hitsory */}
                            <button onClick={()=>navigate("/history")} className='w-full text-left text-sm py-2 hover:text-black text-gray-600'>InterView History</button>
                            {/* for logout */}
                            <button onClick={handleLogOut} className='w-full text-left text-md py-2 flex items-center gap-2 text-red-500'>
                                <HiOutlineLogout size={18}/>
                                Logout</button>

                        </div>
                    )}
                </div>

            </div>

        </motion.div>
        {showAuth && <AuthModel onClose={()=>setshowAuth(false)}/>}

    </div>
  )
}

export default Navbar
