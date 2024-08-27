import { Link } from "react-router-dom";
import LogoDark from "../../images/logo/logo-dark.svg";
import Logo from "../../images/logo/logo.svg";
import { SmartCaptcha } from '@yandex/smart-captcha';

import React, {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProcessNotification from "../../components/UI/General/Notifications/Process.tsx";
import ErrorNotification from "../../components/UI/General/Notifications/Error.tsx";
import {variables} from "../../variables.tsx";
import {getFiltersLists, testToken} from "../../utils/gridUtils.tsx";
import SelectCustom from "../../components/UI/General/Inputs/Select.tsx";

const Relogin = ({setToken, token}) => {
  const navigate = useNavigate();

  const [loading, setLoad] = useState(false);
  const [error, setError] = useState(null);
  const [workspaces, setWorkspaces] = useState([])
  const [tokenCaptcha, setTokenCaptcha] = useState('1');
  const [disable, setDisable] = useState(true);

  const [username, setUsername] = useState(token === null ? null : token.username)
  const [workspace, setWorkspace] = useState(token === null ? null : token.workspace)

  useEffect(() => {
    setLoad(true);
    getFiltersResults()
    setLoad(false);
  }, []);

  useEffect(() => {
    if(workspace === null || username === '' || !tokenCaptcha)
      setDisable(true)
    else
      setDisable(false)
  }, [username, workspace, tokenCaptcha]);

  const onSearchClick = async() => {
    if(!(workspace && username !== '' && tokenCaptcha))
      return

    setLoad(true);
    setError(null);
    try {
      const result = await axios.post(
        variables.API_URL + `/Api/Authication/relogin`,
        {
          username: username,
          workspace: workspace.value
        },
        {
          headers: {
            Authorization: `Token ${token.token}`,
          },
        }
      );
      if (result.status !== 200) throw Error('Данный логин и пароль не подходят');
      console.log(result.data)
      const token2 = result.data
      token2.username = username
      token2.workspace = workspace
      setToken(token2)
      navigate('/')
    } catch (e) {
      setError(e);
      setLoad(false);
    }
  }

  const getWorkspaces = async () => {
    setLoad(true);
    setError(null);
    try {
      const result = await axios.get(
        variables.API_URL + `/Api/Authication/all_workspaces`
      );
      if (result.status !== 200) throw Error(result);
      setLoad(false);
      return result.data.data
    } catch (e) {
      console.log(e);
      setLoad(false);
      setError(e);
      return [];
    }
  }

  const getFiltersResults = async () => {
    const data = await getWorkspaces()
    setWorkspaces(data.map(el => ({value: el.ID_WORKSPACE, name: el.FULLWORKSPACENAME})))
  }

  return (
    <>
      <ProcessNotification
        isOpen={loading}
        closeModal={() => setLoad(!loading)}
      />
      <ErrorNotification
        isOpen={error !== null}
        closeModal={() => setError(null)}
        error={error === null ? null : error}
      />
      <div className="flex h-screen">
        <div className="flex bg-primary justify-center items-center w-full basis-1/2">
          <div className="text-center">
            <Link className="mb-5.5 inline-block" to="/">
              <img className="hidden dark:block" src={Logo} alt="Logo" />
              <img className="dark:hidden" src={LogoDark} alt="Logo" />
            </Link>
            <p className="2xl:px-20 text-white">Текст описания системы</p>
          </div>
        </div>
        <div className="flex justify-center items-center w-full basis-1/2">
          <div className="w-96">
            <span className="mb-1.5 block font-medium">АИС Мослицензия</span>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Войти в систему
            </h2>
            <form>
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">
                  Логин
                </label>
                <div className="relative">
                  <input
                    type="email"
                    disabled={true}
                    placeholder="Введите ваш логин"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    value={username}
                  />
                </div>
              </div>
              <div className="mb-5">
                <SelectCustom
                  value={workspace}
                  options={workspaces}
                  onChange={setWorkspace}
                />
              </div>
              {/*<SmartCaptcha sitekey={variables.YANDEX_CAPTCHA_KEY} onSuccess={setTokenCaptcha} />*/}

              <div className="mb-5">
                <input
                  disabled={disable}
                  type="button"
                  value="Войти"
                  className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                  onClick={() => onSearchClick()}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Relogin;
