import { request } from 'umi';

export async function doCreate(params?: any) {
  return request<APIResponse.Response<any>>('/api-admin/web/original', {
    method: 'POST',
    data: params,
  });
}

export async function doUpdate(id?: string, params?: any) {
  return request<APIResponse.Response<any>>(`/api-admin/web/originals/${id}`, {
    method: 'PUT',
    data: params,
  });
}
