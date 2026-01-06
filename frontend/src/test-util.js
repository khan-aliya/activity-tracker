import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const customRender = (ui, options = {}) => {
  return {
    ...render(ui, options),
    user: userEvent.setup(),
  };
};

export * from '@testing-library/react';
export { customRender as render };