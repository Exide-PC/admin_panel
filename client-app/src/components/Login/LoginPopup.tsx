import React, {useState} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, FormGroup, FormFeedback, } from 'reactstrap';

interface Props {
    onSubmit: (token: string) => Promise<void>;
}

const LoginPopup = ({ onSubmit }: Props) => {

    const [token, setToken] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = async () => {
        try {
            await onSubmit(token);
        }
        catch (e: any) {
            setError(e.message)
        }
    }

    return (
        <div>
            <Modal
                isOpen={true}
                centered={true}
                backdrop={true}
                fade={false}
            >
                <ModalHeader>Log In</ModalHeader>
                    <ModalBody>
                        <FormGroup floating>
                            <Input
                                id="token"
                                type="password"
                                placeholder="Access token"
                                onChange={e => setToken(e.target.value)}
                                invalid={!!error}
                            />
                            <Label for="token">Enter access token</Label>
                            <FormFeedback>
                                {error}
                            </FormFeedback>
                        </FormGroup>
                    </ModalBody>
                <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>
                    Activate
                </Button>{' '}
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default LoginPopup;