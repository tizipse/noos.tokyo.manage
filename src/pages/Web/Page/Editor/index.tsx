import React, {useEffect, useState} from 'react';
import {Form, Input, Modal, notification, Spin, Tabs} from 'antd';
import {LoadingOutlined} from '@ant-design/icons';
import {ValidateErrorEntity} from "rc-field-form/es/interface";
import {IDomEditor, IEditorConfig, IToolbarConfig} from '@wangeditor/editor';
import {Editor as RichText, Toolbar} from '@wangeditor/editor-for-react';
import {doUpload} from '@/services/helper';
import {doWebPageByInformation} from "@/services/web";
import {doCreate, doUpdate} from './service';
import Constants from '@/utils/Constants';
import Pattern from "@/utils/Pattern";

import styles from './index.less';

const Editor: React.FC<APIWebPage.Props> = (props) => {

  const [former] = Form.useForm<APIWebPage.Former>();
  const [rich, setRich] = useState<IDomEditor | null>(null); // TS 语法

  const [notify, context] = notification.useNotification();

  const [information, setInformation] = useState<APIWeb.Page>();
  const [loading, setLoading] = useState<APIWebPage.Loading>({});
  const [load, setLoad] = useState(false);
  const [tab, setTab] = useState('basic');

  const toCreate = (params: any) => {
    setLoading({...loading, confirmed: true});
    doCreate(params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
        } else {
          notification.success({message: '添加成功'});

          props.onCreate?.();
          props.onSave?.();
        }
      })
      .finally(() => setLoading({...loading, confirmed: false}));
  };

  const toUpdate = (params: any) => {
    setLoading({...loading, confirmed: true});
    doUpdate(props.params?.id, params)
      .then((response: APIResponse.Response<any>) => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
        } else {
          notification.success({message: '修改成功'});

          props.onUpdate?.();
          props.onSave?.();
        }
      })
      .finally(() => setLoading({...loading, confirmed: false}));
  };

  const onSubmit = (values: APIWebPage.Former) => {

    const params: APIWebPage.Editor = {
      code: values.code,
      name: values.name,
      title: values.title,
      keyword: values.keyword,
      description: values.description,
      content: values.content,
    };

    if (props.params) {
      toUpdate(params);
    } else {
      toCreate(params);
    }
  };

  const onFailed = (err: ValidateErrorEntity) => {

    if (!err.values.name || !err.values.code) {
      setTab('basic');
    } else if (!err.values.text) {
      setTab('content');
    }
  };

  const onChangeRich = (editor: IDomEditor) => {
    former.setFieldsValue({
      content: editor.getHtml(),
      text: editor.getText(),
    })
  }

  const toInitByUpdate = () => {

    setLoad(true);

    doWebPageByInformation(props.params?.id)
      .then(response => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
          if (props.onCancel) props.onCancel();
        } else {
          setInformation(response.data);
        }
      })
      .finally(() => {
        setLoad(false);
      });
  };

  const toInit = () => {

    setTab('basic');

    if (props.params) {
      toInitByUpdate();
    } else {
      setInformation(undefined);
      former.setFieldsValue({
        name: undefined,
        code: undefined,
        title: undefined,
        keyword: undefined,
        description: undefined,
        content: undefined,
        text: undefined,
      });
    }
  };

  useEffect(() => {

    if (props.visible && information) {

      const data: APIWebPage.Former = {
        name: information.name,
        code: information.code,
        title: information.title,
        keyword: information.keyword,
        description: information.description,
        content: information.content,
      };

      former.setFieldsValue(data);
    }

    if (props.visible && rich && !rich.isDestroyed && information?.content) {
      rich.setHtml(information.content);
    } else if (props.visible && rich && !rich.isDestroyed) {
      rich.setHtml('');
    }
  }, [props.visible, information, rich]);

  useEffect(() => {

    if (props.visible) {

      toInit();
    }
  }, [props.visible]);

  useEffect(() => {
    return () => {
      if (rich != null && !rich.isDestroyed) {
        rich.destroy();
        setRich(null);
      }
    };
  }, [rich]);

  const editor: Partial<IEditorConfig> = {
    // TS 语法
    MENU_CONF: {
      uploadImage: {
        customUpload: async (file: any, insert: any) => {
          const key = crypto.randomUUID();

          notify.open({
            key,
            message: '图片正在上传中',
            icon: <LoadingOutlined/>,
          });

          const response: APIResponse.Response<APIBasic.Upload> = await doUpload(
            file,
            '/shop/page/information',
          );

          if (response.code != Constants.Success) {
            notify.error({key, message: response.message});
          } else {
            notify.success({key, message: '图片上传成功'});

            insert(response.data.url, response.data.name, '');
          }
        },
      },
      fontFamily: {
        fontFamilyList: [
          {
            name: 'Lemon', value: 'Title-Font, system-ui',
          }
        ]
      }
    },
  };

  const toolbar: Partial<IToolbarConfig> = {
    excludeKeys: ['undo', 'redo'],
  };

  return (
    <>
      {context}
      <Modal
        width={800}
        open={props.visible}
        closable={false}
        centered
        maskClosable={false}
        onOk={former.submit}
        onCancel={props.onCancel}
        confirmLoading={loading.confirmed}
      >
        <Spin spinning={load} tip="数据加载中...">
          <Form form={former} onFinishFailed={onFailed} onFinish={onSubmit} labelCol={{span: 2}}>
            <Tabs
              activeKey={tab}
              onChange={(activeKey) => setTab(activeKey)}
              items={[
                {
                  key: 'basic',
                  label: '基本',
                  forceRender: true,
                  children: (
                    <>
                      <Form.Item
                        label="Code"
                        name="code"
                        rules={[
                          {required: true, max: 120},
                          {pattern: Pattern.CODE, message: '请输入英文数字-'}
                        ]}
                      >
                        <Input disabled={!!props.params}/>
                      </Form.Item>
                      <Form.Item
                        label="名称"
                        name="name"
                        rules={[{required: true}, {max: 120}]}
                      >
                        <Input/>
                      </Form.Item>
                      <Form.Item name="title" label="标题" rules={[{max: 255}]}>
                        <Input placeholder='SEO 标题'/>
                      </Form.Item>
                      <Form.Item name="keyword" label="词组" rules={[{max: 255}]}>
                        <Input.TextArea rows={3} showCount maxLength={255} placeholder='SEO 词组'/>
                      </Form.Item>
                      <Form.Item name="description" label="描述" rules={[{max: 255}]}>
                        <Input.TextArea rows={3} showCount maxLength={255} placeholder='SEO 描述'/>
                      </Form.Item>
                    </>
                  ),
                },
                {
                  key: 'content',
                  label: '详情',
                  forceRender: true,
                  children: (
                    <>
                      <Form.Item name='content' hidden/>
                      <Form.Item
                        labelCol={{span: 0}}
                        label='详情'
                        name='text'
                        rules={[{required: true}]}
                      >
                        <Form.Item noStyle>
                          <div className={styles.rich}>
                            <Toolbar
                              editor={rich}
                              defaultConfig={toolbar}
                              mode="default"
                              style={{borderBottom: '1px solid #ccc'}}
                            />
                            <RichText
                              defaultConfig={editor}
                              onCreated={setRich}
                              onChange={onChangeRich}
                              mode="default"
                              className={styles.content}
                            />
                          </div>
                        </Form.Item>
                      </Form.Item>
                    </>
                  ),
                },
              ]}
            />
          </Form>
        </Spin>
      </Modal>
    </>
  );
};

export default Editor;
