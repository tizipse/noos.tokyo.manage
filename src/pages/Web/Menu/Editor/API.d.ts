declare namespace APIWebMenu {

  type Props = {
    visible?: boolean;
    params?: APIWebMenus.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    name?: string;
    price?: string;
    type?: string;
    order?: number;
    is_enable?: number;
  };

  type Former = {
    name?: string;
    price?: string;
    type?: string;
    order?: number;
    is_enable?: number;
  };

  type Loading = {
    confirmed?: boolean;
  };
}
