import React, {useEffect, useState} from 'react';
import {Divider, Form, Input, InputNumber, Modal, notification, Select} from 'antd';
import {doCreate, doUpdate} from './service';
import Constants from '@/utils/Constants';

import styles from './index.less';

const Editor: React.FC<APIWebTitle.Props> = (props) => {

  const [former] = Form.useForm<APIWebTitle.Former>();
  const [loading, setLoading] = useState<APIWebTitle.Loading>({});

  const toCreate = (params: any) => {
    setLoading({...loading, confirmed: true});
    doCreate(params)
      .then((response: APIResponse.Response<any>) => {
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
      .then((response: APIResponse.Response<any>) => {
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

  const onSubmit = (values: APIWebTitle.Former) => {
    const params: APIWebTitle.Editor = {
      name: values.name,
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
      order: props.params?.order,
      is_enable: props.params?.is_enable,
    });
  };

  const toInit = () => {
    if (!props.params) {
      former.setFieldsValue({
        name: undefined,
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
      width={500}
      onOk={() => former.submit()}
      maskClosable={false}
      onCancel={props.onCancel}
      confirmLoading={loading.confirmed}
    >
      <Divider/>
      <Form form={former} onFinish={onSubmit}>
        <Form.Item label="名称" name="name" rules={[{required: true}, {max: 32}]}>
          <Input/>
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
