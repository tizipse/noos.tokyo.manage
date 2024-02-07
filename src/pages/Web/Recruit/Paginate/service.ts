import {request} from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APIWebRecruits.Data>>('/api-admin/web/recruits', {params});
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/web/recruits/${id}`, {method: 'DELETE'});
}

export async function doEnable(data: APIRequest.Enable<number>) {
  return request<APIResponse.Response<any>>('/api-admin/web/recruit/enable', {
    method: 'PUT',
    data: data,
  });
}
