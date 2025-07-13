import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

type Props = {
  value: string;
};

const QRCodeComponent: React.FC<Props> = ({ value }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      <QRCodeCanvas value={value} size={200} />
    </div>
  );
};

export default QRCodeComponent;