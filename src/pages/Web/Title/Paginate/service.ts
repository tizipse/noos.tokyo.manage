import {request} from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APIWebTitles.Data>>('/api-admin/web/titles', {params});
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/web/titles/${id}`, {method: 'DELETE'});
}

export async function doEnable(data: APIRequest.Enable<number>) {
  return request<APIResponse.Response<any>>('/api-admin/web/title/enable', {
    method: 'PUT',
    data: data,
  });
}
