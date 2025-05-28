import {AppShell} from "@mantine/core";
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import Head from "next/head";
import {SidebarLayout} from "@box/layouts";
import {RecyclableCompaniesList} from "@box/widgets/generate-list-of-offers";
import {BackButton, Container} from "@box/shared/ui";


export const GenerateListOfOffers = () => (
    <AppShell
        header={<Header/>}
        footer={<Footer/>}
    >
        <Head>
            <title>Генерировать предложения</title>
        </Head>
        <Container className="pt-[0px]">
            <div>
                <BackButton className='mb-[10px] text-sm'/>
            </div>
            <SidebarLayout>
                <RecyclableCompaniesList/>
            </SidebarLayout>
        </Container>
    </AppShell>
)