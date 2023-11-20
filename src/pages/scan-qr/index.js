import React, { useState, useRef, useEffect } from "react";
import QrReader from 'react-qr-scanner';

import { getWindowDimensions } from './../../helper';

import BreadCrumb from "../../components/breadcrumb";
import Alert from '../../components/alert';

const ScanQr = () => {
  const [canScan, setCanScan] = useState(true);
  const [dataScan, setDataScan] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorsAlert, setShowErrorsAlert] = useState(false);
  const [errorMessageScan, setErrorMessageScan] = useState('');
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
  const [cameraStyle, setCameraStyle] = useState({width: 0, height: 0})
  const ref = useRef();

  useEffect(() => {
    const handleResize = () => setWindowDimensions(getWindowDimensions())
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (windowDimensions?.width > 0 && windowDimensions?.width <= 639) {
      setCameraStyle({width: 150, height: 150});
    } else if (windowDimensions?.width > 639) {
      setCameraStyle({width: 500, height: 500});
    }

  }, [windowDimensions])

  return (
    <div className="w-full h-full flex flex-col">
      <BreadCrumb
        title={'Scan Qr'}
        list={[
          {title: 'Scan Qr', path: '', active: true},
        ]}
      />

      <div ref={ref} className="w-full h-fit flex flex-col p-5 rounded shadow-lg gap-5 relative bg-white">
        
        <div className="w-full h-fit tablet:h-[400px] flex items-center justify-center">
          <QrReader
            delay={5000}
            style={cameraStyle}
            onError={(error) => {
              if (canScan) {
                setCanScan(false);
                setErrorMessageScan(`Failed scan QR: ${error}`)
                setShowErrorsAlert(true);
              }
            }}
            onScan={(data) => {
              if (canScan && data) {
                setCanScan(false);
                setDataScan(data?.text);
                setShowSuccessAlert(true);
              }
            }}
          />
        </div>
        <div className="flex flex-col items-center justify-center text-sm tablet:text-xl gap-2 desktop:gap-5">
          <div className="flex items-center justify-center text-center">Scan your Qr code here</div>
          <div className="flex items-center justify-center text-center">Or manually sign on a signature book</div>

        </div>
      </div>

      <Alert
        show={showSuccessAlert}
        type="success"
        title="Success"
        message={`Thanks for comming<br>(<b class="text-sm">${dataScan}</b>)<br><span class="text-xs">Tap confirm to close<span>`}
        showCancelButton={false}
        onConfirm={() => window.location.reload()}
      />

        <Alert
        show={showErrorsAlert}
        type="warning"
        title="Warning"
        message={errorMessageScan}
        showCancelButton={false}
        onConfirm={() => window.location.reload()}
      />
    </div>
  );
};

export default ScanQr;
