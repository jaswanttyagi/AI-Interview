import React, { useEffect } from 'react'
import axios from 'axios'
import { Routes, Route } from 'react-router-dom';
import { Home } from "./pages/Home"
import { Auth } from "./pages/Auth"
import { useDispatch } from "react-redux";
import { setuserData } from './redux/userSlice';
import InterviewPage from './pages/InterviewPage';
import InterviewReport from './pages/InterviewReport';
import InterviewHistory from './pages/InterviewHistory';
import Pricing from './pages/Pricing';



export const serverUrl = "http://localhost:4500"

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(serverUrl + "/api/user/current-user", { withCredentials: true })
        dispatch(setuserData(result.data));
      } catch (err) {
        console.log(err);
        // if any error come then we remove the data from the user
        dispatch(setuserData(null));
      }
    }

    getUser();
  }, [dispatch])

  return (
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/auth' element={<Auth />}></Route>
      {/* <Route path='/isAuth' element={<Auth />}></Route> */}
      <Route path='/interview' element={<InterviewPage />}></Route>
      <Route path = '/history' element = {<InterviewHistory/>}></Route>
      <Route path = '/pricing' element = {<Pricing/>}></Route>
      <Route path = '/report/:id' element = {<InterviewReport/>}></Route>
    </Routes>
  );
};
export default App;
