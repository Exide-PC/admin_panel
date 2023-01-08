import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout/Layout';
import Maintenance from './components/Maintenance/Maintenance';
import NzxtPage from './components/Nzxt/NzxtPage';
import Logs from './components/Journal/Logs';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/nzxt-color" element={<NzxtPage />} />
                <Route path="/" element={<Navigate to="nzxt-color" />} />
            </Routes>
        </Layout>
  )
}

export default App;
