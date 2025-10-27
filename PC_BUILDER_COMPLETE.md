# PC Builder System - Complete Integration Guide

## 🎯 Overview

Complete PC Builder system integrated with your backend API at `https://pcprimedz.onrender.com`. Features real-time component selection, AI-powered compatibility checking, bottleneck detection, and build scoring.

---

## ✅ Files Created

### 1. **Types Definition** (`src/app/types/pc-builder.ts`)
- `CPU` - Processor specifications
- `Motherboard` - Motherboard details
- `RAM` - Memory modules
- `Storage` - Storage devices (SSD/HDD)
- `Monitor` - Display specifications
- `BuildRequest` - Compatibility check request
- `BuildResponse` - AI analysis response

### 2. **API Service** (`src/app/services/api.ts`)
Added `pcBuilderApi` with methods:
- `getAllCPUs()` - GET /cpu/all
- `getAllMotherboards()` - GET /motherboard/all
- `getAllRAM()` - GET /ram/all
- `getAllStorage()` - GET /storage/all
- `getAllMonitors()` - GET /monitor/all
- `checkBuildCompatibility()` - POST /build/check

### 3. **PC Builder Page** (`src/app/pc-builder/page.tsx`)
Complete UI with component selection and AI analysis

---

## 🔧 Backend API Integration

### Component Endpoints

#### 1. Get All CPUs
```
GET https://pcprimedz.onrender.com/cpu/all
```

**Response:**
```json
[
  {
    "ID": 1,
    "CreatedAt": "2025-10-20T10:00:00Z",
    "UpdatedAt": "2025-10-20T10:00:00Z",
    "DeletedAt": null,
    "name": "Intel Core i7-13700K",
    "socket": "LGA1700",
    "cores": 16,
    "threads": 24,
    "price": 399.99
  }
]
```

---

#### 2. Get All Motherboards
```
GET https://pcprimedz.onrender.com/motherboard/all
```

**Response:**
```json
[
  {
    "ID": 3,
    "CreatedAt": "2025-10-20T10:00:00Z",
    "UpdatedAt": "2025-10-20T10:00:00Z",
    "DeletedAt": null,
    "name": "ASUS ROG Strix Z790-E",
    "socket": "LGA1700",
    "form_factor": "ATX",
    "price": 199.99
  }
]
```

---

#### 3. Get All RAM
```
GET https://pcprimedz.onrender.com/ram/all
```

**Response:**
```json
[
  {
    "ID": 5,
    "CreatedAt": "2025-10-20T10:00:00Z",
    "UpdatedAt": "2025-10-20T10:00:00Z",
    "DeletedAt": null,
    "name": "Corsair Vengeance DDR5",
    "capacity": 32,
    "speed": 6000,
    "type": "DDR5",
    "price": 149.99
  }
]
```

---

#### 4. Get All Storage
```
GET https://pcprimedz.onrender.com/storage/all
```

**Response:**
```json
[
  {
    "ID": 2,
    "CreatedAt": "2025-10-20T10:00:00Z",
    "UpdatedAt": "2025-10-20T10:00:00Z",
    "DeletedAt": null,
    "name": "Samsung 980 PRO",
    "capacity": 1000,
    "type": "SSD",
    "price": 129.99
  }
]
```

---

#### 5. Get All Monitors
```
GET https://pcprimedz.onrender.com/monitor/all
```

**Response:**
```json
[
  {
    "ID": 7,
    "CreatedAt": "2025-10-20T10:00:00Z",
    "UpdatedAt": "2025-10-20T10:00:00Z",
    "DeletedAt": null,
    "name": "LG UltraGear 27GP950",
    "size": 27.0,
    "refresh_rate": 144,
    "price": 499.99
  }
]
```

---

### Compatibility Check Endpoint

#### POST /build/check
```
POST https://pcprimedz.onrender.com/build/check
Content-Type: application/json
```

**Request Body:**
```json
{
  "cpu_id": 1,
  "motherboard_id": 3,
  "ram_id": 5,
  "storage_id": 2,
  "monitor_id": 7
}
```

**Response:**
```json
{
  "compatible": true,
  "warnings": [
    "RAM speed might bottleneck CPU performance",
    "Monitor refresh rate may not fully utilize GPU capabilities"
  ],
  "bottleneck": "RAM",
  "score": 85.5
}
```

---

## 🎨 User Interface Features

### Component Selection Cards
Each component type has its own selection card:

#### CPU Card
- **Displays:** Name, Socket, Cores, Threads, Price
- **Example:** Intel Core i7-13700K | LGA1700 | 16 Cores / 24 Threads

#### Motherboard Card
- **Displays:** Name, Socket, Form Factor, Price
- **Example:** ASUS ROG Strix Z790-E | LGA1700 | ATX

#### RAM Card
- **Displays:** Name, Capacity, Type, Speed, Price
- **Example:** Corsair Vengeance DDR5 | 32 GB | DDR5 | 6000 MHz

#### Storage Card
- **Displays:** Name, Type, Capacity, Price
- **Example:** Samsung 980 PRO | SSD | 1000 GB

#### Monitor Card
- **Displays:** Name, Size, Refresh Rate, Price
- **Example:** LG UltraGear 27GP950 | 27" | 144 Hz

---

### Build Summary Sidebar

**Shows:**
- ✅ Selected components with icons
- ✅ Individual component prices
- ✅ Total build price (real-time calculation)
- ✅ "Check Compatibility" button
- ✅ Error messages
- ✅ Build analysis results

**Features:**
- Sticky positioning (stays visible on scroll)
- Real-time price updates
- Dark/light theme support
- Animated transitions

---

### Compatibility Results Display

#### When Compatible (score >= 80):
```
✅ Build Compatible
Score: 85/100
Goulot d'étranglement: RAM
Avertissements:
• RAM speed might bottleneck CPU performance
• Monitor refresh rate may not fully utilize GPU capabilities
```

#### When Incompatible (score < 80):
```
❌ Problèmes Détectés
Score: 45/100
Goulot d'étranglement: CPU
Avertissements:
• CPU socket does not match motherboard
• RAM type not supported by motherboard
• Significant performance bottleneck detected
```

---

## 🔄 User Flow

### Step 1: Component Loading
```
User navigates to /pc-builder
    ↓
Page loads all components in parallel
    ↓
5 API calls executed simultaneously:
- GET /cpu/all
- GET /motherboard/all
- GET /ram/all
- GET /storage/all
- GET /monitor/all
    ↓
Components displayed in selection cards
```

---

### Step 2: Component Selection
```
User clicks CPU → Intel Core i7-13700K selected
    ↓
CPU card highlighted with orange border
    ↓
CPU added to build summary (sidebar)
    ↓
Total price updated: 399.99 DZD
    ↓
Repeat for: Motherboard, RAM, Storage, Monitor
```

---

### Step 3: Compatibility Check
```
All 5 components selected
    ↓
"Check Compatibility" button enabled
    ↓
User clicks button
    ↓
API Request: POST /build/check
{
  "cpu_id": 1,
  "motherboard_id": 3,
  "ram_id": 5,
  "storage_id": 2,
  "monitor_id": 7
}
    ↓
Backend AI analyzes build
    ↓
Response received:
{
  "compatible": true,
  "warnings": [...],
  "bottleneck": "RAM",
  "score": 85.5
}
    ↓
Results displayed in sidebar
```

---

## 🧪 Example Build Scenarios

### Scenario 1: Perfect Build
```typescript
Selection:
- CPU: Intel Core i9-13900K (LGA1700, 24 cores)
- Motherboard: ASUS ROG Maximus Z790 (LGA1700, ATX)
- RAM: G.Skill Trident Z5 (64GB, DDR5, 6400MHz)
- Storage: Samsung 990 PRO (2TB, SSD)
- Monitor: ASUS ROG Swift (27", 240Hz)

Result:
✅ Compatible: true
Score: 95/100
Bottleneck: None
Warnings: []
```

---

### Scenario 2: Socket Mismatch
```typescript
Selection:
- CPU: Intel Core i7-13700K (LGA1700)
- Motherboard: ASUS Prime B550 (AM4) ❌
- RAM: Corsair Vengeance DDR5 (32GB)
- Storage: Samsung 980 PRO (1TB)
- Monitor: LG UltraGear (27", 144Hz)

Result:
❌ Compatible: false
Score: 35/100
Bottleneck: CPU
Warnings: [
  "CPU socket (LGA1700) does not match motherboard socket (AM4)",
  "Build cannot be assembled"
]
```

---

### Scenario 3: Bottleneck Warning
```typescript
Selection:
- CPU: Intel Core i9-13900K (High-end)
- Motherboard: MSI MPG Z790 (LGA1700)
- RAM: Kingston ValueRAM (16GB, DDR4, 2666MHz) ⚠️
- Storage: Samsung 980 PRO (1TB, SSD)
- Monitor: Samsung Odyssey (32", 165Hz)

Result:
✅ Compatible: true
Score: 68/100
Bottleneck: RAM
Warnings: [
  "RAM speed (2666MHz) will significantly bottleneck CPU performance",
  "Recommend DDR5 RAM for optimal performance",
  "16GB RAM may be insufficient for high-end gaming"
]
```

---

## 💰 Price Calculation

### Real-Time Total:
```typescript
const getTotalPrice = () => {
  let total = 0;
  if (selectedCPU) total += cpus.find(c => c.ID === selectedCPU)?.price || 0;
  if (selectedMotherboard) total += motherboards.find(m => m.ID === selectedMotherboard)?.price || 0;
  if (selectedRAM) total += rams.find(r => r.ID === selectedRAM)?.price || 0;
  if (selectedStorage) total += storages.find(s => s.ID === selectedStorage)?.price || 0;
  if (selectedMonitor) total += monitors.find(m => m.ID === selectedMonitor)?.price || 0;
  return total;
};
```

### Example:
```
CPU: 399.99 DZD
Motherboard: 199.99 DZD
RAM: 149.99 DZD
Storage: 129.99 DZD
Monitor: 499.99 DZD
─────────────────────
Total: 1,379.95 DZD
```

---

## 🎯 Key Features Implemented

### ✅ Real-Time Component Loading
- Fetches all components from backend on page load
- Parallel API calls for faster loading
- Loading spinner during fetch

### ✅ Socket Compatibility
- Checks CPU socket matches motherboard socket
- Visual feedback for incompatible selections

### ✅ AI Analysis (Backend)
- Ollama AI analyzes build balance
- Identifies bottlenecks
- Provides detailed warnings

### ✅ Build Score (0-100)
- Based on component compatibility
- Considers performance balance
- Weighted scoring algorithm

### ✅ Bottleneck Detection
- Identifies weakest component
- Suggests upgrades
- Performance impact analysis

### ✅ Price Calculator
- Real-time total from database prices
- Individual component prices
- Currency formatting (DZD)

### ✅ Detailed Warnings
- Specific compatibility issues
- Performance recommendations
- Upgrade suggestions

### ✅ Responsive Design
- Mobile-friendly layout
- Tablet optimization
- Desktop grid layout

### ✅ Error Handling
- Graceful API failure handling
- User-friendly error messages
- Console logging for debugging

### ✅ Dark/Light Theme
- Matches site theme
- Smooth transitions
- Consistent styling

---

## 🔧 Component State Management

```typescript
// Component lists (from backend)
const [cpus, setCpus] = useState<CPU[]>([]);
const [motherboards, setMotherboards] = useState<Motherboard[]>([]);
const [rams, setRams] = useState<RAM[]>([]);
const [storages, setStorages] = useState<Storage[]>([]);
const [monitors, setMonitors] = useState<Monitor[]>([]);

// Selected components (IDs)
const [selectedCPU, setSelectedCPU] = useState<number | null>(null);
const [selectedMotherboard, setSelectedMotherboard] = useState<number | null>(null);
const [selectedRAM, setSelectedRAM] = useState<number | null>(null);
const [selectedStorage, setSelectedStorage] = useState<number | null>(null);
const [selectedMonitor, setSelectedMonitor] = useState<number | null>(null);

// UI state
const [loading, setLoading] = useState(true);
const [checking, setChecking] = useState(false);
const [buildResult, setBuildResult] = useState<BuildResponse | null>(null);
const [error, setError] = useState("");
```

---

## 📊 Console Logging

### Component Loading:
```javascript
// Success
console.log("✅ Components loaded:", { cpus, motherboards, rams, storages, monitors });

// Error
console.error("❌ Error loading components:", err);
```

### Compatibility Check:
```javascript
// Request
console.log("🔍 Checking build compatibility:", {
  cpu_id: 1,
  motherboard_id: 3,
  ram_id: 5,
  storage_id: 2,
  monitor_id: 7
});

// Response
console.log("✅ Compatibility result:", {
  compatible: true,
  warnings: [...],
  bottleneck: "RAM",
  score: 85.5
});

// Error
console.error("❌ Compatibility check error:", err);
```

---

## 🚀 Access the PC Builder

### URL:
```
http://localhost:3001/pc-builder
```

### Navigation:
Add to navbar or create a link:
```tsx
<a href="/pc-builder">PC Builder</a>
```

---

## 🎨 UI Components

### ComponentSelector
Reusable component for selecting from a list:
```tsx
<ComponentSelector
  title="Processeur (CPU)"
  icon={<FaMicrochip />}
  components={cpus}
  selected={selectedCPU}
  onSelect={setSelectedCPU}
  theme={theme}
  renderDetails={(cpu) => (
    <>
      <p>Socket: {cpu.socket}</p>
      <p>{cpu.cores} Cores / {cpu.threads} Threads</p>
    </>
  )}
/>
```

### BuildItem
Displays selected component in summary:
```tsx
<BuildItem 
  icon={<FaMicrochip />} 
  name="Intel Core i7-13700K" 
  price={399.99} 
  theme={theme} 
/>
```

---

## 🧪 Testing Guide

### Test 1: Load Components
```
1. Navigate to /pc-builder
2. Check console for component loading
3. Verify all 5 component types display
4. Check prices are correct
```

### Test 2: Select Components
```
1. Click each component type
2. Verify selection highlighting
3. Check build summary updates
4. Verify total price calculation
```

### Test 3: Compatibility Check
```
1. Select all 5 components
2. Click "Check Compatibility"
3. Verify loading state
4. Check results display
5. Verify score, warnings, bottleneck
```

### Test 4: Socket Mismatch
```
1. Select Intel CPU (LGA1700)
2. Select AMD Motherboard (AM4)
3. Click compatibility check
4. Expect incompatibility error
```

### Test 5: Error Handling
```
1. Turn off backend server
2. Try to load page
3. Verify error message displays
4. Restart server and reload
```

---

## 🎉 Status

**PC Builder is complete and ready to use! 🚀**

Users can now:
- ✅ Browse all PC components
- ✅ Build custom PC configurations
- ✅ Check compatibility with AI
- ✅ See build scores and warnings
- ✅ Identify bottlenecks
- ✅ Calculate total cost

**Navigate to `/pc-builder` to start building!** 🖥️
