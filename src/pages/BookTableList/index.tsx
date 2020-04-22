import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';
import { TableListItem } from './data.d';
import { getBookInfo, queryRule, updateRule, addRule, removeRule } from './service';
import './index.less';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: FormValueType) => {
  const hide = message.loading('正在添加');
  try {
    await addRule({
      desc: fields.desc,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (selectedRows: TableListItem[]) => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;
  try {
    await removeRule({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList: React.FC<{}> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '书籍明细',
      width: 350,
      render: (_, allFields) => {
        return (
          <div className="book-info-wrap">
            <img src={allFields.book.img} onClick={() => window.open(allFields.book.img)} alt=""/>
            <div className="book-aside-info">
              <div className="book-info-item">
                {allFields.author.label}：<span className="book-info-item-value">{allFields.author.value}</span>
              </div>
              <div className="book-info-item">
                {allFields.originalName.label}：<span className="book-info-item-value">{allFields.originalName.value}</span>
              </div>
              <div className="book-info-item">
                {allFields.publisher.label}：<span className="book-info-item-value">{allFields.publisher.value}</span>
              </div>
              <div className="book-info-item">
                {allFields.translatoer.label}：<span className="book-info-item-value">{allFields.translatoer.value}</span>
              </div>
              <div className="book-info-item">
                {allFields.layout.label}：<span className="book-info-item-value">{allFields.layout.value}</span>
              </div>
              <div className="book-info-item">
                {allFields.pages.label}：<span className="book-info-item-value">{allFields.pages.value}</span>
              </div>
            </div>
          </div>
        )
      }
    },
    {
      title: 'ISBN',
      dataIndex: 'ISBN',
    },
    {
      title: '评分',
      dataIndex: ['book', 'score'],
      sorter: (a, b) => a.book.score - b.book.score,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '价格(元)',
      dataIndex: ['price', 'value'],
      sorter: (a, b) => a.price.value - b.price.value,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: '创建时间',
      dataIndex: 'updatedAt',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              message.warning("建议去网站看...")
            }}
          >
            查看详情
          </a>
        </>
      ),
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="ISBN"
        toolBarRender={(action, { selectedRows }) => [
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                  <Menu.Item key="approval">批量审批</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
            <span>
              总计 {selectedRows.reduce((pre, item) => pre + Number(item.price.value), 0)} 元
            </span>
          </div>
        )}
        request={(params) => getBookInfo(params)}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm
        onSubmit={async (value) => {
          const success = await handleAdd(value);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
