declare namespace APIWebMembers {

  type Data = {
    id?: string;
    name?: string;
    nickname?: string;
    title?: string;
    level?: 'delegate' | 'majordomo';
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
