import { Province } from './province.model';

export interface RegionDetail {
    id: number;
    code: string;
    name: string;
    provinces: Province[];
}