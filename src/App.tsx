import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import axios from 'axios'

//Общие страницы
import SignIn from "./pages/Authentication/SignIn";
import Relogin from "./pages/Authentication/Relogin";
import ChangePassword from './pages/Authentication/ChangePassword.tsx'
import Loader from "./common/Loader";
import routes from "./routes";
import {setAppToken, getToken, StoredToken, isExpired, testToken, openForm, closeForm, getResources} from "./utils/gridUtils.tsx"
import {variables} from "./variables.tsx";


const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

const notOpenForms = new Set(['/', '/auth/signin', '/auth/change-password', '/auth/relogin'])

function App() {
  const navigate = useNavigate();
  let location = useLocation();
  const useAuth = false;

  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState(getToken());
  const [allowedUrls, setAllowedUrls] = useState(new Set())
  const [update, setUpdate] = useState(true);
  const [currentPage, setPage] = useState(null);
  const [resources, setResources] = useState([]);

  const getNewToken = (t: StoredToken | null) => {
      setAppToken(t, setToken)
      setUpdate(true)
  }

  const getTokenFromRefresh = (t: StoredToken) => {
      setAppToken(t, setToken)
  }

  const getRefreshToken = async() => {
    setLoading(true)
    try {
      const result = await axios.get(
        variables.API_URL + `/Api/Authication/refresh`,
        {
          headers: {
            Authorization: `Token ${token.token}`,
          },
        }
      );
      if (result.status !== 200) throw Error('Ошибка на получение токена');
      token.token = result.data
      getTokenFromRefresh(token)
    } catch (e) {
      getNewToken(null)
    }
    setLoading(false)
  }

  const callRefreshToken = async() => {
      await getRefreshToken()
  }

  const getAllowedUrls = async() => {
      setLoading(true)
      if (useAuth) {
          await getAllowedTrees()
      } else {
          setTimeout(() => setAllowedUrls(new Set(routes.map(route => route.path))), 1000)
      }
      setLoading(false)
  }

  const getAllowedTrees = async() => {
    setLoading(true)
    try {
      const result = await axios.get(
        variables.API_URL + `/Api/Authication/get_tree`,
        {
          headers: {
            Authorization: `Token ${token.token}`,
          },
        }
      );
      if (result.status !== 200) throw Error('Не удалось получить иерархию');
      if (result.data.data.length === 0)
          setAllowedUrls(new Set(['/']))
      else {
          result.data.data[0].RunObjectNote = '/'
          setAllowedUrls(new Set(result.data.data.filter(route => route.RunObjectNote !== null).map(route => route.RunObjectNote)))
      }
    } catch (e) {
      getNewToken(null)
    }
    setLoading(false)
  }

  const getCheckActiveToken = async () => {
      if (token === null) return -1;
      try {
      const access_token = 'Token ' + token.token
      const result = await axios.get(
        variables.API_URL + `/Api/Authication/check_token`,
        {
          headers: {
            Authorization: access_token,
          },
        }
      );
      if (result.status !== 200)
          return -1;
      return result.data.status
    } catch (e) {
      return -1
    }
  }

  const checkActiveToken = async () => {
      console.log(token)
      switch (await getCheckActiveToken()) {
          case -1:
              console.log('token is null');
              break;
          case 0:
              console.log('token is not expire');
              await callRefreshToken();
              break;
          case 1:
              console.log('token is expire');
              setTimeout(() => {
                return checkActiveToken();
              }, 10000);
              break;
      }
  }

  useEffect(() => {
    if(useAuth) {
        if (token === null)
            return;
        checkActiveToken()
    }
  }, [token]);

  useEffect(() => {
      if (useAuth) {
          console.log('check token', token);
          if (token === null)
              navigate("/auth/signin");
          else if (update)
              getAllowedUrls()
          setUpdate(false)
          console.log('end check token')
      } else {
          getAllowedUrls()
          setUpdate(false)
      }
  }, [token]);

  const openNewForm = async() => {
      setLoading(true)
      const url_path = location.pathname
      console.log(url_path, currentPage)
      if (useAuth) {
          if (!notOpenForms.has(url_path)) {
              try {
                  if (currentPage) {
                      await closeForm(currentPage, token.token)
                  }
                  setPage(await openForm(url_path, token.token))
                  setResources(await getResources(url_path, token.token))
              } catch (e) {
                  getNewToken(null)
              }
          }
      } else {
          console.log(url_path)
      }
      setLoading(false)
  }

  useEffect(() => {
    // Google Analytics
    openNewForm()
  }, [location]);

  const LogOut = async(result) => {
    setLoading(true);
    try {
      const result = await axios.get(
        variables.API_URL + `/Api/Authication/logout`,
          {
              headers: {
                Authorization: `Token ${token.token}`,
              },
          }
      );
      if (result.status !== 200) throw Error('Ошибка при выходе');
      getNewToken(null)
    } catch (e) {
      alert(e.message)
      navigate("/auth/signin");
    }
    setLoading(false);
  }


  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />
      <Routes>
        <Route path="/auth/signin" element={<SignIn setToken={getNewToken}/>} />
        <Route path="/auth/change-password" element={<ChangePassword token={token}/>} />
        <Route path="/auth/relogin" element={<Relogin token={token} setToken={getNewToken}/>} />
        <Route element={<DefaultLayout token={token} allowedUrls={allowedUrls} setToken={LogOut}/>}>
          {routes.map((routes, index) => {
            const { path, component: Component } = routes;
            if (allowedUrls.has(path))
                return (
                  <Route
                    key={index}
                    path={path}
                    element={
                      <Suspense fallback={<Loader />}>
                        <Component token={token? token.token : null} personlog_id={useAuth? currentPage : 7924491} resources={resources}/>
                      </Suspense>
                    }
                  />
                );
          })}
        </Route>
      </Routes>
    </>
  );
}

export default App;
