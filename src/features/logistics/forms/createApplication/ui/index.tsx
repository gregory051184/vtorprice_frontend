import React from 'react';
import { IWithClass } from '@types';
import { CreateTransportApplicationTemplate } from '@box/entities/logistics/ui/templates';
import { useRouter } from 'next/router';
import { useGate } from 'effector-react';
import {
  form, gate, equipmentGate, equipmentForm
} from '../model';

export const CreateTransportApplicationForm: React.FC<IWithClass> = ({
  className
}) => {
  const router = useRouter();

  if (!!router.query['from-deal']) {
    useGate(gate, {
      dealId: router.query['from-deal'] as string || null
    });
  } else {
    useGate(equipmentGate, {
      equipmentDealId: router.query['from-equipment-deal'] as string || null
    });
  }

  return (
    <CreateTransportApplicationTemplate
      form={(!!router.query['from-deal'] || (!router.query['from-deal'] && !router.query['from-equipment-deal']))  ? form : equipmentForm}
      className={className}
    />
  );
};
