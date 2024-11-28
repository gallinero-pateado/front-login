import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components_login/layout'; // Layout para login
import Login from './components_login/login'; //Login para estudiante
import Register from './components_login/register'; //Register para estudiante
import LoginEm from './components_login/login_em'; //Login para empresa
import RegisterEm from './components_login/register_em'; //Register para empresa
import CompleteProfile from './components_login/complete_profile';
import PasswordResetForm from './components_login/password_recovery';
import CompleteProfileEmpresa from './components_login/complete_profile_em';


import MainPage from './components_unificacion/unificacion';


const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas con el primer Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="login_em" element={<LoginEm />} />
          <Route path="register_em" element={<RegisterEm />} />
          <Route path="complete_profile" element={<CompleteProfile />} />
          <Route path="password_recovery" element={<PasswordResetForm />} />
          <Route path="complete_profile_em" element={<CompleteProfileEmpresa />} />



        </Route>

        {/* Rutas con el Layout3 */}

        <Route path="/unificacion" element={<MainPage />} />

      </Routes>
    </Router>
  );
}

export default App;
