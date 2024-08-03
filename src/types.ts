export interface RegionInterface {
  id: number;
  psgc_code: string;
  region_name: string;
  region_code: string;
}

export interface ProvinceInterface {
  province_code: string;
  province_name: string;
  psgc_code: string;
  region_code: string;
}

export interface CityInterface {
  city_code: string;
  city_name: string;
  province_code: string;
  psgc_code: string;
  region_desc: string;
}

export interface BarangayInterface {
  brgy_code: string;
  brgy_name: string;
  city_code: string;
  province_code: string;
  region_code: string;
}
