import { Timestamp } from "firebase/firestore";

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

export interface UserInterface {
  id: string;
  email: string;
  fullName: string;
  age: string;
  gender: string;
  imageUrl: string;
  role: string;
}

export interface BookingInterface {
  id: string;
  additionalDetail: string;
  userId: string;
  userName: string;
  categoryService: string;
  specificService: string;
  status: string;
  createdAt: Timestamp;

  barangay: {
    code: string;
    name: string;
  };
  city: {
    code: string;
    name: string;
  };
  province: {
    code: string;
    name: string;
  };
  region: {
    code: string;
    name: string;
  };
}

export interface ConversationInterface {
  id: string;
  user1Id: string;
  user2Id: string;
  user1FullName: string;
  user2FullName: string;
  user1ImageUrl: string;
  user2ImageUrl: string;
  lastMessage: string;
  createdAt: Timestamp;
  read: boolean;
  unreadCount: 2;
}
