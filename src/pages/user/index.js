import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "@material-tailwind/react";

import { defaultUserList, getUserList } from './../../redux/userListSlice';
import { defaultUserInactive, setUserInactive } from "../../redux/userInactiveSlice";
import { defaultUserActive, setUserActive } from "../../redux/userActiveSlice";
import { defaultUserDisable, setUserDisable } from "../../redux/userDisableSlice";
import { defaultUserResetPassword, setUserResetPassword } from "../../redux/userResetPasswordSlice";
import { defaultUserDelete, setUserDelete } from "../../redux/userDeleteSlice";

import BreadCrumb from "../../components/breadcrumb";
import DataTable from '../../components/data-table';
import SelectOption from "../../components/select-option";
import Alert from "../../components/alert";

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [firstLoaded, setFirstLoaded] = useState(false);
  const [selectData, setSelectData] = useState({})
  const [currnetPage, setCurrentPage] = useState('1');
  const [perPage, setPerPage] = useState('10');
  const [filter, setFilter] = useState({
    keyword: '',
    status: {value: '', label: ''},
    role: {value: '', label: ''},
  });
  const [alertConfirm, setAlertConfirm] = useState({
    show: false,
    title: '',
    message: '',
    onCancel: () => {},
    onConfirm: () => {},
  })
  const [alertSuccess, setAlertSuccess] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })
  const [alertError, setAlertError] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: () => {},
  })
  const userList = useSelector(({ userList }) => userList);
  const userInactive = useSelector(({ userInactive }) => userInactive);
  const userActive = useSelector(({ userActive }) => userActive);
  const userDisable = useSelector(({ userDisable }) => userDisable);
  const userResetPassword = useSelector(({ userResetPassword }) => userResetPassword);
  const userDelete = useSelector(({ userDelete }) => userDelete);

  const title = [
    {
      label: 'Name',
      object: 'name',
      titlePosition: 'left',
      customRender: (data) => {
        return <span className="whitespace-nowrap">{data?.profile?.name}</span>
      }
    },
    {
      label: 'Email',
      object: 'email',
      titlePosition: 'left',
      customRender: (data) => {
        return <span className="whitespace-nowrap">{data?.email}</span>
      }
    },
    {
      label: 'Username',
      object: 'username',
      titlePosition: 'left',
      customRender: (data) => {
        return <span className="whitespace-nowrap">{data?.username??'-'}</span>
      }
    },
    {
      label: 'Phone',
      object: 'phone',
      titlePosition: 'left',
      customRender: (data) => {
        return <span className="whitespace-nowrap">{data?.profile?.phone}</span>
      }
    },
    {
      label: 'Role',
      object: 'role',
      customRender: (data) => {
        if (data?.role === 'admin') {
          return <div className="w-full flex items-center justify-center"><span className="text-xs bg-amber-600 rounded p-1 text-white text-center whitespace-nowrap">Admin</span></div>
        } else {
          return <div className="w-full flex items-center justify-center"><span className="text-xs bg-teal-600 rounded p-1 text-white text-center whitespace-nowrap">Staff</span></div>
        }
      }
    },
    {
      label: 'Status',
      object: 'status',
      customRender: (data) => {
        if (parseInt(data?.status) === 1) {
          return <div className="w-full flex items-center justify-center"><span className="text-xs bg-blue-600 rounded p-1 text-white text-center whitespace-nowrap">Inactive</span></div>
        } else if (parseInt(data?.status) === 2) {
          return <div className="w-full flex items-center justify-center"><span className="text-xs bg-green-600 rounded p-1 text-white text-center whitespace-nowrap">Active</span></div>
        } else if (parseInt(data?.status) === 3) {
          return <div className="w-full flex items-center justify-center"><span className="text-xs bg-red-600 rounded p-1 text-white text-center whitespace-nowrap">Disabled</span></div>
        }
      }
    }
  ];

  useEffect(() => {
    setFirstLoaded(true);
  }, []);

  useEffect(() => {
    if (firstLoaded) {
      setFirstLoaded(false);
      getListData({
        keyword: filter?.keyword !== '' ? filter?.keyword : null,
        status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
        role: filter?.role?.value??null,
        page: parseInt(1),
        perPage: parseInt(10),
      });
    }
  }, [firstLoaded]);

  useEffect(() => {
    let {
      isLoading,
      isSuccess,
      isError,
      errorMessage
    } = userList;

    if (!isLoading && isSuccess) {
      dispatch(defaultUserList());
    }

    if (!isLoading && isError) {
      setAlertError({
        show: false,
        title: 'Get List Data',
        message: errorMessage,
        onConfirm: () => {
          setAlertError({
            show: false,
            title: '',
            message: '',
            onConfirm: () => {},
          })
          dispatch(defaultUserList());
        },
      })
    }
  }, [userList]);

  useEffect(() => {
    let {
      isLoading,
      isSuccess,
      isError,
      errorMessage
    } = userInactive;

    if (!isLoading && isSuccess) {
      setAlertConfirm({
        show: false,
        title: '',
        message: '',
        onCancel: () => {},
        onConfirm: () => {},
      })
      setAlertSuccess({
        show: true,
        title: 'Inactive User',
        message: `<b>${selectData?.profile?.name}</b> successfully set to <b>Inactive</b>`,
        onConfirm: () => {
          setAlertSuccess({
            show: false,
            title: '',
            message: '',
            onConfirm: () => {},
          })
          dispatch(defaultUserInactive());
          setSelectData({});
          getListData({
            keyword: filter?.keyword !== '' ? filter?.keyword : null,
            status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
            role: filter?.role?.value??null,
            page: 1,
            perPage: parseInt(perPage),
          })
        },
      })
    }

    if (!isLoading && isError) {
      setAlertConfirm({
        show: false,
        title: '',
        message: '',
        onCancel: () => {},
        onConfirm: () => {},
      })
      setAlertError({
        show: true,
        title: 'Inactive User',
        message: errorMessage,
        onConfirm: () => {
          setAlertError({
            show: false,
            title: '',
            message: '',
            onConfirm: () => {},
          })
          dispatch(defaultUserInactive());
          setSelectData({});
          getListData({
            keyword: filter?.keyword !== '' ? filter?.keyword : null,
            status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
            role: filter?.role?.value??null,
            page: 1,
            perPage: parseInt(perPage),
          });
        },
      })
    }
  }, [userInactive]);

  useEffect(() => {
    let {
      isLoading,
      isSuccess,
      isError,
      errorMessage
    } = userActive;

    if (!isLoading && isSuccess) {
      setAlertConfirm({
        show: false,
        title: '',
        message: '',
        onCancel: () => {},
        onConfirm: () => {},
      })
      setAlertSuccess({
        show: true,
        title: 'Active User',
        message: `<b>${selectData?.profile?.name}</b> successfully set to <b>Active</b>`,
        onConfirm: () => {
          setAlertSuccess({
            show: false,
            title: '',
            message: '',
            onConfirm: () => {},
          })
          dispatch(defaultUserActive());
          setSelectData({});
          getListData({
            keyword: filter?.keyword !== '' ? filter?.keyword : null,
            status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
            role: filter?.role?.value??null,
            page: 1,
            perPage: parseInt(perPage),
          })
        },
      })
    }

    if (!isLoading && isError) {
      setAlertConfirm({
        show: false,
        title: '',
        message: '',
        onCancel: () => {},
        onConfirm: () => {},
      })
      setAlertError({
        show: true,
        title: 'Active User',
        message: errorMessage,
        onConfirm: () => {
          setAlertError({
            show: false,
            title: '',
            message: '',
            onConfirm: () => {},
          })
          dispatch(defaultUserActive());
          setSelectData({});
          getListData({
            keyword: filter?.keyword !== '' ? filter?.keyword : null,
            status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
            role: filter?.role?.value??null,
            page: 1,
            perPage: parseInt(perPage),
          })
        },
      })
    }
  }, [userActive]);

  useEffect(() => {
    let {
      isLoading,
      isSuccess,
      isError,
      errorMessage
    } = userDisable;

    if (!isLoading && isSuccess) {
      setAlertConfirm({
        show: false,
        title: '',
        message: '',
        onCancel: () => {},
        onConfirm: () => {},
      })
      setAlertSuccess({
        show: true,
        title: 'Disable User',
        message: `<b>${selectData?.profile?.name}</b> successfully set to <b>Disable</b>`,
        onConfirm: () => {
          setAlertSuccess({
            show: false,
            title: '',
            message: '',
            onConfirm: () => {},
          })
          dispatch(defaultUserDisable());
          setSelectData({});
          getListData({
            keyword: filter?.keyword !== '' ? filter?.keyword : null,
            status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
            role: filter?.role?.value??null,
            page: 1,
            perPage: parseInt(perPage),
          })
        },
      })
    }

    if (!isLoading && isError) {
      setAlertConfirm({
        show: false,
        title: '',
        message: '',
        onCancel: () => {},
        onConfirm: () => {},
      })
      setAlertError({
        show: true,
        title: 'Disable User',
        message: errorMessage,
        onConfirm: () => {
          setAlertError({
            show: false,
            title: '',
            message: '',
            onConfirm: () => {},
          })
          dispatch(defaultUserDisable());
          setSelectData({});
          getListData({
            keyword: filter?.keyword !== '' ? filter?.keyword : null,
            status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
            role: filter?.role?.value??null,
            page: 1,
            perPage: parseInt(perPage),
          })
        },
      })
    }
  }, [userDisable]);

  useEffect(() => {
    let {
      isLoading,
      isSuccess,
      isError,
      errorMessage
    } = userResetPassword;

    if (!isLoading && isSuccess) {
      setAlertConfirm({
        show: false,
        title: '',
        message: '',
        onCancel: () => {},
        onConfirm: () => {},
      })
      setAlertSuccess({
        show: true,
        title: 'Reset Password',
        message: `<b>${selectData?.profile?.name}</b> successfully reset password`,
        onConfirm: () => {
          setAlertSuccess({
            show: false,
            title: '',
            message: '',
            onConfirm: () => {},
          })
          dispatch(defaultUserResetPassword());
          setSelectData({});
          getListData({
            keyword: filter?.keyword !== '' ? filter?.keyword : null,
            status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
            role: filter?.role?.value??null,
            page: 1,
            perPage: parseInt(perPage),
          })
        },
      })
    }

    if (!isLoading && isError) {
      setAlertConfirm({
        show: false,
        title: '',
        message: '',
        onCancel: () => {},
        onConfirm: () => {},
      })
      setAlertError({
        show: true,
        title: 'Reset Password',
        message: errorMessage,
        onConfirm: () => {
          setAlertError({
            show: false,
            title: '',
            message: '',
            onConfirm: () => {},
          })
          dispatch(defaultUserResetPassword());
          setSelectData({});
          getListData({
            keyword: filter?.keyword !== '' ? filter?.keyword : null,
            status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
            role: filter?.role?.value??null,
            page: 1,
            perPage: parseInt(perPage),
          })
        },
      })
    }
  }, [userResetPassword]);

  useEffect(() => {
    let {
      isLoading,
      isSuccess,
      isError,
      errorMessage
    } = userDelete;

    if (!isLoading && isSuccess) {
      setAlertConfirm({
        show: false,
        title: '',
        message: '',
        onCancel: () => {},
        onConfirm: () => {},
      })
      setAlertSuccess({
        show: true,
        title: 'Delete User',
        message: `<b>${selectData?.profile?.name}</b> successfully <b>Deleted</b>`,
        onConfirm: () => {
          setAlertSuccess({
            show: false,
            title: '',
            message: '',
            onConfirm: () => {},
          })
          dispatch(defaultUserDelete());
          setSelectData({});
          getListData({
            keyword: filter?.keyword !== '' ? filter?.keyword : null,
            status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
            role: filter?.role?.value??null,
            page: 1,
            perPage: parseInt(perPage),
          })
        },
      })
    }

    if (!isLoading && isError) {
      setAlertConfirm({
        show: false,
        title: '',
        message: '',
        onCancel: () => {},
        onConfirm: () => {},
      })
      setAlertError({
        show: true,
        title: 'Delete User',
        message: errorMessage,
        onConfirm: () => {
          setAlertError({
            show: false,
            title: '',
            message: '',
            onConfirm: () => {},
          })
          dispatch(defaultUserDelete());
          setSelectData({});
          getListData({
            keyword: filter?.keyword !== '' ? filter?.keyword : null,
            status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
            role: filter?.role?.value??null,
            page: 1,
            perPage: parseInt(perPage),
          })
        },
      })
    }
  }, [userDelete]);

  const getListData = (params) => {
    if (!userList?.isLoading) {
      let result = {
        keyword: params?.keyword ?? '',
        status: params?.status ?? '',
        role: params?.role ?? '',
        page: params?.page ?? 1,
        limit: params?.perPage ?? 10,
      }
      dispatch(getUserList(result));
    }
  }

  const onReset = () => {
    let resetParams = {
      keyword: null,
      status: {
        value: '',
        label: ''
      },
      role: {
        value: '',
        label: ''
      }
    }
    setCurrentPage('1');
    setFilter({...resetParams, keyword: ''});
    getListData({keyword: null, status: null, role: null, page: 1, perPage: parseInt(perPage)})
  }

  return (
    <div className="w-full h-full flex flex-col overflow-x-hidden hide-scroll">
      <BreadCrumb
        title={'User'}
        list={[
          {title: 'User', path: '', active: true},
        ]}
      />

      <div className="w-full h-fit flex flex-col bg-white shadow-lg rounded pb-16 desktop:pb-5">
        <DataTable
          isLoading={userList?.isLoading}
          data={userList?.data?.list}
          title={title}
          perPage={perPage}
          currentPage={currnetPage}
          showInfo={true}
          withNumber={true}
          showAddAction={true}
          addLabel={'Add User +'}
          onAdd={() => navigate('/user/add')}
          withAction={true}
          renderAction={(data) => (
            <div className="flex flex-row items-center justify-end gap-2">
              <Tooltip
                className="rounded px-2 py-1 bg-white text-sky-900 border border-sky-900 text-xs font-bold shadow-lg"
                content={"Open Detail"}
                placement="top"
                animate={{
                  mount: { scale: 1, y: 0 },
                  unmount: { scale: 0, y: 25 },
                }}
              >
                <span
                  className="w-fit h-fit px-2 py-1 rounded cursor-pointer bg-sky-600 text-white"
                  onClick={() => navigate(`/user/detail/${data?.id}`)}
                >
                  <i className="fa-solid fa-eye"></i>
                </span>
              </Tooltip>

              {data?.role !== 'admin' ? (
                <>
                {parseInt(data?.status) !== 1 && parseInt(data?.status) !== 3 ? (
                  <Tooltip
                    className="rounded px-2 py-1 bg-white text-sky-900 border border-sky-900 text-xs font-bold shadow-lg"
                    content={"Inactive"}
                    placement="top"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <span
                      className="w-fit h-fit px-2 py-1 rounded cursor-pointer bg-blue-600 text-white"
                      onClick={() => {
                        setSelectData(data)
                        setAlertConfirm({
                          show: true,
                          title: 'Inactive User',
                          message: `Will you set to <b>Inactive</b> for <b>${data?.profile?.name}</b>?`,
                          onCancel: () => {
                            setSelectData({});
                            setAlertConfirm({
                              show: false,
                              title: '',
                              message: '',
                              onCancel: () => {},
                              onConfirm: () => {},
                            });
                          },
                          onConfirm: () => dispatch(setUserInactive(data?.id)),
                        })
                      }}
                    >
                      <i className="fa-solid fa-user-xmark"></i>
                    </span>
                  </Tooltip>
                ) : null}
                
                {parseInt(data?.status) !== 2 ? (
                  <Tooltip
                    className="rounded px-2 py-1 bg-white text-sky-900 border border-sky-900 text-xs font-bold shadow-lg"
                    content={"Active"}
                    placement="top"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <span
                      className="w-fit h-fit px-2 py-1 rounded cursor-pointer bg-green-600 text-white"
                      onClick={() => {
                        setSelectData(data)
                        setAlertConfirm({
                          show: true,
                          title: 'Active User',
                          message: `Will you set to <b>Active</b> for <b>${data?.profile?.name}</b>?`,
                          onCancel: () => {
                            setSelectData({});
                            setAlertConfirm({
                              show: false,
                              title: '',
                              message: '',
                              onCancel: () => {},
                              onConfirm: () => {},
                            });
                          },
                          onConfirm: () => dispatch(setUserActive(data?.id)),
                        })
                      }}
                    >
                      <i className="fa-solid fa-user-check"></i>
                    </span>
                  </Tooltip>
                ) : null}
                
                {parseInt(data?.status) !== 3 ? (
                  <Tooltip
                    className="rounded px-2 py-1 bg-white text-sky-900 border border-sky-900 text-xs font-bold shadow-lg"
                    content={"Disable"}
                    placement="top"
                    animate={{
                      mount: { scale: 1, y: 0 },
                      unmount: { scale: 0, y: 25 },
                    }}
                  >
                    <span
                      className="w-fit h-fit px-2 py-1 rounded cursor-pointer bg-red-600 text-white"
                      onClick={() => {
                        setSelectData(data)
                        setAlertConfirm({
                          show: true,
                          title: 'Disable User',
                          message: `Will you set to <b>Disabled</b> for <b>${data?.profile?.name}</b>?`,
                          onCancel: () => {
                            setSelectData({});
                            setAlertConfirm({
                              show: false,
                              title: '',
                              message: '',
                              onCancel: () => {},
                              onConfirm: () => {},
                            });
                          },
                          onConfirm: () => dispatch(setUserDisable(data?.id)),
                        })
                      }}
                    >
                      <i className="fa-solid fa-user-large-slash"></i>
                    </span>
                  </Tooltip>
                  ) : null}

                <Tooltip
                  className="rounded px-2 py-1 bg-white text-sky-900 border border-sky-900 text-xs font-bold shadow-lg"
                  content={"Reset Password"}
                  placement="top"
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 25 },
                  }}
                >
                  <span
                    className="w-fit h-fit px-2 py-1 rounded cursor-pointer bg-orange-600 text-white"
                    onClick={() => {
                      setSelectData(data)
                        setAlertConfirm({
                          show: true,
                          title: 'Reset Password',
                          message: `Will you reset <b>${data?.profile?.name}</b> password?`,
                          onCancel: () => {
                            setSelectData({});
                            setAlertConfirm({
                              show: false,
                              title: '',
                              message: '',
                              onCancel: () => {},
                              onConfirm: () => {},
                            });
                          },
                          onConfirm: () => dispatch(setUserResetPassword(data?.id)),
                        })
                    }}
                  >
                    <i className="fa-solid fa-key"></i>
                  </span>
                </Tooltip>

                <Tooltip
                  className="rounded px-2 py-1 bg-white text-sky-900 border border-sky-900 text-xs font-bold shadow-lg"
                  content={"Remove"}
                  placement="top"
                  animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0, y: 25 },
                  }}
                >
                  <span
                    className="w-fit h-fit px-2 py-1 rounded cursor-pointer bg-red-600 text-white"
                    onClick={() => {
                      setSelectData(data)
                        setAlertConfirm({
                          show: true,
                          title: 'Delete User',
                          message: `Will you delete <b>${data?.profile?.name}</b> user?`,
                          onCancel: () => {
                            setSelectData({});
                            setAlertConfirm({
                              show: false,
                              title: '',
                              message: '',
                              onCancel: () => {},
                              onConfirm: () => {},
                            });
                          },
                          onConfirm: () => dispatch(setUserDelete(data?.id)),
                        })
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </span>
                </Tooltip>
                </>
              ) : null}
            </div>
          )}
          renderCustomFilter={() => (
            <div className="w-full flex flex-col mb-5">
              <span className="font-bold">Filter</span>
              <div className="w-full flex flex-col tablet:flex-row gap-2">
                <div className="w-full flex flex-col gap-1">
                  <span className="text-xs">Keyword</span>
                  <input
                    type={'text'}
                    className="w-full px-2 rounded h-[30px] text outline-none border border-sky-900 text-xs"
                    placeholder="Search by name, email, username or phone"
                    value={filter?.keyword}
                    onChange={(e) => setFilter({...filter, keyword: e?.currentTarget?.value})}
                  />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <span className="text-xs">Status</span>
                  <SelectOption
                    isLoading={false}
                    placeholder={'Select Status'}
                    options={[{label: 'Inactive', value: '1'}, {label: 'Active', value: '2'}, {label: 'Disabled', value: '3'}]}
                    objectLabel={'label'}
                    objectUniq={'value'}
                    value={filter?.status}
                    showClear={true}
                    onClear={(data) => setFilter({...filter, status: data})}
                    showSearch={false}
                    onChange={(data) => setFilter({...filter, status: data})}
                  />
                </div>
                <div className="w-full flex flex-col gap-1">
                  <span className="text-xs">Role</span>
                  <SelectOption
                    isLoading={false}
                    placeholder={'Select Role'}
                    options={[{label: 'Admin', value: 'admin'}, {label: 'Staff', value: 'staff'}]}
                    objectLabel={'label'}
                    objectUniq={'value'}
                    value={filter?.role}
                    showClear={true}
                    onClear={(data) => setFilter({...filter, role: data})}
                    showSearch={false}
                    onChange={(data) => setFilter({...filter, role: data})}
                  />
                </div>
                <div className="w-full tablet:w-fit flex flex-col gap-1">
                  <span className="text-xs hidden tablet:block">&nbsp;</span>
                  <div
                    className="cursor-pointer w-full tablet:w-fit h-full flex items-center justify-center text-white border border-sky-900 bg-sky-900 rounded px-4"
                    onClick={() => {
                      setCurrentPage('1');
                      getListData({
                        keyword: filter?.keyword !== '' ? filter?.keyword : null,
                        status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
                        role: filter?.role?.value??null,
                        page: 1,
                        perPage: parseInt(perPage),
                      })
                    }}>Filter</div>
                </div>
                <div className="w-full tablet:w-fit flex flex-col gap-1" onClick={() => onReset()}>
                  <span className="text-xs hidden tablet:block">&nbsp;</span>
                  <div className="cursor-pointer w-full tablet:w-fit h-full flex items-center justify-center text-sky-900 border border-sky-900 rounded px-4">Reset</div>
                </div>
              </div>
            </div>
          )}
          onChangePerPage={(data) => {
            setPerPage(data)
            setCurrentPage('1');
            getListData({
              keyword: filter?.keyword !== '' ? filter?.keyword : null,
              status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
              role: filter?.role?.value??null,
              page: 1,
              perPage: parseInt(data),
            })
          }}
          onChangePage={(data) => {
            setCurrentPage(data);
            getListData({
              keyword: filter?.keyword !== '' ? filter?.keyword : null,
              status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
              role: filter?.role?.value??null,
              page: parseInt(data),
              perPage: parseInt(perPage),
            })
          }}
          onPrevPage={(data) => {
            setCurrentPage(data);
            getListData({
              keyword: filter?.keyword !== '' ? filter?.keyword : null,
              status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
              role: filter?.role?.value??null,
              page: parseInt(data),
              perPage: parseInt(perPage),
            })
          }}
          onNextPage={(data) => {
            setCurrentPage(data);
            getListData({
              keyword: filter?.keyword !== '' ? filter?.keyword : null,
              status: filter?.status?.value ? parseInt(filter?.status?.value) : null,
              role: filter?.role?.value??null,
              page: parseInt(data),
              perPage: parseInt(perPage),
            })
          }}
        />
      </div>

      <Alert
        show={alertConfirm?.show}
        type="question"
        isLoading={userInactive?.isLoading || userActive?.isLoading || userDisable?.isLoading || userResetPassword?.isLoading || userDelete?.isLoading}
        title={alertConfirm?.title}
        message={alertConfirm?.message}
        showCancelButton={true}
        onCancel={() => alertConfirm?.onCancel ? alertConfirm.onCancel() : {}}
        onConfirm={() => alertConfirm?.onConfirm ? alertConfirm.onConfirm() : {}}
      />

      <Alert
        show={alertSuccess?.show}
        type="success"
        title={alertSuccess?.title}
        message={alertSuccess?.message}
        onConfirm={() => alertSuccess?.onConfirm ? alertSuccess.onConfirm() : {}}
      />

      <Alert
        show={alertError?.show}
        type="warning"
        title={alertError?.title}
        message={alertError?.message}
        onConfirm={() => alertError?.onConfirm ? alertError.onConfirm() : {}}
      />
    </div>
  )
}

export default User;