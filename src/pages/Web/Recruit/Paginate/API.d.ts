declare namespace APIWebRecruits {

  type Data = {
    id: number;
    name: string;
    summary: string;
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
  };
}
