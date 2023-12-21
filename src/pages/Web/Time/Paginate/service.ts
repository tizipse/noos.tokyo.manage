import {request} from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APIWebTimes.Data>>('/api-admin/web/times', {params});
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/web/times/${id}`, {method: 'DELETE'});
}

export async function doEnable(data: APIRequest.Enable<number>) {
  return request<APIResponse.Response<any>>('/api-admin/web/time/enable', {
    method: 'PUT',
    data: data,
  });
}
