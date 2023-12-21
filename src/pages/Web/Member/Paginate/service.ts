import { request } from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APIWebMembers.Data>>('/api-admin/web/members', { params });
}

export async function doDelete(id?: string) {
  return request<APIResponse.Response<any>>(`/api-admin/web/members/${id}`, { method: 'DELETE' });
}

export async function doEnable(data: APIRequest.Enable<string>) {
  return request<APIResponse.Response<any>>('/api-admin/web/member/enable', {
    method: 'PUT',
    data: data,
  });
}
