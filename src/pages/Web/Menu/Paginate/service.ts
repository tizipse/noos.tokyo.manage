import {request} from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APIWebMenus.Data>>('/api-admin/web/menus', {params});
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/web/menus/${id}`, {method: 'DELETE'});
}

export async function doEnable(data: APIRequest.Enable<number>) {
  return request<APIResponse.Response<any>>('/api-admin/web/menu/enable', {
    method: 'PUT',
    data: data,
  });
}
