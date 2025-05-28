import {AxiosResponse} from "axios";
import {$authHost} from "@box/shared/api";
import {Paginationable} from "@types";
import {IEquipmentProposal} from "@box/entities/equipment_proposal";


type EquipmentProposalCreateParams = {
    sender_company: number;
    companies: Array<number>;
    applications: Array<number>;
};

type EquipmentProposalUpdateParams = {
    application_id?: number;
    company_id?: number;
}

type EquipmentProposalsGetParams = {
    id?: number
    sender_company?: number;
    createdAt?: string;

}


export type SendCompanyEquipmentProposalsByEmail = {
    proposals: Array<number>
}


class EquipmentProposalApi {

    createEquipmentProposal(equipmentProposalCreateParams: EquipmentProposalCreateParams):
        Promise<AxiosResponse<IEquipmentProposal>> {
        return $authHost.post('/company_equipment_proposals/', equipmentProposalCreateParams, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    getEquipmentProposals(params: Partial<EquipmentProposalsGetParams>):
        Promise<AxiosResponse<{
            results: Array<IEquipmentProposal>
        } & Paginationable>> {
        return $authHost.get('/company_equipment_proposals/', {
            params
        });
    };

    getEquipmentProposal(id: number):
        Promise<AxiosResponse<IEquipmentProposal>> {
        console.log(id)
        return $authHost.get(`/company_equipment_proposals/${id}/`);
    };

    getEquipmentProposalForCompanies(special_id: string):
        Promise<AxiosResponse<IEquipmentProposal>> {
        return $authHost.get(`/company_equipment_proposals/${special_id}/companies/`);
    };

    deleteEquipmentProposal(id: number): Promise<AxiosResponse<IEquipmentProposal>> {
        return $authHost.delete(`/company_equipment_proposals/${id}/`);
    };

    updateEquipmentProposal(data: Partial<EquipmentProposalUpdateParams> & {
        id: number
    }):
        Promise<AxiosResponse<IEquipmentProposal>> {
        const {id, ...params} = data
        return $authHost.patch(`/company_equipment_proposals/${id}/`, params)
    };

    send_company_equipment_proposals_by_email(proposals: SendCompanyEquipmentProposalsByEmail): Promise<AxiosResponse<SendCompanyEquipmentProposalsByEmail>> {
        return $authHost.post('/company_equipment_proposals/send_company_equipment_proposals_by_email/', proposals)
    };

    send_company_equipment_proposals_by_whatsapp(proposals: SendCompanyEquipmentProposalsByEmail): Promise<AxiosResponse<SendCompanyEquipmentProposalsByEmail>> {
        return $authHost.post('/company_equipment_proposals/send_company_equipment_proposals_by_whatsapp/', proposals)
    };

    send_company_equipment_proposals_by_telegram(proposals: SendCompanyEquipmentProposalsByEmail): Promise<AxiosResponse<SendCompanyEquipmentProposalsByEmail>> {
        return $authHost.post('/company_equipment_proposals/send_company_equipment_proposals_by_telegram/', proposals)
    };

}

export const equipmentProposalApi = new EquipmentProposalApi();