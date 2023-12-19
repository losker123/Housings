import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Main from "./pages/MainPage";
import About from "./pages/About";
import Create from "./pages/CreateHousing";
import { ABOUT_ROUTE, ADMIN_ROUTE, CREATEHOUSING_ROUTE, HOUSING_ROUTE, LOGIN_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE, USERPROFILE_ROUTE } from "./utils/consts";
import HousingPage from "./pages/HousingPage";
import UserProfile from "./pages/UserProfile";

export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: CREATEHOUSING_ROUTE,
        Component: Create 
    },
    {
        path: USERPROFILE_ROUTE,
        Component: UserProfile
    },
];

export const publicRoutes = [
    {
        path: ABOUT_ROUTE,
        Component: About
    },
    {
        path: MAIN_ROUTE,
        Component: Main
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: HOUSING_ROUTE + '/:id',
        Component: HousingPage
    },
];