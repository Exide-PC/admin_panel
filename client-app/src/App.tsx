import { Navigate, Route, Routes } from 'react-router';
import Layout from './components/Layout/Layout';
import NzxtColor from './components/NzxtColor/NzxtColor';

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/nzxt-color" element={<NzxtColor />} />
                <Route path="/" element={<Navigate to="nzxt-color" />} />
            </Routes>
        </Layout>
  )
}

export default App;
