import React, {useEffect, useState} from 'react';
import {useModel} from "umi";
import {
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Row,
  Select,
  Space,
  Spin,
  Upload
} from 'antd';
import {InboxOutlined} from '@ant-design/icons';
import {doCreate, doUpdate} from './service';
import Constants from '@/utils/Constants';

import styles from './index.less';

const Editor: React.FC<APIWebBanner.Props> = (props) => {

  const {initialState} = useModel('@@initialState')

  const [former] = Form.useForm<APIWebBanner.Former>();
  const [loading, setLoading] = useState<APIWebBanner.Loading>({});

  const pictures = Form.useWatch('pictures', former);

  const onUpload = (e: any) => {
    if (Array.isArray(e)) return e;

    if (e.file.status == 'done') {

      const {uid, response}: { uid: string; response: APIResponse.Response<APIBasic.Upload> } = e.file;

      e.fileList?.forEach((item: any) => {

        if (item.uid == uid) {

          if (response.code !== Constants.Success) {
            item.thumbUrl = Constants.PictureFail;
            notification.error({message: response.message});
          } else {
            item.thumbUrl = response.data.url;
          }
        }
      });
    }

    return e && e.fileList;
  };

  const toCreate = (params: any) => {
    setLoading({...loading, confirmed: true});
    doCreate(params)
      .then(response => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
        } else {
          notification.success({message: '添加成功'});

          if (props.onCreate) props.onCreate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({...loading, confirmed: false}));
  };

  const toUpdate = (params: any) => {
    setLoading({...loading, confirmed: true});
    doUpdate(props.params?.id, params)
      .then(response => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
        } else {
          notification.success({message: '修改成功'});
          if (props.onUpdate) props.onUpdate();
          if (props.onSave) props.onSave();
        }
      })
      .finally(() => setLoading({...loading, confirmed: false}));
  };

  const onSubmit = (values: APIWebBanner.Former) => {
    const params: APIWebBanner.Editor = {
      name: values.name,
      target: values.target,
      url: values.url,
      client: values.client,
      order: values.order,
      is_enable: values.is_enable,
    };

    if (values.pictures && values.pictures.length > 0) {
      params.picture = values.pictures[0].thumbUrl;
    }

    if (props.params) {
      toUpdate(params);
    } else {
      toCreate(params);
    }
  };

  const toInitByUpdate = () => {
    former.setFieldsValue({
      pictures: [{key: props.params?.id, thumbUrl: props.params?.picture}],
      name: props.params?.name,
      target: props.params?.target,
      url: props.params?.url,
      client: props.params?.client,
      order: props.params?.order,
      is_enable: props.params?.is_enable,
    });
  };

  const toInit = () => {
    if (!props.params) {
      former.setFieldsValue({
        pictures: undefined,
        name: undefined,
        target: '_self',
        url: undefined,
        client: undefined,
        order: 50,
        is_enable: 1,
      });
    } else {
      toInitByUpdate();
    }
  };

  useEffect(() => {
    if (props.visible) toInit();
  }, [props.visible]);

  return (
    <Modal
      title={props.params ? '修改' : '创建'}
      open={props.visible}
      closable={false}
      centered
      width={760}
      onOk={() => former.submit()}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Divider/>
      <Form form={former} labelCol={{span: 5}} onFinish={onSubmit}>
        <Row gutter={10}>
          <Col span={24} md={{span: 12}}>
            <Form.Item
              label="图片"
              name="pictures"
              labelCol={{span: 0}}
              valuePropName="fileList"
              getValueFromEvent={onUpload}
              rules={[{required: true}]}
            >
              <Upload
                name="file"
                listType="picture-card"
                className={styles.upload}
                showUploadList={false}
                maxCount={1}
                beforeUpload={(file) => {
                  const size = file.size / 1024 / 1024 <= 2;
                  if (!size) {
                    message.error('图片大小必须小于 2M');
                  }
                  return size;
                }}
                action={Constants.Upload}
                headers={{Authorization: localStorage.getItem(Constants.Authorization) as string}}
                data={{dir: '/web/banner'}}
              >
                {pictures && pictures.length > 0 ? (
                  <div className={styles.picture}>
                    {pictures[0].thumbUrl ?
                      <img src={pictures[0].thumbUrl} alt="" style={{width: '100%'}}/> :
                      <Spin size='large'/>}
                  </div>
                ) : (
                  <div className="upload-area">
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined className="upload-icon" style={{color: initialState?.settings?.colorPrimary}}/>
                    </p>
                    <p className="ant-upload-text">点击进行上传</p>
                    <p className="ant-upload-hint">Support for a single upload.</p>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={24} md={{span: 12}}>
            <Form.Item label="名称" name="name" rules={[{required: true}, {max: 32}]}>
              <Input/>
            </Form.Item>
            <Form.Item label='链接'>
              <Space.Compact>
                <Form.Item label="打开" name="target" rules={[{required: true}]} noStyle>
                  <Select
                    options={[
                      {label: '新窗口', value: '_blank'},
                      {label: '本窗口', value: '_self'},
                    ]}
                    style={{width: '40%'}}/>
                </Form.Item>
                <Form.Item label="链接" name="url" rules={[{max: 255}]} noStyle>
                  <Input allowClear placeholder='链接'/>
                </Form.Item>
              </Space.Compact>
            </Form.Item>
            <Form.Item label="位置" name="client" rules={[{required: true}]}>
              <Select
                options={[
                  {label: '电脑端', value: 'pc'},
                  {label: '移动端', value: 'mobile'},
                ]}
              />
            </Form.Item>
            <Form.Item label="排序" name="order" rules={[{required: true}, {type: 'number'}]}>
              <InputNumber min={1} max={99} controls={false} className={styles.order}/>
            </Form.Item>
            <Form.Item label="启用" name="is_enable" rules={[{required: true}]}>
              <Select options={[
                {label: '是', value: 1},
                {label: '否', value: 2},
              ]}/>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Editor;
