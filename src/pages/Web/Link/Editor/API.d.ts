declare namespace APIWebLink {

  type Props = {
    visible?: boolean;
    params?: APIWebLinks.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    name?: string;
    summary?: string;
    url?: string;
    order?: number;
    is_enable?: number;
  };

  type Former = {
    name?: string;
    summary?: string;
    url?: string;
    order?: number;
    is_enable?: number;
  };

  type Loading = {
    confirmed?: boolean;
  };
}
