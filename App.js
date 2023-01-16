import useCachedResources from './hooks/useCachedResources';
import { store } from './redux/store';
import { Provider } from 'react-redux';
import Main from './components/Main';

export default function App() {
  const isLoadingComplete = useCachedResources();
  if (!isLoadingComplete) {
    return null;
  }
  // // const routing = useRouter(false);

  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}
