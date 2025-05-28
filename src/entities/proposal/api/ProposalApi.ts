import {AxiosResponse} from "axios";
import {IProposal} from "@box/entities/proposal";
import {$authHost} from "@box/shared/api";
import {Paginationable} from "@types";


type ProposalCreateParams = {
    sender_company: number;
    companies: Array<number>;
    applications: Array<number>;
};

type ProposalUpdateParams = {
    application_id?: number;
    company_id?: number;
}

type ProposalsGetParams = {
    id?: number
    sender_company?: number;
    createdAt?: string;

}


export type SendCompanyProposalsByEmail = {
    proposals: Array<number>
}


class ProposalApi {

    createProposal(proposalCreateParams: ProposalCreateParams):
        Promise<AxiosResponse<IProposal>> {
        return $authHost.post('/company_proposals/', proposalCreateParams, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    getProposals(params: Partial<ProposalsGetParams>):
        Promise<AxiosResponse<{
            results: Array<IProposal>
        } & Paginationable>> {
        return $authHost.get('/company_proposals/', {
            params
        });
    };

    getProposal(id: number):
        Promise<AxiosResponse<IProposal>> {
        console.log(id)
        return $authHost.get(`/company_proposals/${id}/`);
    };

    getProposalForCompanies(special_id: string):
        Promise<AxiosResponse<IProposal>> {
        return $authHost.get(`/company_proposals/${special_id}/companies/`);
    };

    deleteProposal(id: number): Promise<AxiosResponse<IProposal>> {
        return $authHost.delete(`/company_proposals/${id}/`);
    };

    updateProposal(data: Partial<ProposalUpdateParams> & {
        id: number
    }):
        Promise<AxiosResponse<IProposal>> {
        const {id, ...params} = data
        return $authHost.patch(`/company_proposals/${id}/`, params)
    };

    send_company_proposals_by_email(proposals: SendCompanyProposalsByEmail): Promise<AxiosResponse<SendCompanyProposalsByEmail>> {
        return $authHost.post('/company_proposals/send_company_proposals_by_email/', proposals)
    };

    send_company_proposals_by_whatsapp(proposals: SendCompanyProposalsByEmail): Promise<AxiosResponse<SendCompanyProposalsByEmail>> {
        return $authHost.post('/company_proposals/send_company_proposals_by_whatsapp/', proposals)
    };

    send_company_proposals_by_telegram(proposals: SendCompanyProposalsByEmail): Promise<AxiosResponse<SendCompanyProposalsByEmail>> {
        return $authHost.post('/company_proposals/send_company_proposals_by_telegram/', proposals)
    };

}

export const proposalApi = new ProposalApi();