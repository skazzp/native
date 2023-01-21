import useCachedResources from './hooks/useCachedResources';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import Main from './components/Main';

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  }

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
