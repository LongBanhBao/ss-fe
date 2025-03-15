import React from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Coder from "./pages/Coder/Coder";
import CreateExercise from "./pages/CreateExercise/CreateExercise";
import EditExercise from "./pages/EditExercise/EditExercise";
import Exercise from "./pages/Exercise/Exercise";
import ExerciseDetail from "./pages/ExerciseDetail/ExerciseDetail";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import Home from "./pages/Home/Home";
import ListExercise from "./pages/ListExercise/ListExercise";
import Login from "./pages/Login/Login";
import ProfileUser from "./pages/Profile/ProfileStudent";
import Register from "./pages/Register/Register";
import SXChenK from "./pages/SXChenK/SXChenK";
import SXChon from "./pages/SXChon/SXChon";
import SXNoiBot from "./pages/SXNoiBot/SXNoiBot";
import TKNP from "./pages/TKNP/TKNP";
import TKTT from "./pages/TKTT/TKTT";
import UpdateProfile from "./pages/UpdateProfile/UpdateProfile";

const App: React.FC = () => {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tktt" element={<TKTT />} />
        <Route path="/tknp" element={<TKNP />} />
        <Route path="/sx-chon" element={<SXChon />} />
        <Route path="/sx-chen" element={<SXChenK />} />
        <Route path="/sx-noi-bot" element={<SXNoiBot />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile/:id" element={<ProfileUser />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />

          <Route path="/list-exercise" element={<ListExercise />} />
          <Route path="/exercise/:id" element={<Exercise />} />
          <Route path="/exercise-detail/:id" element={<ExerciseDetail />} />
          <Route path="/create-exercise" element={<CreateExercise />} />
          <Route path="/edit-exercise/:id" element={<EditExercise />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/coder" element={<Coder />} />
      </Routes>
    </MainLayout>
  );
};

export default App;
