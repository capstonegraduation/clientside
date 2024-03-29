import { createBrowserRouter, RouterProvider} from 'react-router-dom';
import { Colorlist,WebImg,Logos } from './Api/request'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor} from './Redux/store';
import { useEffect } from 'react';
import { createContext } from 'react';
import { useState } from 'react';
import { RouteUrl } from './routes/routes';
import { Public,Private } from './layout';
import { Home,Login,Registration,ApplicationForm,ScholarshipProgram,
         Dashboard,Profile,Requirements,Appointment,Announcement,News,Trivia,Renewal,Payout } from '../src/Pages';
import './App.css'
import LoopingRhombusesSpinner from './userhome/loadingDesign/loading'


export const color = createContext();
function App() {
  const colorstore = JSON.parse(localStorage.getItem('Color'));
  const imgstore = JSON.parse(localStorage.getItem('Image'));
  const logostore = JSON.parse(localStorage.getItem('Logo'));
  const [colorlist, setColorcode] = useState(colorstore || null);
  const [imgList,setImglist] = useState(imgstore || null);
  const [logolist,setLogolist] = useState(logostore || null);
  const [loading, setLoading] = useState(false);
  const router = createBrowserRouter([
    {
      path: RouteUrl.HOME,
      element: <Public/>,
      children: [
        {
          path: RouteUrl.HOME,
          element: <Home />
        },
        {
          path: RouteUrl.LOGIN,
          element: <Login />
        },
        {
          path: RouteUrl.APPLICATION_FORM,
          element: <ApplicationForm/>
        },
        {
          path: RouteUrl.REGISTER,
          element: <Registration />
        },
        {
          path: RouteUrl.SCHOLARSHIP_PROGRAM,
          element: <ScholarshipProgram />
        }
      ]
    },
    {
      path: RouteUrl.HOME,
      element: <Private />,
      children: [
        {
          path: RouteUrl.DASHBOARD,
          element: <Dashboard />
        },
        {
          path: RouteUrl.PROFILE,
          element: <Profile />
        },
        {
          path: RouteUrl.SCHOLAR_REQUIREMENT,
          element: <Requirements />
        },
        {
          path: RouteUrl.SCHOLAR_APPOINTMENT,
          element: <Appointment />
        },
        {
          path: RouteUrl.NEWS,
          element: <News />
        },
        {
          path: RouteUrl.ANNOUNCEMENT,
          element: <Announcement />
        },
        {
          path: RouteUrl.TRIVIA,
          element: <Trivia />
        },
        {
          path: RouteUrl.RENEWAL_FORM,
          element: <Renewal />
        },
        {
          path: RouteUrl.PAYOUT,
          element: <Payout />
        },
      ]
    }
  ])

  // useEffect(() => {
  //   if (!isOnline) {
  //     navigate('/no-internet');
  //   }
  // }, [isOnline, navigate]);

  useEffect(() =>{
    async function Fetch(){
      try {
        setLoading(true);
        const res = await Colorlist.FETCH_COLOR();
        const img = await WebImg.FETCH_WEB();
        const req = await Logos.LOGOS()
        setImglist(img.data.result);
        setColorcode(res.data.result);
        setLogolist(req.data.result)
        setLoading(false);
        localStorage.setItem('Image', JSON.stringify(img.data.result));
        localStorage.setItem('Logo', JSON.stringify(req.data.result));
        localStorage.setItem('Color', JSON.stringify(res.data.result));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    Fetch()
  },[])

  

  if (loading) {
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <LoopingRhombusesSpinner />
      </div>
    );
  }

  return (
    <>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <color.Provider value={{ colorlist,imgList,logolist }}>
    <RouterProvider router={router} fallbackElement={<h6>Loading...</h6>} />
    </color.Provider>
    </PersistGate>
    </Provider>
      </>
  );
}

export default App;
