import { useCallback, useState } from 'react';

export function useFormSheet() {
  const [visible, setVisible] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const open = useCallback(() => {
    setFormKey((key) => key + 1);
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  return { visible, formKey, open, close };
}
