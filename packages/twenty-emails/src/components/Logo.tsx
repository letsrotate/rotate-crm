import { Img } from 'react-email';

const logoStyle = {
  marginBottom: '40px',
};

export const Logo = () => {
  return (
    <Img
      src="https://crm.letsrotate.com/images/rotate/rotate-mark-150.png"
      alt="Rotate CRM logo"
      width="40"
      height="40"
      style={logoStyle}
    />
  );
};
