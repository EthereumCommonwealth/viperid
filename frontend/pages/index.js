import React from 'react';
import { Provider } from 'react-redux';
import IndexComponent from '../components/indexComponent';
import configureStore from '../store';

const store = configureStore();

class Index extends React.Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <IndexComponent />
        </Provider>
      </div>
    );
  }
}

export default Index;
