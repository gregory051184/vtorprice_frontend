import React from 'react';
import { AppShell } from '@box/layouts';
import { Header } from '@box/widgets/header';
import { Footer } from '@box/widgets/footer';
import { Container } from '@box/shared/ui';
import ErrorBanner from '@assets/images/error-banner.png';
import Image from 'next/image';
import { NotAuthAlert } from '@box/entities/notAuthAlert/ui';

const Index = () => (
  <AppShell
    header={<Header />}
    footer={<Footer />}
  >
    <Container className="flex flex-col items-center gap-[20px]">
      <div className="relative w-[120px] h-[120px]">
        <Image fill src={ErrorBanner.src} alt="Need authorization" />

      </div>
      <h1 className="text-center text-2xl">Авторизуйтесь для доступа к данному ресурсу</h1>
    </Container>
    <NotAuthAlert/>
  </AppShell>
);

export default Index;
