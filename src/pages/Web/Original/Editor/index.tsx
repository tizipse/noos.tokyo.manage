import React, {useEffect, useState} from 'react';
import {
  ConfigProvider,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Select,
  Spin,
  Tabs,
  Upload
} from 'antd';
import {InboxOutlined, LoadingOutlined} from '@ant-design/icons';
import {ValidateErrorEntity} from "rc-field-form/es/interface";
import {IDomEditor, IEditorConfig, IToolbarConfig} from '@wangeditor/editor';
import {Editor as RichText, Toolbar} from '@wangeditor/editor-for-react';
import {doWebOriginalOfInformation} from "@/services/web";
import {doUpload} from '@/services/helper';
import {doCreate, doUpdate} from './service';
import Constants from '@/utils/Constants';

import styles from './index.scss';

const Editor: React.FC<APIWebOriginal.Props> = (props) => {

  const [former] = Form.useForm<APIWebOriginal.Former>();
  const [rich, setRich] = useState<IDomEditor | null>(null); // TS 语法

  const [notify, context] = notification.useNotification();

  const [load, setLoad] = useState(false);
  const [information, setInformation] = useState<APIWeb.Original>();
  const [loading, setLoading] = useState<APIWebOriginal.Loading>({});
  const [tab, setTab] = useState('basic');

  const thumbs = Form.useWatch('thumbs', former);

  const onUpload = (e: any) => {
    if (Array.isArray(e)) return e;

    if (e.file.status == 'uploading' && e.file.percent == 0) {
      setLoading({...loading, upload: true});
    } else if (e.file.status == 'done') {
      setLoading({...loading, upload: false});

      const {uid, response}: { uid: string; response: APIResponse.Response<APIBasic.Upload> } =
        e.file;

      if (response.code !== Constants.Success) {
        notification.error({message: response.message});
      } else {
        e.fileList?.forEach((item: any) => {
          if (item.uid == uid) item.thumbUrl = response.data.url;
        });
      }
    }

    return e && e.fileList;
  };

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
      .finally(() => {
        setLoading({...loading, confirmed: false})
      });
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

  const onSubmit = (values: APIWebOriginal.Former) => {

    const params: APIWebOriginal.Editor = {
      name: values.name,
      ins: values.ins,
      summary: values.summary,
      order: values.order,
      is_enable: values.is_enable,
      title: values.title,
      keyword: values.keyword,
      description: values.description,
    };

    if (values.thumbs && values.thumbs.length > 0) {
      params.thumb = values.thumbs[0].thumbUrl;
    }

    if (rich?.isEmpty()) {
      setTab('content');
      notification.error({message: '页面内容不能为空'});
      return;
    }

    params.content = rich?.getHtml();

    if (props.params) {
      toUpdate(params);
    } else {
      toCreate(params);
    }
  };

  const onFailed = (err: ValidateErrorEntity<APIWebOriginal.Former>) => {

    if (!err.values.name || !err.values.summary) {
      setTab('basic');
    } else if (!err.values.thumbs || err.values.thumbs.length <= 0) {
      setTab('thumb');
    } else if (!err.values.text) {
      setTab('content');
    }
  };

  const toInitByUpdate = () => {

    setLoad(true);

    doWebOriginalOfInformation(props.params?.id)
      .then(response => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
          if (props.onCancel) props.onCancel();
        } else {
          setInformation(response.data);
        }
      })
      .finally(() => {
        setLoad(false)
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
        thumbs: undefined,
        ins: undefined,
        summary: undefined,
        order: 50,
        is_enable: 1,
        title: undefined,
        keyword: undefined,
        description: undefined,
        content: undefined,
      });
    }
  };

  const onRich = (editor: IDomEditor) => {
    former.setFieldsValue({
      content: editor.getHtml(),
      text: editor.getText(),
    })
  }

  useEffect(() => {

    if (props.visible && information) {

      const data: APIWebOriginal.Former = {
        name: information.name,
        ins: information.ins,
        summary: information.summary,
        order: information.order,
        thumbs: [],
        is_enable: information.is_enable,
        title: information.title,
        keyword: information.keyword,
        description: information.description,
        content: information.content,
      };

      if (information.thumb) {
        data.thumbs = [{key: 1, thumbUrl: information.thumb}];
      }

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
            '/web/original/rich-text',
          );

          if (response.code != Constants.Success) {
            notify.error({key, message: response.message});
          } else {
            notify.success({key, message: '图片上传成功'});

            insert(response.data.url, response.data.name, '');
          }
        },
      },
    },
  };

  const toolbar: Partial<IToolbarConfig> = {
    excludeKeys: ['fontFamily', 'group-video', 'undo', 'redo'],
  };

  return (
    <>
      {context}
      <Modal
        width={660}
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
                        label="名称"
                        name="name"
                        rules={[{required: true}, {max: 120}]}
                      >
                        <Input/>
                      </Form.Item>
                      <Form.Item label="INS" name="ins" rules={[{max: 255, type: "url"}]}>
                        <Input/>
                      </Form.Item>
                      <Form.Item label="简介" name="summary" rules={[{required: true, max: 255}]}>
                        <Input.TextArea/>
                      </Form.Item>
                      <Form.Item label="排序" name="order" rules={[{required: true}, {type: 'number'}]}>
                        <InputNumber min={1} max={99} controls={false} className={styles.order}/>
                      </Form.Item>
                      <Form.Item label="启用" name="is_enable" rules={[{required: true}]}>
                        <Select
                          options={[
                            {label: '是', value: 1},
                            {label: '否', value: 2},
                          ]}
                        />
                      </Form.Item>
                    </>
                  ),
                },
                {
                  key: 'seo',
                  label: 'SEO',
                  forceRender: true,
                  children: (
                    <>
                      <Form.Item name="title" label="标题" rules={[{max: 255}]}>
                        <Input.TextArea rows={3} showCount maxLength={255}/>
                      </Form.Item>
                      <Form.Item name="keyword" label="词组" rules={[{max: 255}]}>
                        <Input.TextArea rows={3} showCount maxLength={255}/>
                      </Form.Item>
                      <Form.Item name="description" label="描述" rules={[{max: 255}]}>
                        <Input.TextArea rows={3} showCount maxLength={255}/>
                      </Form.Item>
                    </>
                  ),
                },
                {
                  key: 'thumb',
                  label: '图片',
                  forceRender: true,
                  children: (
                    <ConfigProvider
                      theme={{
                        components: {
                          Upload: {
                            padding: 0,
                          }
                        }
                      }}
                    >
                      <Form.Item
                        labelCol={{span: 0}}
                        label='图片'
                        name="thumbs"
                        valuePropName="fileList"
                        getValueFromEvent={onUpload}
                        rules={[{required: true}]}
                      >
                        <Upload.Dragger
                          listType="picture-card"
                          showUploadList={false}
                          maxCount={1}
                          className={styles.upload}
                          action={Constants.Upload}
                          headers={{
                            Authorization: localStorage.getItem(Constants.Authorization) as string,
                          }}
                          data={{dir: '/web/original/thumb'}}
                        >
                          {thumbs && thumbs.length > 0 ? (
                            thumbs[0].thumbUrl ?
                              <img
                                src={thumbs[0].thumbUrl}
                                alt=""
                                style={{width: '100%'}}
                              />
                              : <Spin/>
                          ) : (
                            <div className="upload-area">
                              <p className="ant-upload-drag-icon">
                                <InboxOutlined className="upload-icon"/>
                              </p>
                              <p className="ant-upload-text">点击或拖动文件到该区域进行上传</p>
                              <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibit from
                                uploading company data or other band files.
                              </p>
                            </div>
                          )}
                        </Upload.Dragger>
                      </Form.Item>
                    </ConfigProvider>
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
                        rules={[
                          {required: true},
                        ]}
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
                              onChange={onRich}
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
