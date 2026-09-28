import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar/Navbar';
import { Header } from './components/Header/Header';
import { Landing } from './pages/Landing/Landing';
import { Home } from './pages/Home/Home';
import { Search } from './pages/Search/Search';
import { OfferRide } from './pages/OfferRide/OfferRide';
import { RideDetail } from './pages/RideDetail/RideDetail';
import { MyRides } from './pages/MyRides/MyRides';
import { Profile } from './pages/Profile/Profile';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';

const Layout = () => (
  <div className="min-h-screen bg-[var(--color-rc-offWhite)] selection:bg-[var(--color-rc-purple-200)] selection:text-black pb-32 pt-[72px]">
    <Header />
    <main>
      <Outlet />
    </main>
    <Navbar />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/rides" element={<Search />} />
          <Route path="/search" element={<Search />} />
          <Route path="/offer" element={<OfferRide />} />
          <Route path="/my-rides" element={<MyRides />} />
          <Route path="/rides/:id" element={<RideDetail />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
