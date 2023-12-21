declare namespace APIWebTitle {

  type Props = {
    visible?: boolean;
    params?: APIWebTitles.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    name?: string;
    order?: number;
    is_enable?: number;
  };

  type Former = {
    name?: string;
    order?: number;
    is_enable?: number;
  };

  type Loading = {
    confirmed?: boolean;
  };
}
