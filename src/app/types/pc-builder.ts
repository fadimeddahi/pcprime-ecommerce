// PC Builder Types

export interface CPU {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  name: string;          // "Intel Core i7-13700K"
  socket: string;        // "LGA1700"
  cores: number;         // 16
  threads: number;       // 24
  price: number;         // 399.99
}

export interface Motherboard {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  name: string;          // "ASUS ROG Strix Z790-E"
  socket: string;        // "LGA1700"
  form_factor: string;   // "ATX"
  price: number;         // 199.99
}

export interface RAM {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  name: string;          // "Corsair Vengeance DDR5"
  capacity: number;      // 32 GB
  speed: number;         // 6000 MHz
  type: string;          // "DDR5"
  price: number;         // 149.99
}

export interface Storage {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  name: string;          // "Samsung 980 PRO"
  capacity: number;      // 1000 GB
  type: string;          // "SSD" or "HDD"
  price: number;         // 129.99
}

export interface Monitor {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  name: string;          // "LG UltraGear 27GP950"
  size: number;          // 27.0 inches
  refresh_rate: number;  // 144 Hz
  price: number;         // 499.99
}

export interface BuildRequest {
  cpu_id: number;
  motherboard_id: number;
  ram_id: number;
  storage_id: number;
  monitor_id: number;
}

export interface BuildResponse {
  compatible: boolean;
  warnings: string[];
  bottleneck: string;
  score: number;
}
