import {
  GET_LIST,
  GET_ONE,
  GET_MANY,
  GET_MANY_REFERENCE,
  CREATE,
  UPDATE,
  DELETE,
  DELETE_MANY
  //@ts-ignore
} from "react-admin";
//@ts-ignore
import { stringify } from "query-string";
import Fetch from './fetch'
const API_URL = process.env.REACT_APP_HOST + 'api/admin';
  
/**
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The Data Provider request params, depending on the type
   * @returns {Object} { url, options } The HTTP request parameters
   */
const convertDataProviderRequestToHTTP = (type: any, resource: any, params: { pagination: { page: any; perPage: any; }; sort: { field: any; order: any; }; filter: any; id: any; ids: any; target: any; data: any; }) => {
  switch (type) {
  case GET_LIST: {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      page: page,
      limit: perPage,
      //   range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify(params.filter)
    };
    return { url: `${API_URL}/${resource}?${stringify(query)}` };
  }
  case GET_ONE:
    return { url: `${API_URL}/${resource}/${params.id}` };
  case GET_MANY: {
    const query = {
      filter: JSON.stringify({ id: params.ids })
    };
    return { url: `${API_URL}/${resource}?${stringify(query)}` };
  }
  case GET_MANY_REFERENCE: {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page ) * perPage, page * perPage]),
      filter: JSON.stringify({ ...params.filter, [params.target]: params.id })
    };
    return { url: `${API_URL}/${resource}?${stringify(query)}` };
  }
  case UPDATE:
    return {
      url: `${API_URL}/${resource}/edit/${params.id}`,
      options: { method: "POST", data: params.data }
    };
  case CREATE:
    return {
      url: `${API_URL}/${resource}`,
      options: { method: "POST", data:params.data }
    };
  case DELETE:
    return {
      url: `${API_URL}/${resource}/${params.id}`,
      options: { method: "DELETE" }
    };
  case DELETE_MANY:
    return {
      url: `${API_URL}/${resource}/delete`,
      options: { method: "POST",data: JSON.stringify(params.ids) }
    };  
  case 'all': // 获取所有 不分页
    return { url: `${API_URL}/${resource}/all`, options: { method: "POST"}};
  default:
    throw new Error(`Unsupported fetch action type ${type}`);
  }
};
  
/**
   * @param {Object} response HTTP response from fetch()
   * @param {String} type One of the constants appearing at the top if this file, e.g. 'UPDATE'
   * @param {String} resource Name of the resource to fetch, e.g. 'posts'
   * @param {Object} params The Data Provider request params, depending on the type
   * @returns {Object} Data Provider response
   */
const convertHTTPResponseToDataProvider = (
  response: { headers: any; data: any; },
  type: any,
  resource: any,
  params: { data: any; }
) => {
  
  const { data } = response;
  switch (type) {
  case GET_LIST:
    return {
      data: data.data.data.map((x: any) => x),
      total:parseInt(data.data.total),
    };
  case CREATE:
    return { data: { ...params.data } };
  default:
    return { data:data.data };
  }
};
  
/**
   * @param {string} type Request type, e.g GET_LIST
   * @param {string} resource Resource name, e.g. "posts"
   * @param {Object} payload Request parameters. Depends on the request type
   * @returns {Promise} the Promise for response
   */
export default (type: any, resource: any, params: any) => {
  const { url, options } = convertDataProviderRequestToHTTP(
    type,
    resource,
    params
  );
  //@ts-ignore
  return Fetch({url, ...options}).then((response: any) =>
    convertHTTPResponseToDataProvider(response, type, resource, params)
  );
};