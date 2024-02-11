declare namespace APIWebMember {

  type Props = {
    visible?: boolean;
    params?: APIWebMembers.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    title_id?: number;
    name?: string;
    nickname?: string;
    thumb?: string;
    ins?: string;
    level?: 'delegate' | 'majordomo';
    order?: number;
    title?: string;
    keyword?: string;
    description?: string;
    content?: string;
    is_enable?: number;
  };

  type Former = {
    title_id?: number;
    name?: string;
    nickname?: string;
    thumbs?: any[];
    ins?: string;
    level?: 'delegate' | 'majordomo';
    order?: number;
    title?: string;
    keyword?: string;
    description?: string;
    content?: string;
    text?: string;
    is_enable?: number;
  };

  type Loading = {
    confirmed?: boolean;
    title?: boolean;
    upload?: boolean;
  };
}
