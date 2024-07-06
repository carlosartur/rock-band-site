import { CFormInput } from '@coreui/react';
import { IMaskMixin } from 'react-imask';

export const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }) => {
  return <CFormInput {...props} ref={inputRef} />;
});
