import {request} from 'umi';

export async function doPaginate(params?: any) {
  return request<APIResponse.Paginate<APIWebBanners.Data>>('/api-admin/web/banners', {params});
}

export async function doDelete(id?: number) {
  return request<APIResponse.Response<any>>(`/api-admin/web/banners/${id}`, {method: 'DELETE'});
}

export async function doEnable(data: APIRequest.Enable<number>) {
  return request<APIResponse.Response<any>>('/api-admin/web/banner/enable', {
    method: 'PUT',
    data: data,
  });
}
