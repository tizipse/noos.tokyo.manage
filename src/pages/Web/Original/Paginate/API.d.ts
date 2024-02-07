declare namespace APIWebOriginals {

  type Data = {
    id?: string;
    name?: string;
    order?: number;
    is_enable?: number;
    created_at?: string;
    children?: Data[];
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
