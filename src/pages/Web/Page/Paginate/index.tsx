import React, {useEffect, useState} from 'react';
import {Access, useAccess} from 'umi';
import {Button, Card, notification, Popconfirm, Select, Space, Table, Tag, theme, Tooltip} from 'antd';
import {FormOutlined, RedoOutlined} from '@ant-design/icons';
import dayjs from 'dayjs';
import Editor from '@/pages/Web/Page/Editor';
import {doDelete, doPaginate} from './service';
import Constants from '@/utils/Constants';
import Loop from '@/utils/Loop';

const Paginate: React.FC = () => {

  const access = useAccess();
  const {token} = theme.useToken();

  const [load, setLoad] = useState(false);
  const [search, setSearch] = useState<APIWebPages.Search>({});
  const [editor, setEditor] = useState<APIWebPages.Data | undefined>();
  const [visible, setVisible] = useState<APIWebPages.Visible>({});
  const [data, setData] = useState<APIData.Paginate<APIWebPages.Data>>();

  const toPaginate = () => {
    setLoad(true);
    doPaginate(search)
      .then(response => {
        if (response.code === Constants.Success) {
          setData(response.data);
        }
      })
      .finally(() => setLoad(false));
  };

  const onDelete = (record: APIWebPages.Data) => {

    if (data?.data) {
      const temp = {...data};
      if (temp.data) {
        Loop.ById(temp.data, record.id, (item) => (item.deleting = true));
      }
      setData(temp);
    }

    doDelete(record.id)
      .then(response => {
        if (response.code !== Constants.Success) {
          notification.error({message: response.message});
        } else {
          notification.success({message: '删除成功！'});
          toPaginate();
        }
      })
      .finally(() => {
        if (data?.data) {
          const temp = {...data};
          if (temp.data) {
            Loop.ById(temp.data, record.id, (item) => (item.deleting = false));
          }
          setData(temp);
        }
      });
  };

  const onCreate = () => {
    setEditor(undefined);
    setVisible({...visible, editor: true});
  };

  const onUpdate = (record: APIWebPages.Data) => {
    setEditor(record);
    setVisible({...visible, editor: true});
  };

  const onSuccess = () => {
    setVisible({});
    toPaginate();
  };

  const onCancel = () => {
    setVisible({});
  };

  useEffect(() => {
    toPaginate();
  }, [search]);

  return (
    <>
      <Card
        title="页面列表"
        extra={
          <Space size={[10, 10]}>
            <Select allowClear
                    value={search.is_system}
                    placeholder='是否内置'
                    onChange={is_system => setSearch({page: 1, is_system})}
                    options={[
                      {label: '内置：是', value: 1},
                      {label: '内置：否', value: 2},
                    ]}
            />
            <Tooltip title="刷新">
              <Button type="primary" icon={<RedoOutlined/>} onClick={toPaginate}/>
            </Tooltip>
            <Access accessible={access.page('web.page.create')}>
              <Tooltip title="创建">
                <Button type="primary" icon={<FormOutlined/>} onClick={onCreate}/>
              </Tooltip>
            </Access>
          </Space>
        }
      >
        <Table
          dataSource={data?.data}
          rowKey="id"
          loading={load}
          pagination={{
            current: data?.page,
            pageSize: data?.size,
            total: data?.total,
            showQuickJumper: false,
            onChange: (page) => setSearch({page}),
          }}
        >
          <Table.Column title="名称" dataIndex="name"/>
          <Table.Column
            title="CODE"
            align="center"
            render={(record: APIWebPages.Data) =>
              <Tag color={token.colorPrimary}>{record.code}</Tag>
            }
          />
          <Table.Column
            title="系统内置"
            align="center"
            render={(record: APIWebPages.Data) =>
              <Tag color={record.is_system == 1 ? '#87d068' : '#2db7f5'}>{record.is_system == 1 ? '是' : '否'}</Tag>
            }
          />
          <Table.Column
            title="创建时间"
            align="center"
            render={(record: APIWebPages.Data) =>
              record.created_at && dayjs(record.created_at).format('YYYY/MM/DD')
            }
          />
          <Table.Column
            title="操作"
            align="center"
            width={100}
            render={(record: APIWebPages.Data) => (
              <>

                <Access accessible={access.page('web.page.update')}>
                  <Button type="link" onClick={() => onUpdate(record)}>
                    编辑
                  </Button>
                </Access>
                {
                  record.is_system != 1 &&
                  <Access accessible={access.page('web.page.delete')}>
                    <Popconfirm
                      title="确定要删除该数据?"
                      placement="leftTop"
                      onConfirm={() => onDelete(record)}
                    >
                      <Button type="link" danger loading={record.deleting}>
                        删除
                      </Button>
                    </Popconfirm>
                  </Access>
                }
              </>
            )}
          />
        </Table>
      </Card>
      <Editor visible={visible.editor} params={editor} onSave={onSuccess} onCancel={onCancel}/>
    </>
  );
};

export default Paginate;
