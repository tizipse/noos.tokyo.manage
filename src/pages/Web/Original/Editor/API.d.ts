declare namespace APIWebOriginal {

  type Props = {
    visible?: boolean;
    params?: APIWebOriginals.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    name?: string;
    thumb?: string;
    ins?: string;
    summary?: string;
    order?: number;
    title?: string;
    keyword?: string;
    description?: string;
    content?: string;
    is_enable?: number;
  };

  type Former = {
    name?: string;
    thumbs?: any[];
    ins?: string;
    summary?: string;
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
    upload?: boolean;
  };
}
