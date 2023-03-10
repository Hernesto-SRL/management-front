import React from 'react';
import {ColorModeContext, useMode} from "./theme";
import {CssBaseline, ThemeProvider} from "@mui/material";
import Navbar from "./components/Navbar";
import {Route, Routes} from "react-router-dom";
import {NotificationsProvider} from "./Notifications";
import "react-notifications/lib/notifications.css"
import {QueryClient, QueryClientProvider} from "react-query";
import {Provider as ReduxProvider} from "react-redux";
import {appReduxStore} from "./reduxStore";
import {UserRole} from "./hooks/useUserInfo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin/Admin";
import RequireAuth from "./components/RequireAuth";
import Control from "./pages/Control/Control";

const App = () => {
  const [theme, colorMode] = useMode();
  const client = new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false }}});

  return (
    <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <QueryClientProvider client={client}>
            <ReduxProvider store={appReduxStore}>
                <div className="app">
                  <Navbar/>
                  <main className="content">
                          <NotificationsProvider/>
                          <Routes>
                              {/* PUBLIC ROUTES */}
                              <Route path="/login" element={<Login/>}/>
                              <Route path="/register" element={<Register/>}/>

                              {/* ANY ROLE ROUTES */}
                              <Route element={<RequireAuth allowedRoles={UserRole.User}/>}>
                                  <Route path="/profile" element={<Profile/>}/>
                              </Route>

                              {/* ADMIN ROUTES */}
                              <Route element={<RequireAuth allowedRoles={UserRole.Admin}/>}>
                                  <Route path="/admin" element={<Admin/>}/>
                                  <Route path="/control/*" element={<Control/>}/>
                              </Route>

                              <Route path="*" element={<Home/>}/>
                          </Routes>
                  </main>
                </div>
            </ReduxProvider>
            </QueryClientProvider>
        </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
