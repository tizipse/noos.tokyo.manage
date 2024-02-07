declare namespace APIWebPages {

  type Data = {
    id?: number;
    code?: string;
    name?: string;
    is_system?: number;
    created_at?: string;
    deleting?: boolean;
  };

  type Visible = {
    editor?: boolean;
  };

  type Search = {
    is_system?: number;
    page?: number;
  };
}
