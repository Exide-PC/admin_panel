import * as React from "react";
import { useEffect } from "react";
import { Button, Container, FormGroup, InputGroup } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getAppState } from "../../features/app/app-selectors";
import { Toaster } from "react-hot-toast";
import LoginPopup from '../Login/LoginPopup';
import { appActions } from "../../features/app/app-logic";
import { AppStateEnum } from "../../features/app/app-slice";
import { useNavigate } from "react-router";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {

    const dispatch = useAppDispatch();
    const appState = useAppSelector(getAppState);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(appActions.initApp())
    }, [dispatch]);

    const handleLogin = async (token: string) => {
        await dispatch(appActions.initApp(token));
    }

    switch (appState) {
        case AppStateEnum.Initial: {
            return <></> // TODO loading indication
        }
        case AppStateEnum.ServerDown: {
            return (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <h1>Server is down, please get back later</h1>
                </div>
            )
        }
        case AppStateEnum.Unathorized: {
            return <LoginPopup onSubmit={handleLogin}/>
        }
        case AppStateEnum.Initialized: {
            return (
                <Container>
                    <FormGroup>
                        <InputGroup>
                            <Button onClick={() => navigate('/maintenance')} size='sm' color="primary" outline>
                                Maintenance
                            </Button>
                            <Button onClick={() => navigate('/logs')} size='sm' color="primary" outline>
                                Logs
                            </Button>
                            <Button onClick={() => navigate('/nzxt-color')} size='sm' color="primary" outline>
                                Nzxt
                            </Button>
                        </InputGroup>
                    </FormGroup>
                    <Toaster position="bottom-left"/>
                    {children}
                </Container>
            )
        }
        default: {
            const typeguard: never = appState;
            throw new Error(`Unknown application state: ${typeguard}`)
        }
    }
}

export default Layout;