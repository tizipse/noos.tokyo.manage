declare namespace APIWebPage {

  type Props = {
    visible?: boolean;
    params?: APIWebPages.Data;
    onCreate?: () => void;
    onUpdate?: () => void;
    onSave?: () => void;
    onCancel?: () => void;
  };

  type Editor = {
    code?: string;
    name?: string;
    title?: string;
    keyword?: string;
    description?: string;
    content?: string;
  };

  type Former = {
    code?: string;
    name?: string;
    title?: string;
    keyword?: string;
    description?: string;
    content?: string;
    text?: string;
  };

  type Loading = {
    confirmed?: boolean;
    information?: boolean;
  };
}
