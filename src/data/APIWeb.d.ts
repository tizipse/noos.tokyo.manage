declare namespace APIWeb {

  type Member = {
    id?: string;
    title_id?: number;
    name?: string;
    nickname?: string;
    thumb?: string;
    ins?: string;
    level?: 'delegate' | 'majordomo';
    order?: number;
    is_enable?: number;
    title?: string;
    keyword?: string;
    description?: string;
    content?: string;
    created_at?: string;
  };

  type Original = {
    id?: string;
    name?: string;
    thumb?: string;
    ins?: string;
    summary?: string;
    order?: number;
    is_enable?: number;
    title?: string;
    keyword?: string;
    description?: string;
    content?: string;
    created_at?: string;
  };

  type Page = {
    id?: number;
    code?: string;
    name?: string;
    title?: string;
    keyword?: string;
    description?: string;
    content?: string;
    created_at?: string;
  };

}
