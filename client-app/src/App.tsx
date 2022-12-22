import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout/Layout';
import Maintenance from './components/Maintenance/Maintenance';
import NzxtColor from './components/NzxtColor/NzxtColor';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/maintenance" element={<Maintenance />} />
                <Route path="/nzxt-color" element={<NzxtColor />} />
                <Route path="/" element={<Navigate to="nzxt-color" />} />
            </Routes>
        </Layout>
  )
}

export default App;
