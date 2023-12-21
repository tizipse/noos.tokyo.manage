import {request} from "umi";

export async function doWebMemberOfInformation(id?: string) {
  return request<APIResponse.Response<APIWeb.Member>>(`/api-admin/web/members/${id}`);
}

export async function doWebTitleOfOpening() {
  return request<APIResponse.Response<APIData.Enable<number>[]>>('/api-admin/web/title/opening');
}
