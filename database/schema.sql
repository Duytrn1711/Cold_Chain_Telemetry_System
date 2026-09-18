-- =========================================
-- 1. WAREHOUSE
-- =========================================
CREATE TABLE warehouse (
    id BIGINT PRIMARY KEY,
    warehouse_name VARCHAR(255) NOT NULL,
    longitude DECIMAL(10, 7),
    latitude DECIMAL(10, 7),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- 2. DELIVERY VEHICLE
-- =========================================
CREATE TABLE delivery_vehicle (
    id BIGINT PRIMARY KEY,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    warehouse_id BIGINT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_vehicle_warehouse
        FOREIGN KEY (warehouse_id)
        REFERENCES warehouse(id)
);


-- =========================================
-- 3. DEVICE
-- =========================================
CREATE TABLE device (
    id BIGINT PRIMARY KEY,
    device_token VARCHAR(255) NOT NULL UNIQUE,
    warehouse_id BIGINT,
    vehicle_id BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_device_warehouse
        FOREIGN KEY (warehouse_id)
        REFERENCES warehouse(id),

    CONSTRAINT fk_device_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES delivery_vehicle(id)
);


-- =========================================
-- 4. DATA
-- =========================================
CREATE TABLE data (
    id BIGINT PRIMARY KEY,
    device_id BIGINT NOT NULL,
    temperature DECIMAL(5, 2),
    humidity DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_data_device
        FOREIGN KEY (device_id)
        REFERENCES device(id)
);


-- =========================================
-- 5. ALERT
-- =========================================
CREATE TABLE alert (
    id BIGINT PRIMARY KEY,
    device_id BIGINT NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    alert_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_alert_device
        FOREIGN KEY (device_id)
        REFERENCES device(id)
);

-- =========================================
-- 6. USER
-- =========================================
CREATE TABLE users (
    id BIGINT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO warehouse
(id, warehouse_name, longitude, latitude, status)
VALUES
(1, 'Kho lạnh Hà Nội', 105.8342, 21.0278, 'ACTIVE'),
(2, 'Kho lạnh Hải Phòng', 106.6881, 20.8449, 'ACTIVE'),
(3, 'Kho lạnh Đà Nẵng', 108.2022, 16.0544, 'ACTIVE'),
(4, 'Kho lạnh TP Hồ Chí Minh', 106.6297, 10.8231, 'ACTIVE'),
(5, 'Kho lạnh Cần Thơ', 105.7469, 10.0452, 'ACTIVE');

INSERT INTO delivery_vehicle
(id, license_plate, warehouse_id, status)
VALUES
(1, '29A-12345', 1, 'ACTIVE'),
(2, '29A-67890', 1, 'ACTIVE'),

(3, '15A-12345', 2, 'ACTIVE'),
(4, '15A-67890', 2, 'ACTIVE'),

(5, '43A-13579', 3, 'ACTIVE'),
(6, '43A-24680', 3, 'ACTIVE'),

(7, '51D-11223', 4, 'ACTIVE'),
(8, '51D-44556', 4, 'ACTIVE'),

(9, '65A-77889', 5, 'ACTIVE'),
(10, '65A-99001', 5, 'ACTIVE');

INSERT INTO device
(id, device_token, warehouse_id, vehicle_id, status)
VALUES
(1, 'DEVICE-TOKEN-001', 1, 1, 'ACTIVE'),
(2, 'DEVICE-TOKEN-002', 1, 2, 'ACTIVE'),
(3, 'DEVICE-TOKEN-003', 1, 2, 'ACTIVE'),

(4, 'DEVICE-TOKEN-004', 2, 3, 'ACTIVE'),
(5, 'DEVICE-TOKEN-005', 2, 4, 'ACTIVE'),
(6, 'DEVICE-TOKEN-006', 2, 4, 'ACTIVE'),

(7, 'DEVICE-TOKEN-007', 3, 5, 'ACTIVE'),
(8, 'DEVICE-TOKEN-008', 3, 6, 'ACTIVE'),
(9, 'DEVICE-TOKEN-009', 3, 6, 'ACTIVE'),

(10, 'DEVICE-TOKEN-010', 4, 7, 'ACTIVE'),
(11, 'DEVICE-TOKEN-011', 4, 7, 'ACTIVE'),
(12, 'DEVICE-TOKEN-012', 4, 8, 'ACTIVE'),

(13, 'DEVICE-TOKEN-013', 5, 9, 'ACTIVE'),
(14, 'DEVICE-TOKEN-014', 5, 10, 'ACTIVE');

INSERT INTO data
(id, device_id, temperature, humidity, created_at)
VALUES
(1, 1, 5.20, 78.50, '2026-09-16 08:00:00'),
(2, 2, 6.10, 80.20, '2026-09-16 08:05:00'),
(3, 3, 7.30, 82.10, '2026-09-16 08:10:00'),
(4, 4, 4.80, 76.40, '2026-09-16 08:15:00'),
(5, 5, 6.50, 79.30, '2026-09-16 08:20:00'),

(6, 6, 7.80, 83.20, '2026-09-16 08:25:00'),
(7, 7, 5.60, 77.80, '2026-09-16 08:30:00'),
(8, 8, 6.90, 81.50, '2026-09-16 08:35:00'),
(9, 9, 3.70, 75.60, '2026-09-16 08:40:00'),
(10, 10, 5.90, 80.10, '2026-09-16 08:45:00'),

(11, 11, 8.70, 84.50, '2026-09-16 08:50:00'),
(12, 12, 9.20, 85.10, '2026-09-16 08:55:00'),
(13, 13, 6.30, 79.80, '2026-09-16 09:00:00'),
(14, 14, 7.10, 81.20, '2026-09-16 09:05:00'),
(15, 1, 5.80, 78.90, '2026-09-16 09:10:00'),

(16, 2, 6.40, 80.50, '2026-09-16 09:15:00'),
(17, 5, 12.00, 86.30, '2026-09-16 09:20:00'),
(18, 8, 7.50, 82.40, '2026-09-16 09:25:00'),
(19, 10, 2.40, 74.80, '2026-09-16 09:30:00'),
(20, 13, 5.10, 77.60, '2026-09-16 09:35:00');

INSERT INTO users
(id, username, password, full_name, role, status)
VALUES
(1, 'admin', 'admin123', 'Quản trị viên', 'ADMIN', 'ACTIVE'),
(2, 'manager', 'manager123', 'Quản lý kho', 'MANAGER', 'ACTIVE'),
(3, 'user', 'user123', 'Nhân viên', 'USER', 'ACTIVE');