import React, {useEffect, useState} from 'react';
import {Divider, Form, Input, InputNumber, Modal, notification, Select,} from 'antd';
import {doCreate, doUpdate} from './service';
import Constants from '@/utils/Constants';

import styles from './index.less';

const Editor: React.FC<APIWebLink.Props> = (props) => {

  const [former] = Form.useForm<APIWebLink.Former>();
  const [loading, setLoading] = useState<APIWebLink.Loading>({});

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

  const onSubmit = (values: APIWebLink.Former) => {
    const params: APIWebLink.Editor = {
      name: values.name,
      summary: values.summary,
      url: values.url,
      order: values.order,
      is_enable: values.is_enable,
    };

    if (props.params) {
      toUpdate(params);
    } else {
      toCreate(params);
    }
  };

  const toInitByUpdate = () => {
    former.setFieldsValue({
      name: props.params?.name,
      summary: props.params?.summary,
      url: props.params?.url,
      order: props.params?.order,
      is_enable: props.params?.is_enable,
    });
  };

  const toInit = () => {
    if (!props.params) {
      former.setFieldsValue({
        name: undefined,
        summary: undefined,
        url: undefined,
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
      width={600}
      onOk={() => former.submit()}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Divider/>
      <Form form={former} labelCol={{span: 3}} onFinish={onSubmit}>
        <Form.Item label="名称" name="name" rules={[{required: true}, {max: 32}]}>
          <Input/>
        </Form.Item>
        <Form.Item label="链接" name="url" rules={[{required: true, max: 255}]}>
          <Input/>
        </Form.Item>
        <Form.Item label="简介" name="summary" rules={[{max: 255}]}>
          <Input.TextArea showCount maxLength={255}/>
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
      </Form>
    </Modal>
  );
};

export default Editor;
