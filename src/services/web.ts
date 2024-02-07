import {request} from "umi";

export async function doWebMemberOfInformation(id?: string) {
  return request<APIResponse.Response<APIWeb.Member>>(`/api-admin/web/members/${id}`);
}

export async function doWebOriginalOfInformation(id?: string) {
  return request<APIResponse.Response<APIWeb.Original>>(`/api-admin/web/originals/${id}`);
}

export async function doWebPageByInformation(id?: number) {
  return request<APIResponse.Response<APIWeb.Page>>(`/api-admin/web/pages/${id}`);
}

export async function doWebTitleOfOpening() {
  return request<APIResponse.Response<APIData.Enable<number>[]>>('/api-admin/web/title/opening');
}
