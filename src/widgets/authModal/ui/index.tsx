import { PhoneForm, CodeForm } from '@box/features';
import { Button, Modal } from '@box/shared/ui';
import { Stepper } from '@box/shared/ui/stepper';
import { useEvent, useStore } from 'effector-react';
import { useField } from '@box/shared/effector-form-controller/hooks';
import React from 'react';
import {
  $authStep, $showAuthModal, setAuthStep, setShowAuthModal 
} from '../model';
import { isBackField } from '@box/features/auth/phone_form/model';

export const AuthModal = () => {
  const showModal = useStore($showAuthModal);
  const authStep = useStore($authStep);
  const setShowModal = useEvent(setShowAuthModal);
  const setStep = useEvent(setAuthStep);
  const isBack = useField(isBackField);

  return (
    <Modal visible={showModal} close={() => setShowModal(false)}>
      <Stepper currentStep={authStep}>
        <Stepper.Step>
          <PhoneForm />
        </Stepper.Step>
        <Stepper.Step>
          <CodeForm
            actions={(
              <Button onClick={() => {
                isBack.onChange(true);
                setStep(1);
              }} mode="light" fullWidth>
                Вернуться назад
              </Button>
            )}
          />
        </Stepper.Step>
      </Stepper>
    </Modal>
  );
};
