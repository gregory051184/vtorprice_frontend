import React from 'react';
import { NewApplicationPage } from '@box/pages/new-application';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();
  const tabId = Number(router.query.tab) || 0;
 
  return (
    <NewApplicationPage tab={tabId} />
  );
};

export default Index;