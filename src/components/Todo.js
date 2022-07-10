import React, { useRef } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { useState } from 'react';
import { Button, DatePicker, Form, Input, Modal, Select, Space, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
const { Option } = Select;




const Todo = () => {
    const searchInput = useRef(null);
    const [editingTask, setEditingTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [form] = Form.useForm();

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
    };



    const handleReset = (clearFilters) => {
        clearFilters();
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div
                style={{
                    padding: 8,
                }}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                    autoFocus
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });

                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            return record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        },
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
    });

    const [todoData, setTodoData] = useState([
        {
            id: 1,
            createAt: Date.now(),
            title: 'Coding',
            description: `Coding is Started with "Hello World" always.Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.`,
            endAt: Date.now() + 200000,
            tags: ['coding', 'programming'],
            status: 'Open',
        },
        {
            id: 2,
            createAt: Date.now() - 50000,
            title: 'Programming',
            description: 'Programming is Started with "Hello World" always',
            endAt: Date.now() - 200000,
            tags: ['coding', 'problem'],
            status: 'Running',

        },

    ])

    const columns = [
        {
            key: 'createAt',
            title: 'Creation Time',
            dataIndex: 'createAt',
            valueType: 'dateTime',
        },
        {
            key: 'title',
            title: 'Title',
            dataIndex: 'title',
            ...getColumnSearchProps('title'),

        },
        {
            key: 'description',
            title: 'Description',
            dataIndex: 'description',
            ...getColumnSearchProps('description'),
            width: 500,
        },
        {
            key: 'endAt',
            title: 'Due Date',
            dataIndex: 'endAt',
            valueType: 'dateTime',
        },
        {
            key: 'tags',
            title: 'Tags',
            dataIndex: 'tags',
            render: (_, { tags }) => (
                <>
                    {tags.map(tag => {

                        return (
                            <Tag key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
            ...getColumnSearchProps('tags'),
        },
        {
            key: 'status',
            title: 'Status',
            render: (record) => {
                // console.log(record);
                return (
                    <>
                        {
                            (Date.now() > record.endAt &&  record.status !== 'Done') ?
                                <p>Overdue</p>
                                :
                                <p>{record.status}</p>
                        }
                    </>
                )
            }
        },
        {
            key: 'action',
            title: 'Action',
            render: (record) => {
                console.log(record);
                return <>
                    <EditOutlined onClick={() => onEditTask(record)} />
                    <DeleteOutlined onClick={() => onDeleteTask(record)} style={{ color: 'red', marginLeft: 13 }} />
                </>
            }
        }
    ]

    const onFinish = (value) => {
        console.log(value);
        const time = value.dueDate._d;
        let date = new Date(time);
        setTodoData(pre => {
            const data = {
                id: todoData.length + 1,
                createAt: Date.now(),
                title: value.title,
                description: value.description,
                endAt: value.dueDate ? date.getTime() : undefined,
                tags: value.tags,
                status: 'Open',
            }
            return [...pre, data];
        })

        setModalVisible(false);
        form.resetFields();
    }
    const range = (start, end) => {
        const result = [];

        for (let i = start; i < end; i++) {
            result.push(i);
        }

        return result;
    };
    const disabledDate = (current) => {
        return current && current < moment().startOf('day');
    };

    const disabledDateTime = (current) => ({
        disabledHours: () => {
            if (current < moment().endOf('day')) {
                return range(0, 24).splice(0, moment().hours())
            }
            return;
        },
    });

    const onEditTask = (record) => {
        setModalVisible2(true);
        setEditingTask(record);
    }
    const onDeleteTask = (record) => {
        console.log(record);
        Modal.confirm({
            title: `Are you sure to delete "${record.title}" ?`,
            okText: 'Yes',
            okType: 'danger',
            onOk: () => {
                setTodoData(pre => {
                    return pre.filter(task => task.id !== record.id);
                })
            }
        })
    }
    console.log(editingTask);
    const dateFormat = "YYYY-MM-DD";
    return (
        <div style={{
            width: '1200px',
            margin: '20px auto 0 auto',
        }}>
            <h1 style={{ margin: '20px 0 30px' }}>Todo Pro Table</h1>
            <ProTable
                toolbar={{
                    actions: [
                        <Button
                            key="primary"
                            type="primary"
                            onClick={() => {
                                setModalVisible(true)
                            }}
                        >
                            Add New Task
                        </Button>,
                    ],
                }}
                search={false}
                pagination={{
                    showSizeChanger: true,
                    defaultPageSize: 10,
                }}
                columns={columns}
                dataSource={todoData}
            ></ProTable>


            <Modal
                title="Add a new task"
                style={{
                    top: 20,
                }}
                visible={modalVisible}
                footer={false}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
            >
                <Form
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item
                        name='title'
                        label="Title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your title!',
                            },
                        ]}
                    >
                        <Input showCount maxLength={100} />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            {
                                required: true,
                                message: 'Please input description',
                            },
                        ]}
                    >
                        <Input.TextArea showCount maxLength={1000} />
                    </Form.Item>
                    <Form.Item
                        name="dueDate"
                        label="Due Date (optional)"
                        valueType={Number}
                    >
                        <DatePicker
                            format="YYYY-MM-DD HH:mm:ss"
                            disabledDate={disabledDate}
                            disabledTime={disabledDateTime}
                            showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                        />
                    </Form.Item>


                    <Form.Item
                        name="tags"
                        label="Tags (optional)"
                    >
                        <Select
                            mode="tags"
                            style={{
                                width: '100%',
                            }}
                            tokenSeparators={[',']}
                        >
                        </Select>
                    </Form.Item>

                    {/* <Form.Item
                        name="status"
                        label="Status"
                    >
                        <Select
                            defaultValue={{ value: 'open' }}
                            placeholder="Please select favourite colors">
                            <Option value="open">OPEN</Option>
                            <Option value="working">WORKING</Option>
                            <Option value="done">DONE</Option>
                            <Option value="overdue">OVERDUE</Option>
                        </Select>
                    </Form.Item> */}

                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form>
            </Modal>


            {/* Edit Modal */}
            <Modal
                title="Update this task"
                style={{
                    top: 20,
                }}
                visible={modalVisible2}
                onCancel={() => {
                    setModalVisible2(false);
                    setEditingTask(null);
                }}
                onOk={() => {
                    setModalVisible2(false);
                    setTodoData(pre => {
                        return pre.map(task => {
                            if (task.id === editingTask.id) {
                                return editingTask;
                            } else {
                                return task;
                            }
                        })
                    })

                }}
                okText='Save'
                initialValues={editingTask}
            >
                <Form.Item
                    label="Title"
                >
                    <Input value={editingTask?.title} onChange={(e) => {
                        setEditingTask(pre => {
                            return { ...pre, title: e.target.value }
                        })
                    }} showCount maxLength={100} />
                </Form.Item>
                <Form.Item
                    label="Description"
                >
                    <Input.TextArea value={editingTask?.description} onChange={(e) => {
                        setEditingTask(pre => {
                            console.log(editingTask);
                            return { ...pre, description: e.target.value }
                        })
                    }} showCount maxLength={1000} />
                </Form.Item>
                <Form.Item
                    label="Due Date"
                    name='endAt'
                >

                    <DatePicker
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={disabledDate}
                        disabledTime={disabledDateTime}
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                        onChange={(e) => {
                            let date = new Date(e._d);
                            setEditingTask(pre => {
                                return { ...pre, endAt: e._d ? date.getTime() : undefined }
                            })
                        }}
                    />
                </Form.Item>
                <Form.Item
                    label="Status"
                >
                    <Select
                        onChange={(e) => {
                            setEditingTask(pre => {
                                return {...pre, status: e};
                            })
                        }}
                        placeholder="Please select Status">
                        <Option value="Open">OPEN</Option>
                        <Option value="Working">WORKING</Option>
                        <Option value="Done">DONE</Option>
                        <Option value="Overdue">OVERDUE</Option>
                    </Select>
                </Form.Item>

            </Modal>
        </div>
    );
};

export default Todo;