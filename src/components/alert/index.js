const Alert = (props) => {
  let {
    isLoading,
    show,
    type,
    title,
    message,
    showCancelButton,
    cancelLabel,
    onCancel,
    confirmLabel,
    onConfirm,
  } = props;

  const renderIconType = () => {
    switch(type) {
      case 'warning':
        return <div className="w-full flex items-center justify-center text-center text-6xl text-yellow-500"><i className="fa-solid fa-triangle-exclamation"></i></div>;
      case 'danger':
        return <div className="w-full flex items-center justify-center text-center text-6xl text-red-500"><i className="fa-solid fa-land-mine-on"></i></div>;
      case 'delete':
        return <div className="w-full flex items-center justify-center text-center text-6xl text-red-500"><i className="fa-solid fa-trash"></i></div>;
      case 'info':
        return <div className="w-full flex items-center justify-center text-center text-6xl text-blue-500"><i className="fa-solid fa-circle-info"></i></div>
      case 'question':
        return <div className="w-full flex items-center justify-center text-center text-6xl text-blue-500"><i className="fa-solid fa-circle-question"></i></div>
      default:
        return <div className="w-full flex items-center justify-center text-center text-6xl text-green-500"><i className="fa-solid fa-circle-check"></i></div>
    }
  }

  const renderCancelButton = () => {
    if (showCancelButton) {
      return (
        <div
          className={`tablet:w-1/2 w-full ${isLoading ? 'cursor-default' : 'cursor-pointer'} border ${isLoading ? 'border-gray-400' : 'border-sky-900'} ${isLoading ? 'text-gray-400' : 'text-sky-900'} bg-white rounded p-2 flex items-center justify-center text-center whitespace-nowrap`}
          onClick={() => {
            if (onCancel && !isLoading) {
              return onCancel()
            } else {
              return {}
            }
          }}
        >{isLoading ? 'Loading...' : cancelLabel??'Cancel'}</div>
      )
    }
  }

  return (
    <div className={`w-screen h-screen fixed top-0 left-0 z-[100] ${show ? 'flex' : 'hidden'} items-center justify-center text-sky-900`}>
      <div className="w-full h-full flex items-center justify-center relative p-5">
        <div className="w-full h-full absolute top-0 left-0 bg-black opacity-50"></div>
        <div className="tablet:w-[500px] w-full h-fit max-h-[500px] bg-white rounded p-5 z-[1] shadow-lg flex flex-col gap-5">
          {renderIconType()}
          <span className="w-full flex items-center justify-center font-bold text-center">{title}</span>
          <div className="w-full text-center mb-5 overflow-y-scroll" dangerouslySetInnerHTML={{ __html: message?.replace('className', 'class') }} />
          <div className="w-full flex flex-col justify-center tablet:flex-row gap-5">
            {renderCancelButton()}
            <div
              className={`tablet:w-1/2 w-full ${isLoading ? 'cursor-default' : 'cursor-pointer'} border  ${isLoading ? 'border-gray-400' : 'border-sky-900'} ${isLoading ? 'bg-gray-400' : 'bg-sky-900'} text-white rounded p-2 flex items-center justify-center text-center whitespace-nowrap shadow-lg`}
              onClick={() => {
                if (onConfirm && !isLoading) {
                  return onConfirm()
                } else {
                  return {}
                }
              }}
            >{isLoading ? 'Loading...' : confirmLabel??'Confirm'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Alert;