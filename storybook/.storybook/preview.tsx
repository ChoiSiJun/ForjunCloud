import type { Preview } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import { appTheme } from '../../package/home/src/ui-kit/app/themes/appTheme';
import { store } from '../../package/home/src/store/ReduxStoreConfig';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <Provider store={store}>
        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <Story />
        </ThemeProvider>
      </Provider>
    ),
  ],
};

export default preview;

