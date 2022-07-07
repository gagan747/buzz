/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable import/no-cycle */
import { createContext, useState } from 'react';
import Suggestions from './Suggestions';
import Friends from './Friends';

const friendContext = createContext();
export { friendContext };

export default function FriendsContext() {
  const [rerender, setRerender] = useState(false);
  const forceRender = () => setRerender(!rerender);

  return (
    <friendContext.Provider value={{ forceRender, rerender }}>
      <Friends />
      <Suggestions />
    </friendContext.Provider>
  );
}
