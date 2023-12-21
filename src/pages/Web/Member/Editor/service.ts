import { request } from 'umi';

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api-admin/web/member', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: string, params?: any) {
  return request<APIResponse.Response<any>>(`/api-admin/web/members/${id}`, {
    method: 'PUT',
    data: params,
  });
}
