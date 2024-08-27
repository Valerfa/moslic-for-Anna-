import {variables} from "../variables.tsx";
import axios from "axios";


// Функция для получения фильтров грида
export const getJsonData = async(DataColumns, gridRef) => {
    let filters = [];
    console.log(DataColumns)
    for (let column of DataColumns) {
        console.log(column)
        if (column.children !== undefined) {
            const childrenFilters = await getJsonData(column.children, gridRef)
            console.log(column.field, childrenFilters)
            filters = [...filters, ...childrenFilters.filters];
        }
        console.log(column.field)
        if (column.filter === null)
            continue;
        const filterInstance = await gridRef.current.api.getColumnFilterInstance(column.field);
        if (filterInstance.getModelFromUi() !== null) {
            console.log(column, filterInstance.getModelFromUi())
            if (column.filterUpdate !== undefined) {
                filters.push({
                    name: column.filterField !== undefined ? column.filterField : column.field,
                    value: column.filterValue(filterInstance.getModelFromUi().filter)
                })
                continue;
            }
            if (filterInstance.getModelFromUi().conditions === undefined)
                filters.push({
                    name: column.filterField !== undefined ? column.filterField : column.field,
                    value: filterInstance.getModelFromUi()
                })
            else
                filters.push({
                    name: column.filterField !== undefined ? column.filterField : column.field,
                    value: {
                        conditions: filterInstance.getModelFromUi().conditions,
                        operator: filterInstance.getModelFromUi().operator
                    }
                })

        }
    }
    return {
      filters: filters
    }
}

// Функция для создания полного json через частичную выгрузку
export const getFullJsonData = async(params, activeDataFilters) => {
    const jsonData = activeDataFilters
    const startRow = params.startRow;
    const endRow = params.endRow;

    jsonData.page = startRow / (endRow - startRow)
    jsonData.limit = endRow - startRow
    jsonData.sort = params.sortModel.length === 0
                  ? undefined
                  : params.sortModel[0].colId
    jsonData.order = params.sortModel.length === 0
                  ? "asc"
                  : params.sortModel[0].sort
    return jsonData
}

// Функция для блокировки фильтрации на уровне грида
export const disableFiltersList = async (listFilters, gridRef) => {
    for (let column of listFilters) {
      if (column.children !== undefined) {
        disableFiltersList(column.children, gridRef)
      }
      if (column.filter === null)
        continue;
      try {
          const filterInstance = await gridRef.current.api.getColumnFilterInstance(column.field);
          function applyModel() {
          }

          filterInstance.applyModel = applyModel;
      } catch (e) {

      }
    }
}

// Функция для получения всплывающих списков
export const getFiltersLists = async (url, table, api_token) => {
    const filterUrl = `/Api/Filters/${url}${table ? '?table=' + table : ''}`
    try {
      const result = await axios.get(
        variables.API_URL + filterUrl,
        {
          headers: {
            Authorization: `Token ${api_token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      return result.data
    } catch (e) {
      console.log(e);
      return [];
    }
}

// Для работы с авторизацией
export type StoredToken = {
  token: string;
  timeExpired: number;
  username: string;
  workspace: object;
};

export const setAppToken = (t, setToken) => {
    console.log('get new token', t)
    if (t === null) {
        setToken(null);
        localStorage.removeItem(variables.AUTH_TOKEN);
        return;
    }
    setToken({
        token: t.token,
        timeExpired: new Date(t.time_expired).getTime(),
        username: t.username,
        workspace: t.workspace
    }); // заполняем токен в корневом элементе для передачи
    localStorage.setItem(
    variables.AUTH_TOKEN,
    JSON.stringify({
      token: t.token,
      timeExpired: new Date(t.time_expired).getTime(),
      username: t.username,
      workspace: t.workspace
    }) // храним токен в памяти браузера для сохранения при перезагрузке
  );
}

export const isExpired = (token? : StoredToken | null): number => {
  // Проверяем действителен ли токен
  if (!token) return -1;
  if (!token.timeExpired) return -1;

  const now = new Date().getTime();
  console.log(token.timeExpired - 10000000, now)

  return Number(now < token.timeExpired - 10000000);
};

export const getToken = (): StoredToken | null => {
  // получаем токен из хранилища
  let result = null;

  const storedToken = localStorage.getItem(variables.AUTH_TOKEN);
  storedToken && (result = JSON.parse(storedToken));

  return result;
};

// открытие формы
export const openForm = async (url, token) => {
    try {
      const result = await axios.get(
        variables.API_URL + `/Api/Authication/open?object_signature=${url}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      return result.data.data
    } catch (e) {
      console.log(e);
      throw e;
    }
}

export const closeForm = async (personlog_id, token) => {
    try {
      const result = await axios.get(
        variables.API_URL + `/Api/Authication/close?personlog_id=${personlog_id}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      return true
    } catch (e) {
      console.log(e);
      throw e;
    }
}

export const getResources = async (object_signature, token) => {
    try {
      const result = await axios.get(
        variables.API_URL + `/Api/Authication/resources?object_signature=${object_signature}`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      if (result.status !== 200) throw Error(result);
      return result.data
    } catch (e) {
      console.log(e);
      throw e;
    }
}