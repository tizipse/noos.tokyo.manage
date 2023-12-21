declare namespace APIWebBanner {

  type Props = {
    visible?: boolean;
    params?: APIWebBanners.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    name?: string;
    picture?: string;
    client?: string;
    target?: string;
    url?: string;
    order?: number;
    is_enable?: number;
  };

  type Former = {
    name?: string;
    pictures?: any[];
    client?: string;
    target?: string;
    url?: string;
    order?: number;
    is_enable?: number;
  };

  type Loading = {
    confirmed?: boolean;
    upload?: boolean;
  };
}
