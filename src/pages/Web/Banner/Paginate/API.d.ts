declare namespace APIWebBanners {

  type Data = {
    id: number;
    name: string;
    picture: string;
    client: string;
    target: string;
    url: string;
    order?: number;
    is_enable?: number;
    created_at?: string;
    loading_deleted?: boolean;
    loading_enable?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    page?: number;
    client?: string;
  };
}
