import { MainformListDataSource } from "./LeggeraDataSource";

export interface TableOrderConfig {
    col: keyof MainformListDataSource,
    sort: string
}