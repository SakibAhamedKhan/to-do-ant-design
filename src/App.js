import './App.css';
import 'antd/dist/antd.css';
import { ConfigProvider, DatePicker } from 'antd';
import Todo from './components/Todo';
import en_GB from 'antd/lib/locale/en_GB';
function App() {
  return (
    <ConfigProvider locale={en_GB}>
      <div className="App">
        <Todo></Todo>
      </div>
    </ConfigProvider>

  );
}

export default App;
