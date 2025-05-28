import {SpecialApplicationCreateForm} from "@box/widgets/special-applications";
import {Header} from "@box/widgets/header";
import {Footer} from "@box/widgets/footer";
import {BackButton, Container, Paper, Tip} from "@box/shared/ui";
import React from "react";
import {AppShell} from "@box/layouts";
import classNames from "classnames";
import s from "@box/pages/new-application/style.module.scss";
import {NotAuthAlert} from "@box/entities/notAuthAlert/ui";


export const SpecialApplicationCreate = () => {
    return (
        <AppShell
            header={<Header/>}
            footer={<Footer/>}
        >
            <Container className="mt-[28px]">
                <BackButton/>
                <div className={classNames('items-center gap-6 mt-5', s.head)}>
                    <h1 className="font-normal text-2xl mb-6">Создать платное объявление </h1>
                    <Tip className="gap-[20]">
                        Обратите внимание, данное объявление для публикации в слайдере на каждой странице предложения
                    </Tip>
                    <Paper className="mt-[28px]">
                    <SpecialApplicationCreateForm></SpecialApplicationCreateForm>
                    </Paper>
                </div>
            </Container>
            <NotAuthAlert/>
        </AppShell>
    )
}