declare namespace APIWebTime {

  type Props = {
    visible?: boolean;
    params?: APIWebTimes.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    name?: string;
    content?: string;
    status?: string;
    order?: number;
    is_enable?: number;
  };

  type Former = {
    name?: string;
    content?: string;
    status?: string;
    order?: number;
    is_enable?: number;
  };

  type Loading = {
    confirmed?: boolean;
  };
}
