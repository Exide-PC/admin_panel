import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout/Layout';
import Maintenance from './components/Maintenance/Maintenance';
import NzxtPage from './components/Nzxt/NzxtPage';
import Logs from './components/Journal/Logs';
import Notes from './components/Notes/Notes';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/nzxt-color" element={<NzxtPage />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/" element={<Navigate to="nzxt-color" />} />
            </Routes>
        </Layout>
  )
}

export default App;
