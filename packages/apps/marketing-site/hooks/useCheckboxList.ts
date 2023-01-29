import { includes, remove } from 'lodash';
import { Dispatch, SetStateAction, useState } from 'react';

type UseCheckboxListData = {
  checked: string[];
  handleChange: (id: string) => void;
  isChecked: (id: string) => boolean;
  setChecked: Dispatch<SetStateAction<string[]>>;
  removeItem: (id: string) => void;
  addItem: (id: string) => void;
};

type Props = {
  defaultChecked?: string[];
  onChecked?: ((id: string) => void) | ((id: string) => Promise<void>);
  onUnchecked?: ((id: string) => void) | ((id: string) => Promise<void>);
};

const useCheckboxList = ({ defaultChecked, onChecked, onUnchecked } = {} as Props): UseCheckboxListData => {
  const [checked, setChecked] = useState(defaultChecked || []);

  const isChecked = (id: string) => includes(checked, id);

  const addItem = (id: string) => {
    const newChecked = [...checked];

    newChecked.push(id);

    setChecked(newChecked);
  };

  const removeItem = (id: string) => {
    const newChecked = [...checked];

    remove(newChecked, c => c === id);

    setChecked(newChecked);
  };

  const handleOnChecked = async (id: string) => {
    try {
      await onChecked?.(id);
    } catch (error) {
      removeItem(id);
    }
  };

  const handleOnUnchecked = async (id: string) => {
    try {
      await onUnchecked?.(id);
    } catch (error) {
      addItem(id);
    }
  };

  const handleChange = (id: string) => {
    if (isChecked(id)) {
      removeItem(id);

      if (onUnchecked) {
        handleOnUnchecked(id);
      }
    } else {
      addItem(id);

      if (onChecked) {
        handleOnChecked(id);
      }
    }
  };

  return {
    checked,
    handleChange,
    isChecked,
    setChecked,
    removeItem,
    addItem,
  };
};

export default useCheckboxList;
