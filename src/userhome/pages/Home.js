
import './Home.css'
import Homepage from '../components/Homepage'
import { useSelector } from 'react-redux'
import { selectCurrentUser, selectCurrentToken } from '../../features/authenticate/authSlice'
import { Link } from 'react-router-dom'
import { useContext } from "react";
import { color } from "../../App";
import LoopingRhombusesSpinner from '../loadingDesign/loading'

const Home = () => {
  const { colorlist,imgList } = useContext(color);

  return (
    <>
    {imgList ? (<div>
      <Homepage/>
      <div className='hcard' style={{backgroundImage: `url(${new URL(imgList[0].File)})`}}>
      <div className="grad">
      <h2 className="text-title">FINANCIAL ASSISTANCE FOR ISKOLAR NG BAYAN NG MARILAO</h2>
      <p className="text-box">
      </p>
      </div>
      </div>
    </div>) : (
      <>
      <div style={{width:'100vw',height:'100vh'}}>
        <LoopingRhombusesSpinner/>
      </div>
    </>
    )}
    </>
    )
}

export default Home
